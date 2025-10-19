import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { progressService } from '../services/progressService';
import { telemetryService } from '../services/telemetryService';
import { useAutosave } from '../hooks/useAutosave';

// ============================================================================
// CONSTANTES Y CONFIGURACIONES
// ============================================================================

export const CxCProgressContext = createContext();
const RETRY_DELAYS = [1000, 2000, 5000];
const VALID_MISSION_STATUSES = new Set(['locked', 'available', 'in_progress', 'completed', 'platinum']);
const VALID_GRADES = new Set(['Bronce', 'Plata', 'Oro', 'Platino']);

// Importados desde progressManager.js (para compatibilidad)
export const ACHIEVEMENT_TYPES = {
  // ===== CATEGORÍA: PROGRESO =====
  FIRST_QUIZ: { 
    id: 'first_quiz', 
    name: 'Primer Paso', 
    description: 'Completa tu primer quiz',
    icon: '🎯', 
    points: 50,
    tier: 'bronze',
    category: 'progreso'
  },
  EXPLORER: { 
    id: 'explorer', 
    name: 'Explorador', 
    description: 'Responde 25 preguntas',
    icon: '🧭', 
    points: 100,
    tier: 'bronze',
    category: 'progreso'
  },
  DEDICATED: { 
    id: 'dedicated', 
    name: 'Dedicado', 
    description: 'Responde 50 preguntas',
    icon: '📖', 
    points: 200,
    tier: 'silver',
    category: 'progreso'
  },
  ENCYCLOPEDIA: { 
    id: 'encyclopedia', 
    name: 'Enciclopedia', 
    description: 'Responde 75 preguntas',
    icon: '📚', 
    points: 300,
    tier: 'gold',
    category: 'progreso'
  },
  HUNDRED_QUESTIONS: { 
    id: '100_questions', 
    name: 'Dominio Total', 
    description: 'Responde las 100 preguntas',
    icon: '🎓', 
    points: 500,
    tier: 'platinum',
    category: 'progreso'
  },

  // ===== CATEGORÍA: PRECISIÓN =====
  PERFECT_QUIZ: { 
    id: 'perfect_quiz', 
    name: 'Perfeccionista', 
    description: 'Logra 100% en un quiz',
    icon: '💯', 
    points: 200,
    tier: 'gold',
    category: 'precision'
  },
  SHARPSHOOTER: { 
    id: 'sharpshooter', 
    name: 'Francotirador', 
    description: 'Mantén 95%+ de precisión global',
    icon: '🎯', 
    points: 300,
    tier: 'gold',
    category: 'precision'
  },
  ACCURACY_MASTER: { 
    id: 'accuracy_master', 
    name: 'Maestro de Precisión', 
    description: 'Mantén 90%+ de precisión en 20+ preguntas',
    icon: '🏹', 
    points: 250,
    tier: 'silver',
    category: 'precision'
  },
  CONSISTENT: { 
    id: 'consistent', 
    name: 'Consistente', 
    description: 'Mantén 80%+ de precisión en 30+ preguntas',
    icon: '🎪', 
    points: 150,
    tier: 'bronze',
    category: 'precision'
  },

  // ===== CATEGORÍA: VELOCIDAD =====
  SPEED_DEMON: { 
    id: 'speed_demon', 
    name: 'Demonio de Velocidad', 
    description: 'Completa un quiz en menos de 5 minutos',
    icon: '🚀', 
    points: 150,
    tier: 'silver',
    category: 'velocidad'
  },
  LIGHTNING: { 
    id: 'lightning', 
    name: 'Relámpago', 
    description: 'Completa un quiz en menos de 3 minutos',
    icon: '⚡', 
    points: 250,
    tier: 'gold',
    category: 'velocidad'
  },
  FLASH: { 
    id: 'flash', 
    name: 'Flash', 
    description: 'Completa un quiz en menos de 2 minutos',
    icon: '💨', 
    points: 400,
    tier: 'platinum',
    category: 'velocidad'
  },

  // ===== CATEGORÍA: RACHA =====
  STREAK_3: { 
    id: 'streak_3', 
    name: 'En Racha', 
    description: '3 días consecutivos estudiando',
    icon: '🔥', 
    points: 75,
    tier: 'bronze',
    category: 'racha'
  },
  STREAK_5: { 
    id: 'streak_5', 
    name: 'Semana Completa', 
    description: '7 días consecutivos estudiando',
    icon: '🔥', 
    points: 150,
    tier: 'silver',
    category: 'racha'
  },
  STREAK_10: { 
    id: 'streak_10', 
    name: 'Racha de Fuego', 
    description: '14 días consecutivos estudiando',
    icon: '🔥', 
    points: 300,
    tier: 'gold',
    category: 'racha'
  },
  STREAK_30: { 
    id: 'streak_30', 
    name: 'Imparable', 
    description: '30 días consecutivos estudiando',
    icon: '🔥', 
    points: 600,
    tier: 'platinum',
    category: 'racha'
  },

  // ===== CATEGORÍA: DOMINIO =====
  MASTER_DOMAIN: { 
    id: 'master_domain', 
    name: 'Maestro de Dominio', 
    description: 'Logra 90%+ en un dominio completo',
    icon: '👑', 
    points: 300,
    tier: 'gold',
    category: 'dominio'
  },
  DOMAIN_EXPERT: { 
    id: 'domain_expert', 
    name: 'Experto Multidisciplinario', 
    description: 'Logra 80%+ en 3 dominios diferentes',
    icon: '🌟', 
    points: 400,
    tier: 'platinum',
    category: 'dominio'
  },
  POLYMATH: { 
    id: 'polymath', 
    name: 'Polímata', 
    description: 'Logra 75%+ en todos los dominios',
    icon: '🧠', 
    points: 500,
    tier: 'platinum',
    category: 'dominio'
  },

  // ===== CATEGORÍA: ESPECIALES =====
  WEEK_WARRIOR: { 
    id: 'week_warrior', 
    name: 'Guerrero Semanal', 
    description: 'Completa 10 quizzes en una semana',
    icon: '⭐', 
    points: 200,
    tier: 'silver',
    category: 'especial'
  },
  NIGHT_OWL: { 
    id: 'night_owl', 
    name: 'Búho Nocturno', 
    description: 'Completa un quiz entre 10pm-6am',
    icon: '🦉', 
    points: 100,
    tier: 'bronze',
    category: 'especial'
  },
  EARLY_BIRD: { 
    id: 'early_bird', 
    name: 'Madrugador', 
    description: 'Completa un quiz antes de las 7am',
    icon: '�', 
    points: 100,
    tier: 'bronze',
    category: 'especial'
  },
  MARATHON: { 
    id: 'marathon', 
    name: 'Maratonista', 
    description: 'Completa 5 quizzes en un día',
    icon: '🏃', 
    points: 250,
    tier: 'gold',
    category: 'especial'
  },

  // ===== CATEGORÍA: RETENCIÓN (FSRS) =====
  ELEPHANT_MEMORY: { 
    id: 'elephant_memory', 
    name: 'Memoria de Elefante', 
    description: 'Mantén 90%+ de retención FSRS',
    icon: '🐘', 
    points: 300,
    tier: 'gold',
    category: 'retencion'
  },
  STABLE_KNOWLEDGE: { 
    id: 'stable_knowledge', 
    name: 'Conocimiento Sólido', 
    description: 'Alcanza 20+ días de estabilidad promedio',
    icon: '🏔️', 
    points: 400,
    tier: 'platinum',
    category: 'retencion'
  },
  MASTER_20: { 
    id: 'master_20', 
    name: 'Dominio de 20', 
    description: 'Domina 20+ preguntas',
    icon: '⭐', 
    points: 200,
    tier: 'silver',
    category: 'retencion'
  },

  // ===== CATEGORÍA: EXAM READINESS =====
  EXAM_READY: { 
    id: 'exam_ready', 
    name: 'Listo para el Examen', 
    description: 'Alcanza 85%+ de preparación',
    icon: '🎓', 
    points: 500,
    tier: 'platinum',
    category: 'examen'
  },
  HIGH_CONFIDENCE: { 
    id: 'high_confidence', 
    name: 'Alta Confianza', 
    description: 'Alcanza nivel de confianza "Alta"',
    icon: '✨', 
    points: 300,
    tier: 'gold',
    category: 'examen'
  }
};

// Sistema balanceado: 100 preguntas perfectas = Nivel 10 (Divinidad)
// Puntos máximos estimados: ~5,000 (con bonos de velocidad, racha, etc.)
export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Novato', points: 0, icon: '🌱' },
  { level: 2, name: 'Aprendiz', points: 100, icon: '📚' },
  { level: 3, name: 'Estudiante', points: 300, icon: '🎓' },
  { level: 4, name: 'Competente', points: 600, icon: '💼' },
  { level: 5, name: 'Profesional', points: 1000, icon: '⭐' },
  { level: 6, name: 'Experto', points: 1600, icon: '🏆' },
  { level: 7, name: 'Maestro', points: 2400, icon: '👑' },
  { level: 8, name: 'Gran Maestro', points: 3300, icon: '💎' },
  { level: 9, name: 'Leyenda', points: 4200, icon: '🌟' },
  { level: 10, name: 'Divinidad', points: 5000, icon: '✨' }
];

// Importados desde questionTracker.js
export const QUESTION_STATUS = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEWING: 'reviewing',
  MASTERED: 'mastered',
  RETIRED: 'retired'
};

export const CONFIDENCE_LEVELS = {
  NONE: 0,
  VERY_LOW: 1,
  LOW: 2,
  MEDIUM: 3,
  HIGH: 4,
  VERY_HIGH: 5
};

export const MASTERY_CONFIG = {
  ATTEMPTS_TO_MASTER: 3,
  ATTEMPTS_TO_RETIRE: 5,
  REVIEW_INTERVAL_DAYS: 7,
  MAX_STREAK_REWARD: 10,
  MIN_ATTEMPTS_FOR_CONFIDENCE: 2
};

// ============================================================================
// FUNCIONES HELPER
// ============================================================================

/**
 * Crea un nuevo registro de tracking para una pregunta
 */
const createNewQuestionTracking = (questionId) => ({
  id: questionId,
  status: QUESTION_STATUS.NEW,
  confidenceLevel: CONFIDENCE_LEVELS.NONE,
  totalAttempts: 0,
  correctAttempts: 0,
  incorrectAttempts: 0,
  consecutiveCorrect: 0,
  consecutiveIncorrect: 0,
  lastAttemptDate: null,
  lastAttemptCorrect: null,
  firstAttemptDate: null,
  masteredDate: null,
  nextReviewDate: null,
  averageTimeSpent: 0,
  timestamps: [],
  difficultyRating: null,
  personalDifficulty: null,
  tags: [],
  notes: ''
});

/**
 * Actualiza el estado y nivel de confianza de una pregunta
 */
const updateQuestionStatusAndConfidence = (tracking) => {
  const { consecutiveCorrect, consecutiveIncorrect, totalAttempts, correctAttempts } = tracking;

  // Calcular nivel de confianza
  if (totalAttempts < MASTERY_CONFIG.MIN_ATTEMPTS_FOR_CONFIDENCE) {
    tracking.confidenceLevel = CONFIDENCE_LEVELS.NONE;
  } else {
    const successRate = correctAttempts / totalAttempts;
    
    if (consecutiveCorrect >= 5) {
      tracking.confidenceLevel = CONFIDENCE_LEVELS.VERY_HIGH;
    } else if (consecutiveCorrect >= 3) {
      tracking.confidenceLevel = CONFIDENCE_LEVELS.HIGH;
    } else if (successRate >= 0.66) {
      tracking.confidenceLevel = CONFIDENCE_LEVELS.MEDIUM;
    } else if (successRate >= 0.33) {
      tracking.confidenceLevel = CONFIDENCE_LEVELS.LOW;
    } else {
      tracking.confidenceLevel = CONFIDENCE_LEVELS.VERY_LOW;
    }
  }

  // Actualizar estado
  if (consecutiveCorrect >= MASTERY_CONFIG.ATTEMPTS_TO_RETIRE) {
    tracking.status = QUESTION_STATUS.RETIRED;
    tracking.masteredDate = new Date().toISOString();
  } else if (consecutiveCorrect >= MASTERY_CONFIG.ATTEMPTS_TO_MASTER) {
    tracking.status = QUESTION_STATUS.MASTERED;
    if (!tracking.masteredDate) {
      tracking.masteredDate = new Date().toISOString();
    }
  } else if (totalAttempts === 0) {
    tracking.status = QUESTION_STATUS.NEW;
  } else if (correctAttempts > 0 && consecutiveIncorrect === 0) {
    tracking.status = QUESTION_STATUS.REVIEWING;
  } else {
    tracking.status = QUESTION_STATUS.LEARNING;
  }

  return tracking;
};

/**
 * Calcula la dificultad personal basada en el rendimiento
 */
const calculatePersonalDifficulty = (tracking) => {
  if (tracking.totalAttempts < 2) {
    tracking.personalDifficulty = null;
    return tracking;
  }

  const successRate = tracking.correctAttempts / tracking.totalAttempts;
  const avgTime = tracking.averageTimeSpent;

  const timeScore = Math.min(avgTime / 60, 1) * 40;
  const errorScore = (1 - successRate) * 60;
  
  tracking.personalDifficulty = Math.round(timeScore + errorScore);
  return tracking;
};

/**
 * Calcula la próxima fecha de revisión usando repetición espaciada
 */
const calculateNextReviewDate = (tracking) => {
  const { status, consecutiveCorrect, lastAttemptDate } = tracking;

  if (status === QUESTION_STATUS.NEW || !lastAttemptDate) {
    tracking.nextReviewDate = null;
    return tracking;
  }

  const lastAttempt = new Date(lastAttemptDate);
  let daysToAdd = 0;

  switch (status) {
    case QUESTION_STATUS.LEARNING:
      daysToAdd = 1;
      break;
    case QUESTION_STATUS.REVIEWING:
      daysToAdd = Math.min(3 * consecutiveCorrect, 14);
      break;
    case QUESTION_STATUS.MASTERED:
      daysToAdd = MASTERY_CONFIG.REVIEW_INTERVAL_DAYS;
      break;
    case QUESTION_STATUS.RETIRED:
      daysToAdd = 30;
      break;
    default:
      daysToAdd = 0;
  }

  const nextDate = new Date(lastAttempt);
  nextDate.setDate(nextDate.getDate() + daysToAdd);
  tracking.nextReviewDate = nextDate.toISOString();
  
  return tracking;
};

/**
 * Calcula nivel basado en puntos
 */
const calculateLevel = (points) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= LEVEL_THRESHOLDS[i].points) {
      const currentThreshold = LEVEL_THRESHOLDS[i];
      const nextThreshold = LEVEL_THRESHOLDS[i + 1];
      const progressToNext = nextThreshold 
        ? ((points - currentThreshold.points) / (nextThreshold.points - currentThreshold.points)) * 100
        : 100;
      
      return {
        ...currentThreshold,
        progressToNext,
        pointsToNext: nextThreshold ? nextThreshold.points - points : 0
      };
    }
  }
  return { ...LEVEL_THRESHOLDS[0], progressToNext: 0, pointsToNext: LEVEL_THRESHOLDS[1].points };
};

const toFiniteNumber = (value, fallback = 0) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
};

const toInteger = (value, fallback = 0) => {
  const numeric = toFiniteNumber(value, fallback);
  return Math.round(numeric);
};

const toPositiveInteger = (value, fallback = 0) => {
  return Math.max(0, toInteger(value, fallback));
};

const clampNumber = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

const roundNumber = (value, decimals = 0, fallback = 0) => {
  const numeric = toFiniteNumber(value, fallback);
  const factor = Math.pow(10, decimals);
  return Math.round(numeric * factor) / factor;
};

/**
 * Calcula racha de días consecutivos
 */
const calculateStreakDays = (history, lastActivity) => {
  if (!history || history.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = lastActivity ? new Date(lastActivity) : null;
  if (!lastActive || isNaN(lastActive.getTime())) return 0;
  
  lastActive.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1) return 0;
  
  let streak = 0;
  let currentDate = new Date(today);
  const activityByDay = {};
  
  history.forEach(entry => {
    // Soportar tanto 'completedAt' (nuevo) como 'date' (antiguo)
    const dateValue = entry.completedAt || entry.date;
    if (!dateValue) return;
    
    const date = new Date(dateValue);
    // Validar que la fecha es válida
    if (isNaN(date.getTime())) return;
    
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    activityByDay[dateStr] = true;
  });
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (!activityByDay[dateStr]) break;
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

/**
 * Calcula total de respuestas correctas
 */
const calculateCorrectAnswers = (questionTracking) => {
  if (!questionTracking) return 0;
  return Object.values(questionTracking).reduce((sum, q) => 
    sum + (q.correctAttempts || 0), 0
  );
};

/**
 * Calcula precisión global
 */
const calculateGlobalAccuracy = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const total = Object.values(questionTracking).reduce((sum, q) => 
    sum + (q.totalAttempts || 0), 0
  );
  const correct = calculateCorrectAnswers(questionTracking);
  
  if (total === 0) return 0;

  const accuracy = (correct / total) * 100;
  return clampNumber(roundNumber(accuracy, 1), 0, 100);
};

/**
 * Calcula tiempo total de estudio
 */
const calculateTotalTime = (questionTracking) => {
  if (!questionTracking) return 0;
  return Object.values(questionTracking).reduce((sum, q) => 
    sum + (q.totalTimeSpent || 0), 0
  );
};

/**
 * Retención promedio (FSRS)
 */
const calculateAvgRetention = (questionTracking) => {
  if (!questionTracking) return 0;
  const questions = Object.values(questionTracking);
  if (questions.length === 0) return 0;
  
  const totalRetention = questions.reduce((sum, q) => {
    const successRate = q.totalAttempts > 0 
      ? q.correctAttempts / q.totalAttempts 
      : 0;
    const stability = q.stability || 7;
    const daysSince = q.lastAttemptDate 
      ? Math.floor((Date.now() - new Date(q.lastAttemptDate)) / (1000 * 60 * 60 * 24))
      : 999;
    
    return sum + (successRate * Math.exp(-daysSince / stability));
  }, 0);
  
  return Math.round((totalRetention / questions.length) * 100);
};

/**
 * Estabilidad promedio (FSRS)
 */
const calculateAvgStability = (questionTracking) => {
  if (!questionTracking) return 0;
  const questions = Object.values(questionTracking);
  if (questions.length === 0) return 0;
  
  const total = questions.reduce((sum, q) => sum + (q.stability || 0), 0);
  return Math.round(total / questions.length);
};

/**
 * Preguntas que necesitan revisión
 */
const countDueReviews = (questionTracking) => {
  if (!questionTracking) return 0;
  const now = new Date();
  
  return Object.values(questionTracking).filter(q => {
    if (!q.nextReviewDate) return false;
    return new Date(q.nextReviewDate) <= now;
  }).length;
};

/**
 * Preguntas dominadas
 */
const countMastered = (questionTracking) => {
  if (!questionTracking) return 0;
  return Object.values(questionTracking).filter(q => 
    q.status === 'mastered' || q.confidenceLevel >= 4
  ).length;
};

/**
 * Zona de Confort (>90% accuracy)
 */
const calculateComfortZone = (questionTracking) => {
  if (!questionTracking) return 0;
  const total = Object.keys(questionTracking).length;
  if (total === 0) return 0;
  
  const comfortable = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    return (q.correctAttempts / q.totalAttempts) >= 0.9;
  }).length;
  
  return Math.round((comfortable / total) * 100);
};

/**
 * Zona de Desarrollo Próximo (60-90%)
 */
const calculateZPD = (questionTracking) => {
  if (!questionTracking) return 0;
  const total = Object.keys(questionTracking).length;
  if (total === 0) return 0;
  
  const zpd = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    const accuracy = q.correctAttempts / q.totalAttempts;
    return accuracy >= 0.6 && accuracy < 0.9;
  }).length;
  
  return Math.round((zpd / total) * 100);
};

/**
 * Zona Desafiante (<60%)
 */
const calculateChallenging = (questionTracking) => {
  if (!questionTracking) return 0;
  const total = Object.keys(questionTracking).length;
  if (total === 0) return 0;
  
  const challenging = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    return (q.correctAttempts / q.totalAttempts) < 0.6;
  }).length;
  
  return Math.round((challenging / total) * 100);
};

/**
 * Calcula % de preparación para examen
 */
const calculateExamReadiness = (progress) => {
  const questionsAnswered = progress.answeredQuestions?.length || 0;
  const accuracy = calculateGlobalAccuracy(progress.questionTracking);
  
  // Fórmula: 60% preguntas + 40% precisión
  const readiness = (
    (questionsAnswered / 100 * 0.6) +
    (accuracy / 100 * 0.4)
  ) * 100;
  
  return Math.min(100, Math.round(readiness));
};

/**
 * Estima días para estar listo
 */
const estimateDaysToReady = (progress) => {
  const questionsRemaining = 100 - (progress.answeredQuestions?.length || 0);
  const daysActive = progress.history?.length || 1;
  const totalQuestions = progress.answeredQuestions?.length || 0;
  const avgPerDay = totalQuestions / daysActive;
  
  if (avgPerDay === 0) return Math.ceil(questionsRemaining / 10);
  return Math.ceil(questionsRemaining / avgPerDay);
};

/**
 * Determina nivel de confianza
 */
const determineConfidence = (progress) => {
  const readiness = calculateExamReadiness(progress);
  
  if (readiness >= 85) return { level: 'Alta', icon: '🌟', color: 'green' };
  if (readiness >= 70) return { level: 'Buena', icon: '✨', color: 'blue' };
  if (readiness >= 50) return { level: 'En desarrollo', icon: '📈', color: 'yellow' };
  return { level: 'Iniciando', icon: '🌱', color: 'gray' };
};

const sanitizeMissionEntry = (mission = {}) => {
  const sanitized = { ...mission };
  const numericScore = Number(mission.score);

  if (Number.isFinite(numericScore)) {
    sanitized.score = Math.max(0, Math.floor(numericScore));
  } else {
    delete sanitized.score;
  }

  sanitized.status = VALID_MISSION_STATUSES.has(mission.status) ? mission.status : 'available';

  if (sanitized.grade && !VALID_GRADES.has(sanitized.grade)) {
    delete sanitized.grade;
  }

  if (Array.isArray(mission.helpUsed)) {
    sanitized.helpUsed = mission.helpUsed
      .filter((entry) => entry && typeof entry.type === 'string' && entry.timestamp)
      .map((entry) => ({
        type: entry.type,
        cost: Math.max(0, Math.floor(entry.cost || 0)),
        timestamp: entry.timestamp
      }));

    if (!sanitized.helpUsed.length) {
      delete sanitized.helpUsed;
    }
  }

  return sanitized;
};

const sanitizeMissions = (missions = {}) =>
  Object.entries(missions).reduce((acc, [missionId, missionData]) => {
    if (!missionData) return acc;
    acc[missionId] = sanitizeMissionEntry(missionData);
    return acc;
  }, {});

export const useCxCProgress = () => {
  const context = useContext(CxCProgressContext);
  if (!context) {
    throw new Error('useCxCProgress debe usarse dentro de CxCProgressProvider');
  }
  return context;
};

// 🆕 Definir el ref al inicio del componente
export const CxCProgressProvider = ({ children }) => {
  // Inicializar con estructura por defecto para evitar null durante la carga
  const [progress, setProgress] = useState({
    totalPoints: 0,
    totalXP: 0,
    currentLevel: 1,
    answeredQuestions: [],
    questionTracking: {},
    domainStats: {},
    levelStats: {},
    achievements: [],
    badges: [],
    missions: {},
    history: [],
    currentAct: 0,
    points: { total: 0, available: 0, spentOnHelps: 0, currentRank: 'Bronce' }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [userId, setUserId] = useState(null);
  const [dirty, setDirty] = useState(false);
  const retryTimerRef = useRef(null);
  const internalSaveRef = useRef(() => Promise.resolve(null));
  const lastProcessedQuizzesRef = useRef(new Set());

  // ✅ NUEVOS: Sistema de deduplicación y cola de actualizaciones
  // Eliminar o comentar estas variables no utilizadas
  // const pendingUpdates = useRef([]);
  // const updateQueue = useRef([]);
  // const isProcessingQueue = useRef(false);
  // const processedQuizzes = useRef(new Set());

  const clearRetryTimer = useCallback(() => {
    if (retryTimerRef.current) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    const initProgress = async () => {
      try {
        setLoading(true);
        const storedProgress = await progressService.loadProgress();

        if (storedProgress) {
          // ✅ CORRECCIÓN: NO resetear puntos - usar el valor guardado
          // Sistema balanceado: 100 preguntas × 50 puntos promedio = 5,000 puntos MÍNIMO esperado
          // Con bonos (velocidad, racha, logros) puede llegar hasta 10,000+
          let totalPoints = storedProgress.progress.totalPoints ?? 0; // Usar ?? para detectar undefined/null
          let totalXP = storedProgress.progress.totalXP ?? 0;
          
          // ⚠️ VALIDACIÓN REALISTA: Solo resetear si los puntos son absurdamente altos (>100,000)
          // o si hay una inconsistencia obvia (puntos sin preguntas respondidas)
          const questionsAnswered = storedProgress.progress.answeredQuestions?.length || 0;
          const maxRealisticPoints = questionsAnswered * 200; // Máximo 200 puntos por pregunta (muy generoso)
          
          if (totalPoints > 100000 || (totalPoints > maxRealisticPoints && questionsAnswered < 10)) {
            console.warn('⚠️ Datos realmente inflados detectados. Reseteando desde:', totalPoints);
            totalPoints = 0;  // Resetear solo si es claramente corrupto
          } else {
            console.log('✅ Puntos válidos cargados:', totalPoints, 'XP:', totalXP, 'para', questionsAnswered, 'preguntas');
          }
          
          // Sanitizar progreso al cargar para corregir datos corruptos + ✅ GARANTIZAR valores por defecto
          const sanitizedProgress = {
            ...storedProgress.progress,
            // ✅ VALORES POR DEFECTO EXPLÍCITOS para todas las propiedades CxC
            totalPoints,
            totalXP,
            currentLevel: storedProgress.progress.currentLevel ?? 1,
            answeredQuestions: Array.isArray(storedProgress.progress.answeredQuestions) 
              ? storedProgress.progress.answeredQuestions 
              : [],
            questionTracking: storedProgress.progress.questionTracking || {},
            domainStats: storedProgress.progress.domainStats || {},
            levelStats: storedProgress.progress.levelStats || {},
            achievements: Array.isArray(storedProgress.progress.achievements)
              ? storedProgress.progress.achievements
              : [],
            badges: Array.isArray(storedProgress.progress.badges)
              ? storedProgress.progress.badges
              : [],
            history: Array.isArray(storedProgress.progress.history)
              ? storedProgress.progress.history
              : [],
            quizzesTaken: storedProgress.progress.quizzesTaken ?? 0,
            currentStreak: storedProgress.progress.currentStreak ?? 0,
            longestStreak: storedProgress.progress.longestStreak ?? 0,
            lastQuizDate: storedProgress.progress.lastQuizDate || null,
            missions: sanitizeMissions(storedProgress.progress.missions || {}),
            points: {
              total: totalPoints,  // ✅ Sincronizar con totalPoints
              available: totalPoints,
              spentOnHelps: Math.max(0, Math.floor(storedProgress.progress.points?.spentOnHelps || 0)),
              currentRank: storedProgress.progress.points?.currentRank || 'Bronce'
            }
          };

          setProgress(sanitizedProgress);
          setUserId(storedProgress.user.id);
          setLastSaved(new Date(sanitizedProgress.updatedAt));
          setDirty(true); // Marcar como sucio para forzar guardado de datos sanitizados
          telemetryService.emit('progress_loaded', {
            userId: storedProgress.user.id,
            currentAct: sanitizedProgress.currentAct,
            totalPoints: sanitizedProgress.totalPoints,  // ✅ Log del valor corregido
            missionsCompleted: Object.keys(sanitizedProgress.missions).filter(
              (m) => sanitizedProgress.missions[m].status === 'completed'
            ).length
          });
        } else {
          const newProgress = progressService.createInitialProgress();
          // ✅ GARANTIZAR valores por defecto para nuevo usuario
          const normalizedProgress = {
            ...newProgress.progress,
            totalPoints: 0,
            totalXP: 0,
            currentLevel: 1,
            answeredQuestions: [],
            questionTracking: {},
            domainStats: {},
            levelStats: {},
            achievements: [],
            badges: [],
            history: [],
            quizzesTaken: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastQuizDate: null,
            missions: sanitizeMissions(newProgress.progress.missions || {})
          };

          setProgress(normalizedProgress);
          setUserId(newProgress.user.id);
          const snapshot = await progressService.saveProgress(
            { ...newProgress, progress: normalizedProgress },
            { source: 'bootstrap' }
          );
          setLastSaved(new Date(snapshot.timestamp));
          setDirty(false);
          telemetryService.emit('progress_created', { userId: newProgress.user.id });
        }
      } catch (error) {
        console.error('Error al inicializar progreso:', error);
        telemetryService.emit('progress_load_error', { error: error.message });
      } finally {
        setLoading(false);
      }
    };

    initProgress();
  }, []);

  useEffect(() => () => clearRetryTimer(), [clearRetryTimer]);

  useEffect(() => {
    if (!dirty) {
      clearRetryTimer();
    }
  }, [dirty, clearRetryTimer]);

  useEffect(() => {
    const unsubscribeRemote = progressService.on('remote-save', ({ snapshotId, timestamp, snapshot }) => {
      if (!snapshot) return;
      if (userId && snapshot.user.id !== userId) return;

      setUserId((prev) => prev || snapshot.user.id);
      setProgress(snapshot.progress);
      setLastSaved(new Date(snapshot.progress.updatedAt || timestamp));
      setDirty(false);
      telemetryService.emit('progress_synced_remote', {
        userId: snapshot.user.id,
        snapshotId,
        timestamp
      });
    });

    const unsubscribeLeader = progressService.on('leader-change', ({ isLeader, clientId }) => {
      telemetryService.emit('progress_leader_change', {
        userId,
        isLeader,
        clientId
      });
    });

    return () => {
      unsubscribeRemote?.();
      unsubscribeLeader?.();
    };
  }, [userId]);

  const applyProgressUpdate = useCallback((updater) => {
    setProgress((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next === prev) {
        return prev;
      }
      
      // ✅ SANITIZACIÓN INTELIGENTE: Preservar valores previos si next no los modificó explícitamente
      // Detectar si next tiene la propiedad definida (aunque sea 0) o si fue heredada de prev
      const sanitizedNext = {
        ...next,
        // Para propiedades numéricas: usar prev si next no la tiene (undefined), NO si es 0
        totalPoints: next.hasOwnProperty('totalPoints') ? next.totalPoints : (prev.totalPoints ?? 0),
        totalXP: next.hasOwnProperty('totalXP') ? next.totalXP : (prev.totalXP ?? 0),
        currentLevel: next.hasOwnProperty('currentLevel') ? next.currentLevel : (prev.currentLevel ?? 1),
        quizzesTaken: next.hasOwnProperty('quizzesTaken') ? next.quizzesTaken : (prev.quizzesTaken ?? 0),
        currentStreak: next.hasOwnProperty('currentStreak') ? next.currentStreak : (prev.currentStreak ?? 0),
        longestStreak: next.hasOwnProperty('longestStreak') ? next.longestStreak : (prev.longestStreak ?? 0),
        // Para arrays/objetos: usar prev si next no los tiene
        answeredQuestions: next.answeredQuestions || prev.answeredQuestions || [],
        questionTracking: next.questionTracking || prev.questionTracking || {},
        domainStats: next.domainStats || prev.domainStats || {},
        levelStats: next.levelStats || prev.levelStats || {},
        achievements: next.achievements || prev.achievements || [],
        badges: next.badges || prev.badges || [],
        history: next.history || prev.history || []
      };
      
      setDirty(true);
      return sanitizedNext;
    });
  }, []);

  const internalSave = useCallback(async ({ reason = 'autosave', attempt = 0 } = {}) => {
    if (!progress || !userId) return null;
    if (saving && attempt === 0) return null;

    clearRetryTimer();
    setSaving(true);

    // Sanitizar puntos para asegurar que sean enteros
    const sanitizedPoints = {
      total: Math.max(0, Math.floor(progress.points?.total || 0)),
      available: Math.max(0, Math.floor(progress.points?.available || 0)),
      spentOnHelps: Math.max(0, Math.floor(progress.points?.spentOnHelps || 0)),
      currentRank: progress.points?.currentRank || 'Bronce'
    };

    const payload = {
      version: '1.0.0',
      user: {
        id: userId,
        name: progress.userName || 'Usuario',
        preferences: progress.preferences || { language: 'es', darkMode: true }
      },
      progress: {
        ...progress,
        missions: sanitizeMissions(progress.missions || {}),
        points: sanitizedPoints,
        updatedAt: new Date().toISOString()
      }
    };

    try {
      const snapshot = await progressService.saveProgress(payload, { source: reason });
      setLastSaved(new Date(snapshot.timestamp));
      setDirty(false);

      if (attempt > 0) {
        telemetryService.emit('save_retry_success', {
          userId,
          snapshotId: snapshot.snapshotId,
          attempt,
          reason
        });
      } else if (reason === 'manual') {
        telemetryService.emit('save_manual_success', {
          userId,
          snapshotId: snapshot.snapshotId
        });
      } else {
        telemetryService.emit('save_autosave_success', {
          userId,
          snapshotId: snapshot.snapshotId
        });
      }

      return snapshot;
    } catch (error) {
      const errorEvent = reason === 'manual' ? 'save_manual_error' : 'save_autosave_error';
      telemetryService.emit(errorEvent, {
        userId,
        error: error.message,
        attempt
      });

      if (attempt < RETRY_DELAYS.length) {
        const delay = RETRY_DELAYS[attempt];
        telemetryService.emit('save_retry', {
          userId,
          attempt: attempt + 1,
          delay,
          reason,
          error: error.message
        });

        retryTimerRef.current = setTimeout(() => {
          internalSaveRef.current?.({ reason, attempt: attempt + 1 });
        }, delay);
      } else {
        telemetryService.emit('save_fallback', {
          userId,
          reason,
          error: error.message
        });
      }

      throw error;
    } finally {
      setSaving(false);
    }
  }, [progress, userId, saving, clearRetryTimer]);

  useEffect(() => {
    internalSaveRef.current = internalSave;
  }, [internalSave]);

  useAutosave({
    enabled: Boolean(progress && userId),
    dirty,
    debounceMs: 3000,
    onSave: () => internalSaveRef.current?.({ reason: 'autosave' }),
    onError: (error) => console.error('Autosave error:', error),
    dependencies: [progress]
  });

  const updateMissionProgress = useCallback((missionId, updates) => {
    applyProgressUpdate((prev) => {
      const currentMission = prev.missions?.[missionId] || { status: 'available' };
      const missionUpdate = sanitizeMissionEntry({
        ...currentMission,
        ...updates,
        updatedAt: new Date().toISOString()
      });

      return {
        ...prev,
        missions: {
          ...prev.missions,
          [missionId]: missionUpdate
        }
      };
    });

    telemetryService.emit('mission_progress_updated', {
      userId,
      missionId,
      status: updates.status
    });
  }, [applyProgressUpdate, userId]);

  const completeMission = useCallback((missionId, score, grade) => {
    applyProgressUpdate((prev) => {
      const currentMission = prev.missions?.[missionId] || { status: 'available' };
      const previousScore = Number.isFinite(currentMission.score)
        ? Math.max(0, Math.floor(currentMission.score))
        : 0;
      const normalizedScore = Number.isFinite(score)
        ? Math.max(0, Math.floor(score))
        : previousScore;
      const wasCompleted = currentMission.status === 'completed';
      const scoreDiff = normalizedScore - previousScore;
      const pointsEarnedRaw = wasCompleted ? Math.max(0, scoreDiff) : normalizedScore;
      const pointsEarned = Number.isFinite(pointsEarnedRaw) ? pointsEarnedRaw : 0;
      const normalizedGrade = VALID_GRADES.has(grade)
        ? grade
        : (VALID_GRADES.has(currentMission.grade) ? currentMission.grade : undefined);

      const missionPayload = sanitizeMissionEntry({
        ...currentMission,
        status: 'completed',
        score: normalizedScore,
        grade: normalizedGrade,
        timestamp: currentMission.timestamp || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      return {
        ...prev,
        missions: {
          ...prev.missions,
          [missionId]: missionPayload
        },
        points: {
          ...prev.points,
          total: Math.max(0, Math.floor((prev.points?.total || 0) + pointsEarned)),
          available: Math.max(0, Math.floor((prev.points?.available || 0) + pointsEarned)),
          spentOnHelps: Math.floor(prev.points?.spentOnHelps || 0),
          currentRank: prev.points?.currentRank || 'Bronce'
        }
      };
    });

    telemetryService.emit('mission_completed', {
      userId,
      missionId,
      score,
      grade
    });
  }, [applyProgressUpdate, userId]);

  const useHelp = useCallback((missionId, helpType, cost) => {
    applyProgressUpdate((prev) => {
      const currentMission = prev.missions[missionId] || {};
      const helpUsed = currentMission.helpUsed || [];

      const missionUpdate = sanitizeMissionEntry({
        ...currentMission,
        helpUsed: [
          ...helpUsed,
          {
            type: helpType,
            cost,
            timestamp: new Date().toISOString()
          }
        ]
      });

      return {
        ...prev,
        missions: {
          ...prev.missions,
          [missionId]: missionUpdate
        },
        points: {
          ...prev.points,
          available: Math.max(0, Math.floor((prev.points?.available || 0) - cost)),
          spentOnHelps: Math.floor((prev.points?.spentOnHelps || 0) + cost),
          total: Math.floor(prev.points?.total || 0),
          currentRank: prev.points?.currentRank || 'Bronce'
        }
      };
    });

    telemetryService.emit('help_used', {
      userId,
      missionId,
      type: helpType,
      cost
    });
  }, [applyProgressUpdate, userId]);

  const unlockBadge = useCallback((badgeId) => {
    applyProgressUpdate((prev) => {
      if (prev.badges?.includes(badgeId)) return prev;

      return {
        ...prev,
        badges: [...(prev.badges || []), badgeId]
      };
    });

    telemetryService.emit('badge_unlocked', {
      userId,
      badgeId
    });
  }, [applyProgressUpdate, userId]);

  const unlockAchievement = useCallback((achievementId) => {
    applyProgressUpdate((prev) => {
      if (prev.achievements?.includes(achievementId)) return prev;

      return {
        ...prev,
        achievements: [...(prev.achievements || []), achievementId]
      };
    });

    telemetryService.emit('achievement_unlocked', {
      userId,
      achievementId
    });
  }, [applyProgressUpdate, userId]);

  const setCurrentAct = useCallback((actNumber) => {
    applyProgressUpdate((prev) => ({
      ...prev,
      currentAct: actNumber
    }));
  }, [applyProgressUpdate]);

  const setFinalPath = useCallback((path) => {
    applyProgressUpdate((prev) => ({
      ...prev,
      finalPath: path
    }));

    telemetryService.emit('ending_chosen', {
      userId,
      path
    });
  }, [applyProgressUpdate, userId]);

  const saveProgress = useCallback(() => internalSave({ reason: 'manual' }), [internalSave]);

  // ============================================================================
  // FUNCIONES INTEGRADAS DE PROGRESSMANAGER
  // ============================================================================

  /**
   * Agrega puntos (compatibilidad con progressManager)
   * @deprecated Usar directamente completeMission o updateMissionProgress
   */
  const addPoints = useCallback((points) => {
    const pointsToAdd = Math.max(0, Math.floor(Number(points) || 0));
    
    applyProgressUpdate((prev) => {
      const newTotalPoints = Math.max(0, Math.floor((prev.totalPoints || 0) + pointsToAdd));
      
      return {
        ...prev,
        totalPoints: newTotalPoints,  // ✅ FUENTE PRINCIPAL
        points: {  // ✅ Sincronizar para compatibilidad
          ...prev.points,
          total: newTotalPoints,
          available: Math.max(0, Math.floor((prev.points?.available || 0) + pointsToAdd)),
          spentOnHelps: Math.floor(prev.points?.spentOnHelps || 0),
          currentRank: prev.points?.currentRank || 'Bronce'
        }
      };
    });

    telemetryService.emit('points_added', { userId, points: pointsToAdd });
    return (progress?.totalPoints || 0) + pointsToAdd;
  }, [applyProgressUpdate, userId, progress]);

  /**
   * Agrega XP (compatibilidad con progressManager)
   */
  const addXP = useCallback((xp) => {
    const xpToAdd = Math.max(0, Math.floor(Number(xp) || 0));
    
    applyProgressUpdate((prev) => ({
      ...prev,
      totalXP: Math.max(0, Math.floor((prev.totalXP || 0) + xpToAdd))
    }));

    telemetryService.emit('xp_added', { userId, xp: xpToAdd });
    return (progress?.totalXP || 0) + xpToAdd;
  }, [applyProgressUpdate, userId, progress]);

  /**
   * Registra completación de un quiz
   */
  const recordQuizCompletion = useCallback((quizData) => {
    const {
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      domain,
      level,
      questionsData = []
    } = quizData;

    applyProgressUpdate((prev) => {
      const newHistory = [
        ...(prev.history || []),
        {
          type: 'quiz',
          score,
          totalQuestions,
          correctAnswers,
          accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
          timeSpent,
          domain,
          level,
          completedAt: new Date().toISOString(),
          questionsData
        }
      ];

      const newStreakDays = calculateStreakDays(newHistory, new Date().toISOString());

      return {
        ...prev,
        history: newHistory,
        streakDays: newStreakDays,
        maxStreak: Math.max(prev.maxStreak || 0, newStreakDays),
        lastActivity: new Date().toISOString()
      };
    });

    telemetryService.emit('quiz_completed', { 
      userId, 
      score, 
      totalQuestions, 
      correctAnswers, 
      domain, 
      level 
    });
  }, [applyProgressUpdate, userId]);

  /**
   * Actualiza estadísticas por dominio
   */
  const updateDomainStats = useCallback((domain, stats) => {
    applyProgressUpdate((prev) => {
      const domainStats = prev.domainStats || {};
      const currentDomainStats = domainStats[domain] || {
        attempted: 0,
        correct: 0,
        timeSpent: 0,
        total: 0,
        avgTime: 0
      };

      return {
        ...prev,
        domainStats: {
          ...domainStats,
          [domain]: {
            attempted: currentDomainStats.attempted + (stats.attempted || 0),
            correct: currentDomainStats.correct + (stats.correct || 0),
            timeSpent: currentDomainStats.timeSpent + (stats.timeSpent || 0),
            total: currentDomainStats.total + (stats.total || 0),
            avgTime: stats.avgTime !== undefined ? stats.avgTime : currentDomainStats.avgTime
          }
        }
      };
    });

    telemetryService.emit('domain_stats_updated', { userId, domain, stats });
  }, [applyProgressUpdate, userId]);

  /**
   * Actualiza estadísticas por nivel
   */
  const updateLevelStats = useCallback((level, stats) => {
    applyProgressUpdate((prev) => {
      const levelStats = prev.levelStats || {};
      const currentLevelStats = levelStats[level] || {
        attempted: 0,
        correct: 0
      };

      return {
        ...prev,
        levelStats: {
          ...levelStats,
          [level]: {
            attempted: currentLevelStats.attempted + (stats.attempted || 0),
            correct: currentLevelStats.correct + (stats.correct || 0)
          }
        }
      };
    });

    telemetryService.emit('level_stats_updated', { userId, level, stats });
  }, [applyProgressUpdate, userId]);

  /**
   * Guarda pregunta como respondida
   */
  const saveAnsweredQuestion = useCallback((questionId) => {
    applyProgressUpdate((prev) => {
      const answeredQuestions = prev.answeredQuestions || [];
      
      if (answeredQuestions.includes(questionId)) {
        return prev;
      }

      return {
        ...prev,
        answeredQuestions: [...answeredQuestions, questionId]
      };
    });

    telemetryService.emit('question_answered', { userId, questionId });
  }, [applyProgressUpdate, userId]);

  /**
   * Obtiene preguntas respondidas
   */
  const getAnsweredQuestions = useCallback(() => {
    return progress?.answeredQuestions || [];
  }, [progress]);

  /**
   * Verifica si una pregunta fue respondida
   */
  const isQuestionAnswered = useCallback((questionId) => {
    return (progress?.answeredQuestions || []).includes(questionId);
  }, [progress]);

  /**
   * 🆕 Obtiene solo las preguntas que el usuario respondió incorrectamente
   * y necesitan repaso (más intentos incorrectos que correctos)
   */
  const getIncorrectQuestions = useCallback(() => {
    const questionTracking = progress?.questionTracking || {};
    const incorrectQuestionIds = [];
    
    Object.entries(questionTracking).forEach(([questionId, tracking]) => {
      // Incluir si: tiene intentos Y más incorrectas que correctas
      const hasAttempts = tracking.totalAttempts > 0;
      const moreIncorrectThanCorrect = tracking.incorrectAttempts > tracking.correctAttempts;
      const notMastered = tracking.status !== 'mastered';
      
      if (hasAttempts && moreIncorrectThanCorrect && notMastered) {
        incorrectQuestionIds.push(questionId);
      }
    });
    
    console.log(`📋 Preguntas incorrectas para repaso: ${incorrectQuestionIds.length}`, incorrectQuestionIds);
    return incorrectQuestionIds;
  }, [progress]);

  /**
   * 🆕 Obtiene estadísticas de preguntas incorrectas
   */
  const getIncorrectQuestionsStats = useCallback(() => {
    const questionTracking = progress?.questionTracking || {};
    const stats = {
      total: 0,
      byDomain: {},
      byLevel: {},
      needsReview: []
    };
    
    Object.entries(questionTracking).forEach(([questionId, tracking]) => {
      const moreIncorrectThanCorrect = tracking.incorrectAttempts > tracking.correctAttempts;
      const notMastered = tracking.status !== 'mastered';
      
      if (moreIncorrectThanCorrect && notMastered) {
        stats.total++;
        
        // Por dominio
        if (tracking.domain) {
          stats.byDomain[tracking.domain] = (stats.byDomain[tracking.domain] || 0) + 1;
        }
        
        // Por nivel
        if (tracking.level) {
          stats.byLevel[tracking.level] = (stats.byLevel[tracking.level] || 0) + 1;
        }
        
        // Información de la pregunta para review
        stats.needsReview.push({
          questionId,
          domain: tracking.domain,
          level: tracking.level,
          incorrectAttempts: tracking.incorrectAttempts,
          correctAttempts: tracking.correctAttempts,
          lastAttemptDate: tracking.lastAttemptDate
        });
      }
    });
    
    // Ordenar por más intentos incorrectos primero
    stats.needsReview.sort((a, b) => b.incorrectAttempts - a.incorrectAttempts);
    
    return stats;
  }, [progress]);

  // ============================================================================
  // FUNCIONES INTEGRADAS DE QUESTIONTRACKER
  // ============================================================================

  /**
   * Registra un intento de respuesta a una pregunta
   */
  const recordQuestionAttempt = useCallback((questionId, isCorrect, timeSpent = 0, metadata = {}) => {
    // ✅ SOLUCIÓN #2: Log extensivo para rastrear el guardado
    console.log('📝 CxCProgressContext.recordQuestionAttempt llamado:', {
      questionId,
      isCorrect,
      timeSpent,
      metadata
    });

    applyProgressUpdate((prev) => {
      const questionTracking = prev.questionTracking || {};
      let tracking = questionTracking[questionId] || createNewQuestionTracking(questionId);
      const now = new Date().toISOString();

      console.log('🔍 Estado previo del tracking:', {
        questionId,
        'tracking.totalAttempts': tracking.totalAttempts,
        'tracking.correctAttempts': tracking.correctAttempts,
        'prev.totalPoints': prev.totalPoints,
        'prev.answeredQuestions.length': prev.answeredQuestions?.length || 0
      });

      // Actualizar estadísticas básicas
      tracking = {
        ...tracking,
        totalAttempts: tracking.totalAttempts + 1,
        lastAttemptDate: now,
        lastAttemptCorrect: isCorrect,
        firstAttemptDate: tracking.firstAttemptDate || now
      };

      // Actualizar contadores
      if (isCorrect) {
        tracking.correctAttempts += 1;
        tracking.consecutiveCorrect += 1;
        tracking.consecutiveIncorrect = 0;
      } else {
        tracking.incorrectAttempts += 1;
        tracking.consecutiveIncorrect += 1;
        tracking.consecutiveCorrect = 0;
      }

      // Actualizar tiempo promedio
      if (timeSpent > 0) {
        const totalTime = tracking.averageTimeSpent * (tracking.totalAttempts - 1);
        tracking.averageTimeSpent = (totalTime + timeSpent) / tracking.totalAttempts;
      }

      // Registrar timestamp
      const newTimestamp = {
        date: now,
        correct: isCorrect,
        timeSpent: timeSpent,
        ...metadata
      };
      
      const timestamps = [...(tracking.timestamps || []), newTimestamp];
      tracking.timestamps = timestamps.length > 20 ? timestamps.slice(-20) : timestamps;

      // Actualizar estado y confianza
      tracking = updateQuestionStatusAndConfidence(tracking);
      tracking = calculatePersonalDifficulty(tracking);
      tracking = calculateNextReviewDate(tracking);

      // Agregar metadata del dominio y nivel si existen
      if (metadata.domain) tracking.domain = metadata.domain;
      if (metadata.level) tracking.level = metadata.level;
      if (metadata.subDomain) tracking.subDomain = metadata.subDomain;

      // ✅ SOLO devolver las propiedades que se modifican
      // NO hacer spread de prev para evitar sobrescribir otras actualizaciones
      return {
        ...prev,
        questionTracking: {
          ...questionTracking,
          [questionId]: tracking
        }
        // ✅ NO incluir otras propiedades - dejar que la sanitización las preserve
      };
    });

    telemetryService.emit('question_attempt_recorded', { 
      userId, 
      questionId, 
      isCorrect, 
      timeSpent,
      metadata 
    });
  }, [applyProgressUpdate, userId]);

  /**
   * Obtiene el tracking de una pregunta específica
   */
  const getQuestionTracking = useCallback((questionId) => {
    const questionTracking = progress?.questionTracking || {};
    return questionTracking[questionId] || createNewQuestionTracking(questionId);
  }, [progress]);

  /**
   * Obtiene tracking de todas las preguntas
   */
  const getAllQuestionsTracking = useCallback(() => {
    return progress?.questionTracking || {};
  }, [progress]);

  /**
   * Obtiene estadísticas generales de tracking
   */
  const getQuestionTrackingStats = useCallback(() => {
    const questionTracking = progress?.questionTracking || {};
    const trackingArray = Object.values(questionTracking);

    const stats = {
      total: trackingArray.length,
      new: 0,
      learning: 0,
      reviewing: 0,
      mastered: 0,
      retired: 0,
      averageConfidence: 0,
      totalAttempts: 0,
      overallSuccessRate: 0,
      questionsNeedingReview: 0,
      // Backwards compatibility
      totalQuestions: trackingArray.length,
      newQuestions: 0,
      learningQuestions: 0,
      reviewingQuestions: 0,
      masteredQuestions: 0,
      retiredQuestions: 0
    };

    let totalConfidence = 0;
    let totalCorrect = 0;
    let totalAttempts = 0;
    const today = new Date();

    trackingArray.forEach(tracking => {
      switch (tracking.status) {
        case QUESTION_STATUS.NEW:
          stats.new++;
          stats.newQuestions++;
          break;
        case QUESTION_STATUS.LEARNING:
          stats.learning++;
          stats.learningQuestions++;
          break;
        case QUESTION_STATUS.REVIEWING:
          stats.reviewing++;
          stats.reviewingQuestions++;
          break;
        case QUESTION_STATUS.MASTERED:
          stats.mastered++;
          stats.masteredQuestions++;
          break;
        case QUESTION_STATUS.RETIRED:
          stats.retired++;
          stats.retiredQuestions++;
          break;
        default:
          stats.new++;
          stats.newQuestions++;
      }

      totalConfidence += tracking.confidenceLevel || 0;
      totalAttempts += tracking.totalAttempts || 0;
      totalCorrect += tracking.correctAttempts || 0;

      if (tracking.nextReviewDate) {
        const reviewDate = new Date(tracking.nextReviewDate);
        if (reviewDate <= today) {
          stats.questionsNeedingReview++;
        }
      }
    });

    stats.averageConfidence = trackingArray.length > 0 
      ? totalConfidence / trackingArray.length 
      : 0;
    stats.totalAttempts = totalAttempts;
    stats.overallSuccessRate = totalAttempts > 0 
      ? (totalCorrect / totalAttempts) * 100 
      : 0;

    return stats;
  }, [progress]);

  /**
   * Actualiza progreso después de un quiz (compatibilidad con progressManager)
   */
  const updateProgressAfterQuiz = useCallback((quizResults) => {
    console.log('🎯 CxCProgressContext.updateProgressAfterQuiz llamado con:', quizResults);
    
    // 🆕 VALIDACIÓN: Prevenir actualización duplicada con el mismo quiz
    const quizSignature = JSON.stringify({
      questions: quizResults.questionDetails?.map(q => q.id).sort(),
      correctAnswers: quizResults.correctAnswers,
      totalTime: quizResults.totalTime
    });
    
    // Verificar si ya procesamos este quiz (usando el ref correctamente definido)
    if (lastProcessedQuizzesRef.current.has(quizSignature)) {
      console.log('⚠️ Quiz duplicado detectado en contexto, ignorando');
      return {
        newAchievements: [],
        pointsEarned: 0,
        xpEarned: 0,
        levelUp: false,
        duplicate: true
      };
    }
    
    lastProcessedQuizzesRef.current.add(quizSignature);
    
    // Limpiar signatures antiguas después de 5 segundos
    setTimeout(() => {
      lastProcessedQuizzesRef.current.delete(quizSignature);
    }, 5000);
    
    const newAchievements = [];
    const totalQuestions = Math.max(0, Number(quizResults?.totalQuestions) || 0);
    const correctAnswers = Math.max(0, Number(quizResults?.correctAnswers) || 0);
    const totalTime = Math.max(0, Number(quizResults?.totalTime) || 0);
    const questionDetails = quizResults?.questionDetails || [];

    // Calcular puntos SOLO por respuestas correctas con nivel
    let quizPoints = 0;
    questionDetails.forEach(detail => {
      if (detail.correct) {
        // Puntos base por nivel (solo si acertó)
        const basePoints = detail.level === 'avanzado' ? 30 : detail.level === 'intermedio' ? 20 : 10;
        quizPoints += basePoints;
      }
    });

    console.log('💰 Puntos calculados:', { quizPoints, totalQuestions, correctAnswers });

    // Calcular XP (1.5x los puntos)
    const quizXP = Math.round(quizPoints * 1.5);

    // Calcular porcentaje de acierto
    const scorePercentage = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Bonus por quiz perfecto
    if (scorePercentage === 100 && totalQuestions >= 5) {
      quizPoints += 100;
      if (!(progress?.achievements || []).includes(ACHIEVEMENT_TYPES.PERFECT_QUIZ.id)) {
        newAchievements.push(ACHIEVEMENT_TYPES.PERFECT_QUIZ);
      }
    } else if (scorePercentage >= 90) {
      quizPoints += 50;
    } else if (scorePercentage >= 80) {
      quizPoints += 25;
    }

    // Bonus por velocidad (solo si tiene buena precisión)
    const avgTimePerQuestion = totalQuestions > 0 ? totalTime / totalQuestions : Infinity;
    if (avgTimePerQuestion < 30000 && scorePercentage >= 80) { // 30 segundos
      quizPoints += 50;
      if (totalTime < 300000 && !(progress?.achievements || []).includes(ACHIEVEMENT_TYPES.SPEED_DEMON.id)) { // 5 min
        newAchievements.push(ACHIEVEMENT_TYPES.SPEED_DEMON);
      }
    }

    applyProgressUpdate((prev) => {
      // ✅ VERIFICACIÓN ADICIONAL: Detectar duplicados en historial reciente
      const recentHistory = (prev.history || []).slice(0, 5);
      const isDuplicate = recentHistory.some(h => 
        h.type === 'quiz' && 
        h.questions === totalQuestions &&
        h.correctAnswers === correctAnswers &&
        Math.abs(new Date(h.completedAt) - Date.now()) < 2000 // Menos de 2 segundos
      );

      if (isDuplicate) {
        console.log('⚠️ Quiz duplicado detectado en historial, ignorando actualización');
        return prev; // No hacer cambios si es duplicado
      }
      
      const updatedProgress = { ...prev };
      
      // ✅ FIX 1: Actualizar domainStats con campo `incorrect` calculado
      const domainStats = { ...prev.domainStats };
      questionDetails.forEach(detail => {
        const domain = detail.domain;
        if (!domainStats[domain]) {
          domainStats[domain] = { attempted: 0, correct: 0, incorrect: 0, timeSpent: 0, total: 0, avgTime: 0 };
        }
        domainStats[domain].attempted++;
        domainStats[domain].total++;
        if (detail.correct) {
          domainStats[domain].correct++;
        } else {
          domainStats[domain].incorrect++; // ✅ Agregar contador de incorrectas
        }
        domainStats[domain].timeSpent += detail.timeSpent || 0;
        domainStats[domain].avgTime = domainStats[domain].attempted > 0
          ? domainStats[domain].timeSpent / domainStats[domain].attempted
          : 0;
      });
      updatedProgress.domainStats = domainStats;

      // ✅ Actualizar levelStats AQUÍ (evitar duplicación)
      const levelStats = { ...prev.levelStats };
      questionDetails.forEach(detail => {
        const level = detail.level;
        if (!levelStats[level]) {
          levelStats[level] = { attempted: 0, correct: 0 };
        }
        levelStats[level].attempted++;
        if (detail.correct) {
          levelStats[level].correct++;
        }
      });
      updatedProgress.levelStats = levelStats;

      // Actualizar estadísticas básicas
      updatedProgress.quizzesTaken = (prev.quizzesTaken || 0) + 1;
      // ❌ NO incrementar questionsAnswered aquí - ya se hizo en saveAnsweredQuestion
      // updatedProgress.questionsAnswered está en progress.answeredQuestions.length
      updatedProgress.correctAnswers = (prev.correctAnswers || 0) + correctAnswers;
      updatedProgress.totalTimeSpent = (prev.totalTimeSpent || 0) + totalTime;

      // Actualizar puntos y XP
      updatedProgress.totalPoints = (prev.totalPoints || 0) + quizPoints;
      updatedProgress.totalXP = (prev.totalXP || 0) + quizXP;

      // Mejor puntaje
      updatedProgress.bestScore = Math.max(prev.bestScore || 0, scorePercentage);

      // Quiz más rápido
      if (!prev.fastestQuiz || totalTime < prev.fastestQuiz) {
        updatedProgress.fastestQuiz = totalTime;
      }

      // ✅ FIX 2: Racha diaria correcta con sincronización de currentStreak
      const today = new Date().toDateString();
      const lastQuizDate = prev.lastQuizDate ? new Date(prev.lastQuizDate).toDateString() : null;
      
      if (lastQuizDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastQuizDate === yesterday) {
          // Continuar racha
          updatedProgress.currentStreak = (prev.currentStreak || 0) + 1;
          updatedProgress.streakDays = updatedProgress.currentStreak; // Sincronizar
        } else {
          // Resetear racha (gap mayor a 1 día)
          updatedProgress.currentStreak = 1;
          updatedProgress.streakDays = 1;
        }
        
        // Actualizar racha más larga
        updatedProgress.longestStreak = Math.max(
          prev.longestStreak || 0, 
          updatedProgress.currentStreak
        );
        
        updatedProgress.lastQuizDate = new Date().toISOString();
        updatedProgress.lastActivity = new Date().toISOString(); // Actualizar última actividad
      } else {
        // Mismo día, no cambiar racha pero actualizar lastActivity
        updatedProgress.lastActivity = new Date().toISOString();
      }

      // Verificar logros de racha
      const achievements = [...(prev.achievements || [])];
      
      if (updatedProgress.streakDays >= 5 && !achievements.includes(ACHIEVEMENT_TYPES.STREAK_5.id)) {
        newAchievements.push(ACHIEVEMENT_TYPES.STREAK_5);
      }
      if (updatedProgress.streakDays >= 10 && !achievements.includes(ACHIEVEMENT_TYPES.STREAK_10.id)) {
        newAchievements.push(ACHIEVEMENT_TYPES.STREAK_10);
      }
      if (updatedProgress.quizzesTaken === 1 && !achievements.includes(ACHIEVEMENT_TYPES.FIRST_QUIZ.id)) {
        newAchievements.push(ACHIEVEMENT_TYPES.FIRST_QUIZ);
      }
      
      // Verificar logro de 100 preguntas basado en answeredQuestions
      const totalAnswered = (prev.answeredQuestions || []).length;
      if (totalAnswered >= 100 && !achievements.includes(ACHIEVEMENT_TYPES.HUNDRED_QUESTIONS.id)) {
        newAchievements.push(ACHIEVEMENT_TYPES.HUNDRED_QUESTIONS);
      }

      // Agregar nuevos logros
      newAchievements.forEach(achievement => {
        if (!achievements.includes(achievement.id)) {
          achievements.push(achievement.id);
          updatedProgress.totalPoints += achievement.points;
        }
      });

      updatedProgress.achievements = achievements;

      // Calcular nivel
      const levelInfo = calculateLevel(updatedProgress.totalPoints);
      updatedProgress.currentLevel = levelInfo.level;

      // ✅ FIX 3: Actualizar historial con campos correctos y clarificados
      const history = [...(prev.history || [])];
      history.unshift({
        type: 'quiz', // ✅ Tipo de entrada en el historial
        completedAt: new Date().toISOString(), // ✅ Timestamp principal
        date: new Date().toISOString(), // Backward compatibility
        score: correctAnswers, // ✅ Número de respuestas correctas (e.g., 8)
        accuracy: scorePercentage, // ✅ Porcentaje de acierto (e.g., 80)
        points: quizPoints, // Puntos ganados en este quiz
        xp: quizXP, // XP ganado en este quiz
        questions: totalQuestions, // Total de preguntas del quiz
        correctAnswers: correctAnswers, // Respuestas correctas (duplicado de score para claridad)
        incorrectAnswers: totalQuestions - correctAnswers, // ✅ Respuestas incorrectas
        timeSpent: totalTime, // Tiempo total del quiz en ms
        domain: quizResults.domain || 'all', // Dominio del quiz
        newAchievements: newAchievements.map(a => a.id) // Logros desbloqueados
      });

      updatedProgress.history = history.length > 50 ? history.slice(0, 50) : history;

      console.log('✅ Estado actualizado en updateProgressAfterQuiz:', {
        'updatedProgress.totalPoints': updatedProgress.totalPoints,
        'updatedProgress.totalXP': updatedProgress.totalXP,
        'updatedProgress.answeredQuestions.length': updatedProgress.answeredQuestions?.length || 0,
        'updatedProgress.currentLevel': updatedProgress.currentLevel,
        'updatedProgress.quizzesTaken': updatedProgress.quizzesTaken,
        'newAchievements': newAchievements.map(a => a.id)
      });

      return updatedProgress;
    });

    console.log('🎉 updateProgressAfterQuiz completado. Puntos ganados:', quizPoints, 'XP ganado:', quizXP);

    telemetryService.emit('quiz_completed', { 
      userId, 
      quizResults, 
      pointsEarned: quizPoints,
      xpEarned: quizXP,
      newAchievements: newAchievements.map(a => a.id)
    });

    // ✅ NO devolver el estado viejo del closure - el estado se actualiza asíncronamente
    // El componente debe leer el estado actualizado después de que React re-renderice
    return {
      // progress actualizado estará disponible en el siguiente render
      newAchievements,
      pointsEarned: quizPoints,
      xpEarned: quizXP,
      levelUp: false // Calcular si subió de nivel
    };
  }, [applyProgressUpdate, userId, progress]);

  /**
   * Obtiene estadísticas completas (compatibilidad con progressManager.getStats())
   */
  const getStats = useCallback(() => {
    if (!progress) {
      console.warn('⚠️ getStats(): progress is null');
      return null;
    }
    
    // ✅ LOGGING DETALLADO - Ver EXACTAMENTE qué está leyendo getStats
    console.log('📊 getStats() ejecutándose con progress:', {
      totalPoints: progress.totalPoints,
      totalXP: progress.totalXP,
      answeredQuestions: progress.answeredQuestions?.length,
      questionTracking: Object.keys(progress.questionTracking || {}).length,
      history: progress.history?.length,
      domainStats: Object.keys(progress.domainStats || {}).length,
      // ⚠️ VERIFICAR: ¿Es el objeto progress correcto?
      _progressObjectId: progress._debugId || 'no-id'
    });
    
    console.log('🔍 getStats() - Valores RAW:', {
      'progress.totalPoints (tipo)': typeof progress.totalPoints,
      'progress.totalPoints (valor)': progress.totalPoints,
      'progress.totalXP (tipo)': typeof progress.totalXP,
      'progress.totalXP (valor)': progress.totalXP
    });
    
    // ✅ ESTADÍSTICAS BÁSICAS - Normalizar valores numéricos
    const totalPoints = toPositiveInteger(progress.totalPoints);
    const totalXP = toPositiveInteger(progress.totalXP);
    const levelInfoRaw = calculateLevel(totalPoints);
    const levelInfo = {
      ...levelInfoRaw,
      progressToNext: clampNumber(roundNumber(levelInfoRaw.progressToNext ?? 0, 1), 0, 100),
      pointsToNext: Math.max(0, toInteger(levelInfoRaw.pointsToNext ?? 0))
    };
    
    // ✅ PREGUNTAS Y QUIZZES
    const answeredQuestions = progress.answeredQuestions || [];
    const questionsAnswered = answeredQuestions.length;
    const quizzesTaken = (progress.history || []).filter(h => h.type === 'quiz').length;
    const correctAnswers = toPositiveInteger(calculateCorrectAnswers(progress.questionTracking));
    const globalAccuracy = calculateGlobalAccuracy(progress.questionTracking);
    
    // ⚠️ VALIDACIÓN: Si questionTracking está vacío pero answeredQuestions tiene datos
    if (questionsAnswered > 0 && Object.keys(progress.questionTracking || {}).length === 0) {
      console.warn('⚠️ INCONSISTENCIA: answeredQuestions tiene datos pero questionTracking está vacío');
    }
    
    // ⚠️ VALIDACIÓN: Si history tiene quizzes pero answeredQuestions está vacío
    if (quizzesTaken > 0 && questionsAnswered === 0) {
      console.warn('⚠️ INCONSISTENCIA: history tiene quizzes pero answeredQuestions está vacío');
    }
    
    // ✅ RACHA Y ACTIVIDAD
    const streakDays = Math.max(0, toInteger(calculateStreakDays(progress.history, progress.lastActivity)));
    const maxStreak = Math.max(0, toInteger(progress.maxStreak || 0));
    const lastActivity = progress.lastActivity || null;
    
    // ✅ TIEMPO Y VELOCIDAD
    const totalTimeSpent = Math.max(0, toInteger(calculateTotalTime(progress.questionTracking)));
    const avgTimePerQuestion = questionsAnswered > 0 
      ? Math.max(0, toInteger(totalTimeSpent / questionsAnswered)) 
      : 0;
    
    const history = progress.history || [];
    const bestScore = history.length > 0
      ? roundNumber(Math.max(...history.map(quiz => toFiniteNumber(quiz.score, 0))), 1)
      : 0;
    const fastestTimes = history.length > 0
      ? history
          .map(quiz => toFiniteNumber(quiz.timeSpent, Infinity))
          .filter(time => Number.isFinite(time) && time >= 0)
      : [];
    const fastestQuizRaw = fastestTimes.length > 0
      ? Math.min(...fastestTimes)
      : null;
    const fastestQuiz = Number.isFinite(fastestQuizRaw)
      ? Math.max(0, toInteger(fastestQuizRaw))
      : null;
    
    // ✅ RETENCIÓN FSRS
    const avgRetention = clampNumber(toPositiveInteger(calculateAvgRetention(progress.questionTracking)), 0, 100);
    const avgStability = toPositiveInteger(calculateAvgStability(progress.questionTracking));
    const dueReviews = toPositiveInteger(countDueReviews(progress.questionTracking));
    const mastered = toPositiveInteger(countMastered(progress.questionTracking));
    
    // ✅ ZONA DE DESARROLLO PRÓXIMO (ZPD)
    const comfortZone = clampNumber(toPositiveInteger(calculateComfortZone(progress.questionTracking)), 0, 100);
    const zpd = clampNumber(toPositiveInteger(calculateZPD(progress.questionTracking)), 0, 100);
    const challenging = clampNumber(toPositiveInteger(calculateChallenging(progress.questionTracking)), 0, 100);
    
    // ✅ ESTADÍSTICAS DE DOMINIO - CON VALIDACIÓN ROBUSTA
    const domainStats = {};
    Object.entries(progress.domainStats || {}).forEach(([domain, stats]) => {
      // Validar que stats sea un objeto
      if (!stats || typeof stats !== 'object') {
        console.warn(`⚠️ domainStats[${domain}] no es un objeto válido:`, stats);
        return;
      }
      
      const attempted = toPositiveInteger(stats.attempted);
      const correct = toPositiveInteger(stats.correct);
      
      // ✅ VALIDACIÓN: correct no puede ser mayor que attempted
      const validCorrect = Math.min(correct, attempted);
      
      const baseIncorrect = stats.incorrect !== undefined
        ? stats.incorrect
        : attempted - validCorrect;
      const incorrect = toPositiveInteger(baseIncorrect);
      
      // ✅ VALIDACIÓN: attempted + incorrect debe tener sentido
      const validIncorrect = Math.min(incorrect, attempted);
      
      const total = toPositiveInteger(stats.total);
      const timeSpent = Math.max(0, toInteger(stats.timeSpent || 0));
      const avgTime = roundNumber(stats.avgTime || 0, 1);
      
      // ✅ PRECISIÓN: con validación anti-división por cero
      const domainAccuracy = attempted > 0 
        ? clampNumber(roundNumber((validCorrect / attempted) * 100, 1), 0, 100) 
        : 0;
      
      // ✅ VALIDACIÓN DE CONSISTENCIA
      if (validCorrect + validIncorrect > attempted) {
        console.warn(`⚠️ Inconsistencia en dominio ${domain}: correct(${validCorrect}) + incorrect(${validIncorrect}) > attempted(${attempted})`);
      }
      
      domainStats[domain] = {
        ...stats,
        attempted,
        correct: validCorrect,
        incorrect: validIncorrect,
        total,
        timeSpent,
        avgTime,
        accuracy: domainAccuracy
      };
    });
    
    const domainEntries = Object.entries(domainStats);
    const strongDomains = domainEntries
      .filter(([_, stats]) => stats.accuracy >= 75 && stats.attempted >= 5)
      .map(([domain]) => domain);
    const weakDomains = domainEntries
      .filter(([_, stats]) => stats.accuracy < 60 && stats.attempted >= 5)
      .map(([domain]) => domain);
    
    // ✅ LOGROS
    const achievements = progress.achievements || [];
    const achievementCount = achievements.length;
    const badges = progress.badges || [];
    
    // ✅ PREPARACIÓN PARA EXAMEN
    const examReadiness = clampNumber(calculateExamReadiness(progress), 0, 100);
    const daysToReady = Math.max(0, toInteger(estimateDaysToReady(progress)));
    const confidence = determineConfidence(progress);
    
    // ✅ INSIGHTS Y TENDENCIAS
    const recentQuizzes = history.slice(-5);
    const recentAvgAccuracy = recentQuizzes.length > 0
      ? clampNumber(roundNumber(
          recentQuizzes.reduce((sum, q) => sum + toFiniteNumber(q.accuracy, 0), 0) / recentQuizzes.length,
          1
        ), 0, 100)
      : 0;

    const lastQuizAccuracy = recentQuizzes.length > 0
      ? toFiniteNumber(recentQuizzes[recentQuizzes.length - 1].accuracy, 0)
      : 0;
    const firstQuizAccuracy = recentQuizzes.length > 0
      ? toFiniteNumber(recentQuizzes[0].accuracy, 0)
      : 0;
    const improving = recentQuizzes.length >= 2 && lastQuizAccuracy > firstQuizAccuracy;

    const result = {
      // ✅ Básicos
      totalPoints,
      totalXP,
      levelInfo,
      currentLevel: levelInfo.level,

      // ✅ Preguntas (USAR answeredQuestions.length como fuente)
      questionsAnswered, // ✅ Calculado desde answeredQuestions.length
      answeredQuestions: questionsAnswered, // ✅ Alias para compatibilidad
      correctAnswers,
      accuracy: globalAccuracy, // ✅ Alias primario
      globalAccuracy, // ✅ Backward compatibility

      // ✅ Quizzes
      quizzesTaken,
      bestScore,
      fastestQuiz,

      // ✅ Tiempo
      totalTimeSpent,
      avgTimePerQuestion,

      // ✅ Racha
      streakDays,
      maxStreak,
      lastActivity,

      // ✅ Retención FSRS
      avgRetention,
      avgStability,
      dueReviews,
      mastered,

      // ✅ ZPD
      comfortZone,
      zpd,
      challenging,

      // ✅ Dominios
      domainStats,
      strongDomains,
      weakDomains,

      // ✅ Logros
      achievements,
      achievementCount,
      badges,

      // ✅ Examen
      examReadiness,
      daysToReady,
      confidence,

      // ✅ Tendencias
      recentQuizzes,
      recentAvgAccuracy,
      improving,

      // ✅ Historia completa
      history // ✅ Agregar history explícitamente
    };
    
    console.log('✅ getStats() resultado:', {
      questionsAnswered: result.questionsAnswered,
      quizzesTaken: result.quizzesTaken,
      totalPoints: result.totalPoints,
      accuracy: result.accuracy,
      domainStatsCount: Object.keys(result.domainStats).length
    });
    
    return result;
  }, [progress]);

  /**
   * Verifica y desbloquea logros basados en el progreso actual
   */
  const checkAchievements = useCallback(() => {
    if (!progress) return [];

    const stats = getStats();
    const unlockedAchievements = progress.achievements || [];
    const newAchievements = [];

    const checkAndUnlock = (achievementKey) => {
      const achievement = ACHIEVEMENT_TYPES[achievementKey];
      if (!achievement) return;
      
      if (!unlockedAchievements.includes(achievement.id)) {
        unlockAchievement(achievement.id);
        newAchievements.push(achievement);
      }
    };

    // ===== PROGRESO =====
    if (stats.quizzesTaken >= 1) checkAndUnlock('FIRST_QUIZ');
    if (stats.questionsAnswered >= 25) checkAndUnlock('EXPLORER');
    if (stats.questionsAnswered >= 50) checkAndUnlock('DEDICATED');
    if (stats.questionsAnswered >= 75) checkAndUnlock('ENCYCLOPEDIA');
    if (stats.questionsAnswered >= 100) checkAndUnlock('HUNDRED_QUESTIONS');

    // ===== PRECISIÓN =====
    if (stats.globalAccuracy >= 95 && stats.questionsAnswered >= 10) {
      checkAndUnlock('SHARPSHOOTER');
    }
    if (stats.globalAccuracy >= 90 && stats.questionsAnswered >= 20) {
      checkAndUnlock('ACCURACY_MASTER');
    }
    if (stats.globalAccuracy >= 80 && stats.questionsAnswered >= 30) {
      checkAndUnlock('CONSISTENT');
    }
    
    // Verificar quiz perfecto en historial
    const hasPerfectQuiz = (progress.history || []).some(h => 
      h.type === 'quiz' && h.accuracy === 100
    );
    if (hasPerfectQuiz) checkAndUnlock('PERFECT_QUIZ');

    // ===== VELOCIDAD =====
    if (stats.fastestQuiz && stats.fastestQuiz < 120000) { // 2 min
      checkAndUnlock('FLASH');
    } else if (stats.fastestQuiz && stats.fastestQuiz < 180000) { // 3 min
      checkAndUnlock('LIGHTNING');
    } else if (stats.fastestQuiz && stats.fastestQuiz < 300000) { // 5 min
      checkAndUnlock('SPEED_DEMON');
    }

    // ===== RACHA =====
    if (stats.streakDays >= 30) {
      checkAndUnlock('STREAK_30');
    } else if (stats.streakDays >= 14) {
      checkAndUnlock('STREAK_10');
    } else if (stats.streakDays >= 7) {
      checkAndUnlock('STREAK_5');
    } else if (stats.streakDays >= 3) {
      checkAndUnlock('STREAK_3');
    }

    // ===== DOMINIO =====
    const masterDomains = Object.entries(stats.domainStats || {}).filter(
      ([_, domainData]) => domainData.accuracy >= 90 && domainData.attempted >= 5
    );
    if (masterDomains.length >= 1) checkAndUnlock('MASTER_DOMAIN');

    const expertDomains = Object.entries(stats.domainStats || {}).filter(
      ([_, domainData]) => domainData.accuracy >= 80 && domainData.attempted >= 5
    );
    if (expertDomains.length >= 3) checkAndUnlock('DOMAIN_EXPERT');

    const allDomainsGood = Object.entries(stats.domainStats || {}).every(
      ([_, domainData]) => domainData.accuracy >= 75 || domainData.attempted < 3
    );
    if (allDomainsGood && Object.keys(stats.domainStats || {}).length >= 5) {
      checkAndUnlock('POLYMATH');
    }

    // ===== ESPECIALES =====
    // Guerrero Semanal: 10 quizzes en 7 días
    const lastWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const quizzesThisWeek = (progress.history || []).filter(h => 
      h.type === 'quiz' && new Date(h.completedAt) >= lastWeek
    ).length;
    if (quizzesThisWeek >= 10) checkAndUnlock('WEEK_WARRIOR');

    // Maratonista: 5 quizzes en un día
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const quizzesToday = (progress.history || []).filter(h => {
      const quizDate = new Date(h.completedAt);
      quizDate.setHours(0, 0, 0, 0);
      return h.type === 'quiz' && quizDate.getTime() === today.getTime();
    }).length;
    if (quizzesToday >= 5) checkAndUnlock('MARATHON');

    // Búho Nocturno / Madrugador
    const lastQuiz = (progress.history || [])
      .filter(h => h.type === 'quiz')
      .slice(-1)[0];
    if (lastQuiz) {
      const hour = new Date(lastQuiz.completedAt).getHours();
      if (hour >= 22 || hour < 6) checkAndUnlock('NIGHT_OWL');
      if (hour < 7) checkAndUnlock('EARLY_BIRD');
    }

    // ===== RETENCIÓN (FSRS) =====
    if (stats.avgRetention >= 90) checkAndUnlock('ELEPHANT_MEMORY');
    if (stats.avgStability >= 20) checkAndUnlock('STABLE_KNOWLEDGE');
    if (stats.mastered >= 20) checkAndUnlock('MASTER_20');

    // ===== EXAM READINESS =====
    if (stats.examReadiness >= 85) checkAndUnlock('EXAM_READY');
    if (stats.confidence?.level === 'Alta') checkAndUnlock('HIGH_CONFIDENCE');

    return newAchievements;
  }, [progress, getStats, unlockAchievement]);

  /**
   * Resetea el progreso completo
   */
  const resetProgress = useCallback(async () => {
    const newProgress = progressService.createInitialProgress();
    setProgress(newProgress.progress);
    await progressService.saveProgress(newProgress, { source: 'reset' });
    
    telemetryService.emit('progress_reset', { userId });
  }, [userId]);

  // Computed values
  const completedMissions = useMemo(() => {
    if (!progress?.missions) return [];
    return Object.keys(progress.missions).filter(
      missionId => progress.missions[missionId].status === 'completed'
    );
  }, [progress]);

  const value = {
    // Estado principal
    progress: progress ? {
      ...progress,
      completedMissions,
      totalPoints: progress.totalPoints || progress.points?.total || 0
    } : null,
    loading,
    saving,
    lastSaved,
    userId,
    dirty,
    
    // Funciones de misiones (CxC)
    updateMissionProgress,
    completeMission,
    useHelp,
    unlockBadge,
    unlockAchievement,
    checkAchievements,
    setCurrentAct,
    setFinalPath,
    saveProgress,
    
    // Funciones de progressManager (integradas)
    addPoints,
    addXP,
    recordQuizCompletion,
    updateDomainStats,
    updateLevelStats,
    saveAnsweredQuestion,
    getAnsweredQuestions,
    isQuestionAnswered,
    getIncorrectQuestions, // 🆕 Obtener preguntas incorrectas
    getIncorrectQuestionsStats, // 🆕 Estadísticas de preguntas incorrectas
    updateProgressAfterQuiz,
    getStats,
    resetProgress,
    
    // Funciones de questionTracker (integradas)
    recordQuestionAttempt,
    getQuestionTracking,
    getAllQuestionsTracking,
    getQuestionTrackingStats,
    
    // Constantes exportadas para compatibilidad
    ACHIEVEMENT_TYPES,
    LEVEL_THRESHOLDS,
    QUESTION_STATUS,
    CONFIDENCE_LEVELS,
    MASTERY_CONFIG,
    
    // ✅ Exportar progress como state para que los componentes puedan observar cambios
    state: progress
  };

  return (
    <CxCProgressContext.Provider value={value}>
      {children}
    </CxCProgressContext.Provider>
  );
};
