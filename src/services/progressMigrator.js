/**
 * Gestor de migraciones de snapshots de progreso.
 * Permite evolucionar el esquema manteniendo compatibilidad con versiones previas.
 */

const LATEST_VERSION = '1.0.0';
const BASELINE_VERSION = '0.0.0';

const ensureObject = (value, fallback = {}) => (value && typeof value === 'object' ? value : fallback);
const ensureArray = (value) => (Array.isArray(value) ? value : []);
const ensureString = (value, fallback = '') => (typeof value === 'string' ? value : fallback);
const ensureNumber = (value, fallback = 0) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);

const compareVersion = (a, b) => {
  const parse = (version, fallback = BASELINE_VERSION) => ensureString(version || fallback).split('.').map((part) => Number.parseInt(part, 10) || 0);
  const [aMajor, aMinor, aPatch] = parse(a);
  const [bMajor, bMinor, bPatch] = parse(b);

  if (aMajor !== bMajor) return aMajor - bMajor;
  if (aMinor !== bMinor) return aMinor - bMinor;
  return aPatch - bPatch;
};

const migrations = [
  {
    version: '1.0.0',
    up: (snapshot) => {
      const migrated = { ...snapshot };

      migrated.version = '1.0.0';
      migrated.user = ensureObject(migrated.user, {});
      migrated.user.id = ensureString(migrated.user.id, `user_${Date.now()}`);
      migrated.user.name = ensureString(migrated.user.name, 'Usuario');
      migrated.user.preferences = {
        language: ensureString(migrated.user?.preferences?.language, 'es'),
        darkMode: typeof migrated.user?.preferences?.darkMode === 'boolean' ? migrated.user.preferences.darkMode : true
      };

      const progress = ensureObject(migrated.progress, {});
      const points = ensureObject(progress.points, {});

      migrated.progress = {
        currentAct: ensureNumber(progress.currentAct, 0),
        missions: ensureObject(progress.missions, {}),
        points: {
          total: ensureNumber(points.total, 0),
          available: ensureNumber(points.available, ensureNumber(points.total, 0)),
          spentOnHelps: ensureNumber(points.spentOnHelps, 0),
          currentRank: ensureString(points.currentRank, 'Bronce')
        },
        badges: ensureArray(progress.badges),
        achievements: ensureArray(progress.achievements),
        finalPath: progress.finalPath ?? null,
        updatedAt: ensureString(progress.updatedAt, new Date().toISOString()),
        checksum: ensureString(progress.checksum, null)
      };

      Object.keys(migrated.progress.missions).forEach((missionId) => {
        const mission = ensureObject(migrated.progress.missions[missionId], {});
        migrated.progress.missions[missionId] = {
          status: ensureString(mission.status, 'in_progress'),
          score: ensureNumber(mission.score, 0),
          grade: ensureString(mission.grade, null),
          timestamp: ensureString(mission.timestamp, null),
          updatedAt: ensureString(mission.updatedAt, migrated.progress.updatedAt),
          helpUsed: ensureArray(mission.helpUsed).map((entry) => ({
            type: ensureString(entry?.type, 'hint'),
            cost: ensureNumber(entry?.cost, 0),
            timestamp: ensureString(entry?.timestamp, migrated.progress.updatedAt)
          })),
          metadata: ensureObject(mission.metadata, {})
        };
      });

      return migrated;
    }
  }
];

const applyMigrations = (snapshot) => {
  const originalVersion = ensureString(snapshot?.version, BASELINE_VERSION);
  let current = JSON.parse(JSON.stringify(snapshot || {}));
  let migrated = false;

  migrations
    .filter((migration) => compareVersion(migration.version, originalVersion) > 0)
    .sort((a, b) => compareVersion(a.version, b.version))
    .forEach((migration) => {
      current = migration.up(current);
      migrated = true;
    });

  if (!migrated && compareVersion(originalVersion, LATEST_VERSION) !== 0) {
    current = migrations[migrations.length - 1].up(current);
    migrated = true;
  }

  if (compareVersion(current.version, LATEST_VERSION) !== 0) {
    current.version = LATEST_VERSION;
    migrated = true;
  }

  return { snapshot: current, migrated, fromVersion: originalVersion, toVersion: current.version };
};

export const progressMigrator = {
  LATEST_VERSION,
  migrate: applyMigrations
};
