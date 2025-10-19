/**
 * Servicio de persistencia de progreso con soporte multi-pestaña
 * Gestiona guardado/carga en localStorage e IndexedDB y sincroniza entre pestañas
 */

import { progressValidator } from './progressValidator';
import { progressMigrator } from './progressMigrator';

const STORAGE_KEYS = {
  PROFILE: 'cxcc_profile',
  PROGRESS_HEAD: 'cxcc_progress_head',
  TELEMETRY_QUEUE: 'cxcc_telemetry_queue',
  PL300_PROFILE: 'pl300_user_profile_v2'
};

const DB_NAME = 'cxcc_app_v1';
const DB_VERSION = 2;
const BROADCAST_CHANNEL = 'cxcc-progress-sync';
const LEADER_KEY = 'cxcc_progress_leader';
const LEADER_TTL = 8000; // ms
const HEARTBEAT_INTERVAL = 3000; // ms
const LEADER_CHECK_INTERVAL = 4000; // ms
const REQUEST_TIMEOUT = 4500; // ms

const generateId = (prefix) => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

class ProgressService {
  constructor() {
    this.db = null;
    this.dbReady = this.initDB();

    this.clientId = generateId('client');
    this.channel = null;
    this.isLeader = false;
    this.currentLeader = null;
    this.leaderHeartbeatTimer = null;
    this.leaderCheckTimer = null;
    this.pendingSaveRequests = new Map();
    this.eventListeners = new Map();

    // ✅ NUEVO: Sistema de cola y deduplicación
    this.saveQueue = [];
    this.isSaving = false;
    this.lastSaveHash = null;
    this.lastSaveTime = 0;
    this.MIN_SAVE_INTERVAL = 500; // Mínimo 500ms entre guardados

    this.handleChannelMessage = this.handleChannelMessage.bind(this);
    this.handleStorageEvent = this.handleStorageEvent.bind(this);
    this.handleBeforeUnload = this.handleBeforeUnload.bind(this);

    if (typeof window !== 'undefined') {
      this.initBroadcastChannel();
    }
  }

  // --------- Gestión de listeners internos ---------

  on(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set());
    }
    const listeners = this.eventListeners.get(eventName);
    listeners.add(callback);
    return () => this.off(eventName, callback);
  }

  off(eventName, callback) {
    const listeners = this.eventListeners.get(eventName);
    if (!listeners) return;
    listeners.delete(callback);
    if (listeners.size === 0) {
      this.eventListeners.delete(eventName);
    }
  }

  emit(eventName, payload) {
    const listeners = this.eventListeners.get(eventName);
    if (!listeners) return;
    listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (error) {
        console.error(`Error en listener de ${eventName}:`, error);
      }
    });
  }

  // --------- Inicialización de IndexedDB ---------

  async initDB() {
    return new Promise((resolve, reject) => {
      if (typeof indexedDB === 'undefined') {
        reject(new Error('IndexedDB no disponible'));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('MissionSnapshots')) {
          const snapshotStore = db.createObjectStore('MissionSnapshots', {
            keyPath: 'snapshotId'
          });
          snapshotStore.createIndex('missionId', 'missionId', { unique: false });
          snapshotStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains('ProgressHistory')) {
          const historyStore = db.createObjectStore('ProgressHistory', {
            keyPath: 'id',
            autoIncrement: true
          });
          historyStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('AssetsCache')) {
          db.createObjectStore('AssetsCache', { keyPath: 'assetId' });
        }

        if (!db.objectStoreNames.contains('UserProfiles')) {
          const profileStore = db.createObjectStore('UserProfiles', {
            keyPath: 'userId'
          });
          profileStore.createIndex('updatedAt', 'updatedAt', { unique: false });
        }
      };
    });
  }

  async ensureDB() {
    // Si ya tenemos una conexión válida y no está cerrada, reutilizarla
    if (this.db && !this.db.closePending) {
      return this.db;
    }
    
    // Si la conexión está cerrada o no existe, reiniciar
    try {
      console.log('🔄 Reiniciando conexión IndexedDB...');
      this.db = null;
      this.dbReady = this.initDB();
      this.db = await this.dbReady;
      console.log('✅ IndexedDB reconectada correctamente');
    } catch (error) {
      console.warn('⚠️ IndexedDB no disponible:', error.message);
      this.db = null;
    }
    return this.db;
  }

  // --------- Broadcast y liderazgo multi-pestaña ---------

  initBroadcastChannel() {
    if (typeof BroadcastChannel === 'undefined') {
      console.warn('BroadcastChannel no soportado; modo single-tab.');
      return;
    }

    this.channel = new BroadcastChannel(BROADCAST_CHANNEL);
    this.channel.onmessage = this.handleChannelMessage;

    window.addEventListener('storage', this.handleStorageEvent);
    window.addEventListener('beforeunload', this.handleBeforeUnload);

    this.evaluateLeadership(true);
    this.leaderCheckTimer = setInterval(() => this.evaluateLeadership(), LEADER_CHECK_INTERVAL);

    this.channel.postMessage({
      type: 'request-leader',
      payload: { clientId: this.clientId }
    });
  }

  handleBeforeUnload() {
    const record = this.getLeaderRecord();
    if (record && record.clientId === this.clientId) {
      localStorage.removeItem(LEADER_KEY);
      this.channel?.postMessage({
        type: 'leader-relinquished',
        payload: { clientId: this.clientId }
      });
    }

    this.relinquishLeadership();
    this.channel?.close();
    window.removeEventListener('storage', this.handleStorageEvent);
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
    clearInterval(this.leaderCheckTimer);
  }

  handleStorageEvent(event) {
    if (event.key === LEADER_KEY) {
      const record = this.getLeaderRecord();
      if (!record) {
        this.evaluateLeadership(true);
        return;
      }

      if (record.clientId === this.clientId) {
        if (!this.isLeader) {
          this.becomeLeader();
        }
      } else {
        this.currentLeader = record;
        if (this.isLeader) {
          this.relinquishLeadership(false);
        }
      }
      return;
    }

    if (event.key === STORAGE_KEYS.PL300_PROFILE && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        this.emit('user-profile-storage', parsed);
      } catch (error) {
        console.warn('No se pudo sincronizar perfil PL300 desde storage:', error);
      }
    }
  }

  handleChannelMessage(event) {
    const { type, payload } = event.data || {};
    if (!type) return;

    switch (type) {
      case 'leader-announcement':
      case 'leader-heartbeat': {
        if (!payload) return;
        this.currentLeader = {
          clientId: payload.clientId,
          timestamp: Date.now()
        };
        if (payload.clientId === this.clientId && !this.isLeader) {
          this.becomeLeader();
        }
        if (payload.clientId !== this.clientId && this.isLeader) {
          this.relinquishLeadership(false);
        }
        break;
      }
      case 'leader-relinquished': {
        if (payload?.clientId === this.currentLeader?.clientId) {
          this.currentLeader = null;
          this.evaluateLeadership(true);
        }
        break;
      }
      case 'request-leader': {
        if (this.isLeader) {
          this.channel?.postMessage({
            type: 'leader-announcement',
            payload: { clientId: this.clientId }
          });
        }
        break;
      }
      case 'request-save': {
        if (!this.isLeader || !payload) return;
        this.handleIncomingSaveRequest(payload).catch((error) => {
          console.error('Error al procesar request-save:', error);
        });
        break;
      }
      case 'save-response': {
        const pending = this.pendingSaveRequests.get(payload?.requestId);
        if (!pending) return;
        this.pendingSaveRequests.delete(payload.requestId);
        if (payload.status === 'ok') {
          pending.resolve(payload.meta);
        } else {
          pending.reject(new Error(payload.error || 'Error desconocido en guardado remoto'));
        }
        break;
      }
      case 'head-updated': {
        if (!payload) return;
        this.applyRemoteSnapshot(payload).catch((error) => {
          console.error('Error al aplicar snapshot remoto:', error);
        });
        this.emit('remote-save', payload);
        break;
      }
      case 'save-error': {
        if (!payload) return;
        console.warn('save-error remoto', payload);
        break;
      }
      case 'user-profile-updated': {
        if (!payload?.profile) return;
        this.cacheUserProfileState(payload.profile, {
          updatedAt: payload.updatedAt,
          source: 'broadcast'
        }).catch((error) => {
          console.error('Error al sincronizar perfil remoto:', error);
        });
        this.emit('user-profile-sync', payload);
        break;
      }
      default:
        break;
    }
  }

  async handleIncomingSaveRequest(payload) {
    const { requestId, data, source = 'remote' } = payload;
    try {
      const meta = await this.performSave(data, { broadcast: true, source });
      this.channel?.postMessage({
        type: 'save-response',
        payload: {
          status: 'ok',
          requestId,
          meta
        }
      });
    } catch (error) {
      this.channel?.postMessage({
        type: 'save-response',
        payload: {
          status: 'error',
          requestId,
          error: error.message
        }
      });
      this.channel?.postMessage({
        type: 'save-error',
        payload: {
          requestId,
          error: error.message,
          source
        }
      });
      throw error;
    }
  }

  getLeaderRecord() {
    try {
      const raw = localStorage.getItem(LEADER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn('No se pudo leer LEADER_KEY:', error);
      return null;
    }
  }

  setLeaderRecord(record) {
    localStorage.setItem(LEADER_KEY, JSON.stringify(record));
  }

  evaluateLeadership(force = false) {
    const now = Date.now();
    const record = this.getLeaderRecord();

    if (!record || now - record.timestamp > LEADER_TTL || force) {
      this.claimLeadership();
      return;
    }

    this.currentLeader = record;
    if (record.clientId === this.clientId) {
      this.becomeLeader();
    } else if (this.isLeader) {
      this.relinquishLeadership(false);
    }
  }

  claimLeadership() {
    const record = {
      clientId: this.clientId,
      timestamp: Date.now()
    };
    this.setLeaderRecord(record);
    this.becomeLeader();
  }

  becomeLeader() {
    if (this.isLeader) {
      this.currentLeader = {
        clientId: this.clientId,
        timestamp: Date.now()
      };
      return;
    }

    this.isLeader = true;
    this.currentLeader = {
      clientId: this.clientId,
      timestamp: Date.now()
    };

    this.channel?.postMessage({
      type: 'leader-announcement',
      payload: { clientId: this.clientId }
    });

    this.emit('leader-change', { isLeader: true, clientId: this.clientId });
    this.startHeartbeat();
  }

  relinquishLeadership(broadcast = true) {
    if (!this.isLeader) return;

    this.isLeader = false;
    this.stopHeartbeat();
    if (broadcast) {
      this.channel?.postMessage({
        type: 'leader-relinquished',
        payload: { clientId: this.clientId }
      });
    }
    this.emit('leader-change', { isLeader: false, clientId: this.clientId });
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.leaderHeartbeatTimer = setInterval(() => {
      const record = {
        clientId: this.clientId,
        timestamp: Date.now()
      };
      this.setLeaderRecord(record);
      this.channel?.postMessage({
        type: 'leader-heartbeat',
        payload: { clientId: this.clientId }
      });
    }, HEARTBEAT_INTERVAL);
  }

  stopHeartbeat() {
    if (this.leaderHeartbeatTimer) {
      clearInterval(this.leaderHeartbeatTimer);
      this.leaderHeartbeatTimer = null;
    }
  }

  // --------- Utilidades de checksum ---------

  generateSnapshotId() {
    return generateId('snap');
  }

  generateChecksum(data) {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i += 1) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return `sha1:${Math.abs(hash).toString(16)}`;
  }

  // --------- API pública principal ---------

  createInitialProgress() {
    const userId = generateId('user');

    const initialSnapshot = {
      version: progressMigrator.LATEST_VERSION,
      user: {
        id: userId,
        name: 'Usuario',
        role: 'Auxiliar Jr',
        preferences: {
          language: 'es',
          darkMode: true
        }
      },
      progress: {
        currentAct: 0,
        missions: {},
        points: {
          total: 0,
          available: 0,
          spentOnHelps: 0,
          currentRank: 'Bronce'
        },
        badges: [],
        achievements: [],
        finalPath: null,
        updatedAt: new Date().toISOString(),
        checksum: null
      }
    };

    const { snapshot } = progressMigrator.migrate(initialSnapshot);
    progressValidator.assertValid(snapshot);
    return snapshot;
  }

  // ✅ Generar hash de los datos para detectar duplicados
  generateDataHash(data) {
    const str = JSON.stringify({
      totalPoints: data?.progress?.totalPoints,
      quizzesTaken: data?.progress?.quizzesTaken,
      answeredQuestions: data?.progress?.answeredQuestions?.length,
      timestamp: Math.floor(Date.now() / 1000) // Precisión de segundos
    });
    
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  async saveProgress(progressData, options = {}) {
    const { source = 'autosave' } = options;

    // ✅ Generar hash para detectar duplicados
    const dataHash = this.generateDataHash(progressData);
    
    // ✅ Si es el mismo hash que el último guardado, ignorar
    if (this.lastSaveHash === dataHash) {
      console.log('⏭️ Datos idénticos al último guardado, ignorando');
      return { 
        success: true, 
        skipped: true,
        timestamp: new Date().toISOString() 
      };
    }

    // ✅ Throttling: Evitar guardados muy frecuentes
    const now = Date.now();
    if (now - this.lastSaveTime < this.MIN_SAVE_INTERVAL) {
      console.log('⏸️ Guardado muy reciente, agregando a cola');
      return new Promise((resolve, reject) => {
        this.saveQueue.push({ 
          data: progressData, 
          options, 
          resolve, 
          reject,
          hash: dataHash,
          timestamp: now
        });
        
        if (!this.isSaving) {
          setTimeout(() => this.processSaveQueue(), this.MIN_SAVE_INTERVAL);
        }
      });
    }

    // ✅ Guardar inmediatamente
    this.lastSaveHash = dataHash;
    this.lastSaveTime = now;

    if (!this.channel || this.isLeader) {
      return this.performSave(progressData, { broadcast: true, source });
    }

    try {
      return await this.sendSaveRequest(progressData, source);
    } catch (error) {
      console.warn('Fallo guardado remoto, intentando fallback local:', error.message);
      return this.performSave(progressData, { broadcast: false, source: 'fallback' });
    }
  }

  // ✅ Procesar cola de guardados
  async processSaveQueue() {
    if (this.saveQueue.length === 0) {
      this.isSaving = false;
      return;
    }

    this.isSaving = true;
    
    // ✅ Tomar el último elemento (más reciente) y descartar los demás similares
    const current = this.saveQueue.pop();
    
    // ✅ Eliminar elementos duplicados de la cola
    this.saveQueue = this.saveQueue.filter(item => 
      item.hash !== current.hash
    );

    try {
      this.lastSaveHash = current.hash;
      this.lastSaveTime = Date.now();
      
      const result = !this.channel || this.isLeader
        ? await this.performSave(current.data, { broadcast: true, source: current.options.source })
        : await this.sendSaveRequest(current.data, current.options.source);
      
      current.resolve(result);
    } catch (error) {
      current.reject(error);
    }

    // ✅ Procesar siguiente elemento después de un delay
    if (this.saveQueue.length > 0) {
      setTimeout(() => this.processSaveQueue(), this.MIN_SAVE_INTERVAL);
    } else {
      this.isSaving = false;
    }
  }

  async performSave(progressData, options = {}) {
    const nowIso = new Date().toISOString();
    const snapshotId = this.generateSnapshotId();
    const { snapshot: normalizedSnapshot } = progressMigrator.migrate(progressData);
    const sanitizedProgress = {
      ...normalizedSnapshot.progress,
      updatedAt: normalizedSnapshot.progress?.updatedAt || nowIso
    };

    const snapshotPayload = {
      ...normalizedSnapshot,
      progress: sanitizedProgress
    };

    progressValidator.assertValid(snapshotPayload);

    const checksum = this.generateChecksum(snapshotPayload.progress);
    snapshotPayload.progress = {
      ...snapshotPayload.progress,
      checksum
    };

    const headData = {
      snapshotId,
      userId: snapshotPayload.user.id,
      updatedAt: nowIso,
      checksum
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS_HEAD, JSON.stringify(headData));
    localStorage.setItem(
      `${STORAGE_KEYS.PROFILE}_${snapshotPayload.user.id}`,
      JSON.stringify(snapshotPayload.user)
    );

    const db = await this.ensureDB();
    if (db) {
      try {
        await this.saveToIndexedDB('MissionSnapshots', {
          snapshotId,
          ...snapshotPayload,
          savedAt: nowIso
        });

        await this.saveToIndexedDB('ProgressHistory', {
          userId: snapshotPayload.user.id,
          snapshot: snapshotPayload.progress,
          timestamp: nowIso
        });
        console.log('✅ Datos guardados en IndexedDB correctamente');
      } catch (idbError) {
        console.warn('⚠️ Error guardando en IndexedDB, datos ya están en localStorage:', idbError.message);
        // No lanzar error, localStorage ya tiene los datos críticos
      }
    } else {
      console.log('ℹ️ IndexedDB no disponible, usando solo localStorage');
    }

    const meta = { snapshotId, timestamp: nowIso, source: options.source };

    if (options.broadcast !== false && this.channel) {
      this.channel.postMessage({
        type: 'head-updated',
        payload: {
          snapshotId,
          timestamp: nowIso,
          snapshot: snapshotPayload
        }
      });
    }

    this.emit('local-save', { ...meta, snapshot: snapshotPayload });
    return meta;
  }

  async applyRemoteSnapshot({ snapshotId, timestamp, snapshot }) {
    if (!snapshot) return;

    try {
      const { snapshot: migratedSnapshot } = progressMigrator.migrate(snapshot);
      progressValidator.assertValid(migratedSnapshot);

      const headData = {
        snapshotId,
        userId: migratedSnapshot.user.id,
        updatedAt: migratedSnapshot.progress?.updatedAt || timestamp,
        checksum: migratedSnapshot.progress?.checksum || null
      };

      localStorage.setItem(STORAGE_KEYS.PROGRESS_HEAD, JSON.stringify(headData));
      localStorage.setItem(
        `${STORAGE_KEYS.PROFILE}_${migratedSnapshot.user.id}`,
        JSON.stringify(migratedSnapshot.user)
      );

      const db = await this.ensureDB();
      if (db) {
        await this.saveToIndexedDB('MissionSnapshots', {
          snapshotId,
          ...migratedSnapshot,
          savedAt: timestamp
        });

        await this.saveToIndexedDB('ProgressHistory', {
          userId: migratedSnapshot.user.id,
          snapshot: migratedSnapshot.progress,
          timestamp: migratedSnapshot.progress?.updatedAt || timestamp
        });
      }
    } catch (error) {
      console.error('Snapshot remoto inválido:', error);
      throw error;
    }
  }

  async sendSaveRequest(progressData, source) {
    if (!this.channel) {
      return this.performSave(progressData, { broadcast: false, source });
    }

    const requestId = generateId('req');

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        const pending = this.pendingSaveRequests.get(requestId);
        if (pending) {
          this.pendingSaveRequests.delete(requestId);
          reject(new Error('SAVE_LEADER_TIMEOUT'));
        }
      }, REQUEST_TIMEOUT);

      this.pendingSaveRequests.set(requestId, {
        resolve: (meta) => {
          clearTimeout(timeoutId);
          resolve(meta);
        },
        reject: (error) => {
          clearTimeout(timeoutId);
          reject(error);
        }
      });

      this.channel.postMessage({
        type: 'request-save',
        payload: {
          requestId,
          clientId: this.clientId,
          data: progressData,
          source
        }
      });
    });
  }

  async loadProgress() {
    try {
      const headData = localStorage.getItem(STORAGE_KEYS.PROGRESS_HEAD);
      if (!headData) {
        return null;
      }

      const head = JSON.parse(headData);
      const db = await this.ensureDB();

      if (db) {
        const snapshot = await this.loadFromIndexedDB('MissionSnapshots', head.snapshotId);
        if (snapshot) {
          const storedChecksum = snapshot.progress?.checksum;
          if (storedChecksum) {
            const calculatedChecksum = this.generateChecksum(snapshot.progress);
            if (calculatedChecksum !== storedChecksum) {
              console.warn('⚠️ Checksum no coincide, datos pueden estar corruptos');
            }
          }

          const { snapshot: migratedSnapshot, migrated } = progressMigrator.migrate(snapshot);
          progressValidator.assertValid(migratedSnapshot);

          if (migrated) {
            console.debug('Snapshot migrado al cargar progreso', {
              from: snapshot.version,
              to: migratedSnapshot.version
            });
          }

          return migratedSnapshot;
        }
      }

      const profileData = localStorage.getItem(`${STORAGE_KEYS.PROFILE}_${head.userId}`);
      if (profileData) {
        const baseSnapshot = this.createInitialProgress();
        const fallback = {
          ...baseSnapshot,
          user: {
            ...baseSnapshot.user,
            ...JSON.parse(profileData)
          }
        };
        const { snapshot: migratedFallback } = progressMigrator.migrate(fallback);
        progressValidator.assertValid(migratedFallback);
        return migratedFallback;
      }

      return null;
    } catch (error) {
      console.error('❌ Error al cargar progreso:', error);
      return null;
    }
  }

  getCachedUserProfileState() {
    try {
      const cached = localStorage.getItem(STORAGE_KEYS.PL300_PROFILE);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      return parsed?.profile || null;
    } catch (error) {
      console.warn('Error al recuperar perfil PL300 en cache:', error);
      return null;
    }
  }

  async saveUserProfileState(profileState, options = {}) {
    if (!profileState) return null;

    const payload = {
      userId: profileState.userId || 'user_default',
      profile: profileState,
      updatedAt: new Date().toISOString(),
      source: options.source || 'autosave'
    };

    try {
      localStorage.setItem(STORAGE_KEYS.PL300_PROFILE, JSON.stringify(payload));
    } catch (error) {
      console.error('Error guardando perfil PL300 en localStorage:', error);
    }

    try {
      const db = await this.ensureDB();
      if (db) {
        await this.saveToIndexedDB('UserProfiles', payload);
      }
    } catch (error) {
      console.warn('No se pudo guardar perfil PL300 en IndexedDB:', error);
    }

    if (this.channel) {
      this.channel.postMessage({
        type: 'user-profile-updated',
        payload
      });
    }

    this.emit('user-profile-saved', payload);
    return payload;
  }

  async loadUserProfileState() {
    try {
      const cached = this.getCachedUserProfileState();
      if (cached) {
        return cached;
      }

      const db = await this.ensureDB();
      if (db) {
        const latest = await this.loadLatestUserProfileFromIndexedDB();
        if (latest?.profile) {
          localStorage.setItem(STORAGE_KEYS.PL300_PROFILE, JSON.stringify(latest));
          return latest.profile;
        }
      }
    } catch (error) {
      console.error('Error al cargar perfil PL300:', error);
    }
    return null;
  }

  async cacheUserProfileState(profileState, metadata = {}) {
    if (!profileState) return null;

    const payload = {
      userId: profileState.userId || 'user_default',
      profile: profileState,
      updatedAt: metadata.updatedAt || new Date().toISOString(),
      source: metadata.source || 'cache'
    };

    try {
      localStorage.setItem(STORAGE_KEYS.PL300_PROFILE, JSON.stringify(payload));
    } catch (error) {
      console.error('Error cacheando perfil PL300:', error);
    }

    try {
      const db = await this.ensureDB();
      if (db) {
        await this.saveToIndexedDB('UserProfiles', payload);
      }
    } catch (error) {
      console.warn('No se pudo cachear perfil PL300 en IndexedDB:', error);
    }

    return payload;
  }

  async loadLatestUserProfileFromIndexedDB() {
    const db = await this.ensureDB();
    if (!db) return null;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['UserProfiles'], 'readonly');
      const store = transaction.objectStore('UserProfiles');
      const index = store.index('updatedAt');
      const request = index.openCursor(null, 'prev');

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          resolve(cursor.value);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async saveToIndexedDB(storeName, data) {
    const db = await this.ensureDB();
    if (!db) throw new Error('IndexedDB no inicializada');

    return new Promise((resolve, reject) => {
      try {
        // Verificar que la conexión está abierta antes de crear transacción
        if (db.closePending) {
          reject(new Error('La conexión de IndexedDB está cerrándose'));
          return;
        }

        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        transaction.oncomplete = () => resolve(request.result);
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(new Error('Transacción abortada'));
        
        request.onerror = () => reject(request.error);
      } catch (error) {
        // Si falla al crear la transacción, rechazar con error específico
        reject(new Error(`Error creando transacción: ${error.message}`));
      }
    });
  }

  async loadFromIndexedDB(storeName, key) {
    const db = await this.ensureDB();
    if (!db) throw new Error('IndexedDB no inicializada');

    return new Promise((resolve, reject) => {
      try {
        // Verificar que la conexión está abierta antes de crear transacción
        if (db.closePending) {
          reject(new Error('La conexión de IndexedDB está cerrándose'));
          return;
        }

        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(new Error('Transacción abortada'));
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(new Error(`Error creando transacción: ${error.message}`));
      }
    });
  }

  async getProgressHistory(userId, limit = 10) {
    const db = await this.ensureDB();
    if (!db) throw new Error('IndexedDB no inicializada');

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['ProgressHistory'], 'readonly');
      const store = transaction.objectStore('ProgressHistory');
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'prev');

      const results = [];
      let count = 0;

      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && count < limit) {
          if (cursor.value.userId === userId) {
            results.push(cursor.value);
            count += 1;
          }
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async cleanup(daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const db = await this.ensureDB();
    if (!db) return;

    const transaction = db.transaction(['ProgressHistory'], 'readwrite');
    const store = transaction.objectStore('ProgressHistory');
    const index = store.index('timestamp');
    const request = index.openCursor();

    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        if (new Date(cursor.value.timestamp) < cutoffDate) {
          cursor.delete();
        }
        cursor.continue();
      }
    };
  }

  async exportProgress() {
    const progress = await this.loadProgress();
    if (!progress) return null;

    const blob = new Blob([JSON.stringify(progress, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cxc_progress_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    return progress;
  }

  async importProgress(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const result = await this.performSave(data, { broadcast: true, source: 'import' });
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}

export const progressService = new ProgressService();
