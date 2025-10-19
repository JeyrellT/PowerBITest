/**
 * Servicio de Telemetría
 * Registra eventos y métricas para análisis
 */

const TELEMETRY_QUEUE_KEY = 'cxcc_telemetry_queue';
const BATCH_SIZE = 50;
const FLUSH_INTERVAL = 30000; // 30 segundos

class TelemetryService {
  constructor() {
    this.queue = [];
    this.sessionId = this.generateSessionId();
    this.sessionStart = new Date();
    this.recentEvents = new Set(); // 🆕 Para detectar duplicados
    this.loadQueue();
    this.startAutoFlush();
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  loadQueue() {
    try {
      const stored = localStorage.getItem(TELEMETRY_QUEUE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error al cargar cola de telemetría:', error);
      this.queue = [];
    }
  }

  saveQueue() {
    try {
      // Mantener solo los últimos 100 eventos en cola
      const queueToSave = this.queue.slice(-100);
      localStorage.setItem(TELEMETRY_QUEUE_KEY, JSON.stringify(queueToSave));
    } catch (error) {
      console.error('Error al guardar cola de telemetría:', error);
    }
  }

  startAutoFlush() {
    this.flushInterval = setInterval(() => {
      this.flush();
    }, FLUSH_INTERVAL);
  }

  stopAutoFlush() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
  }

  emit(eventName, properties = {}) {
    // 🆕 PREVENIR EVENTOS DUPLICADOS
    const eventSignature = `${eventName}_${JSON.stringify(properties)}`;
    
    if (this.recentEvents.has(eventSignature)) {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`⚠️ [Telemetry] Evento duplicado ignorado: ${eventName}`);
      }
      return null; // No emitir el evento duplicado
    }
    
    // Agregar a set de recientes
    this.recentEvents.add(eventSignature);
    
    // Limpiar después de 2 segundos
    setTimeout(() => {
      this.recentEvents.delete(eventSignature);
    }, 2000);
    
    const event = {
      eventName,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        sessionDuration: (new Date() - this.sessionStart) / 1000, // segundos
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`
      }
    };

    this.queue.push(event);
    this.saveQueue();

    // Auto-flush si alcanzamos batch size
    if (this.queue.length >= BATCH_SIZE) {
      this.flush();
    }

    // Log en desarrollo
    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 [Telemetry] ${eventName}`, properties);
    }

    return event;
  }

  async flush() {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];
    this.saveQueue();

    try {
      // En producción, esto enviaría a un servidor
      // Por ahora, solo lo registramos en consola
      if (process.env.NODE_ENV === 'development') {
        console.log(`📤 [Telemetry] Flushing ${eventsToSend.length} events`);
      }

      // Aquí iría la llamada real a la API
      // await fetch('/api/telemetry', {
      //   method: 'POST',
      //   body: JSON.stringify(eventsToSend)
      // });

      return eventsToSend;
    } catch (error) {
      console.error('Error al enviar telemetría:', error);
      // Reencolar eventos fallidos
      this.queue = [...eventsToSend, ...this.queue];
      this.saveQueue();
      throw error;
    }
  }

  // Obtener métricas de sesión
  getSessionMetrics() {
    const duration = (new Date() - this.sessionStart) / 1000;
    const eventCounts = {};
    
    this.queue.forEach(event => {
      eventCounts[event.eventName] = (eventCounts[event.eventName] || 0) + 1;
    });

    return {
      sessionId: this.sessionId,
      duration,
      totalEvents: this.queue.length,
      eventCounts,
      startTime: this.sessionStart.toISOString()
    };
  }

  // Exportar eventos para análisis
  exportEvents() {
    const blob = new Blob([JSON.stringify(this.queue, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry_${this.sessionId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Limpiar telemetría
  clear() {
    this.queue = [];
    this.saveQueue();
  }

  // Detener servicio
  destroy() {
    this.stopAutoFlush();
    this.flush();
  }
}

export const telemetryService = new TelemetryService();

// Registrar eventos globales importantes
window.addEventListener('beforeunload', () => {
  telemetryService.emit('session_end', {
    metrics: telemetryService.getSessionMetrics()
  });
  telemetryService.flush();
});

// Registrar errores no capturados
window.addEventListener('error', (event) => {
  telemetryService.emit('error_uncaught', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    stack: event.error?.stack
  });
});

// Registrar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  telemetryService.emit('error_unhandled_rejection', {
    reason: event.reason?.toString(),
    promise: event.promise
  });
});
