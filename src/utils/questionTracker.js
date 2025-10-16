/**
 * ⚠️ ADVERTENCIA: ESTE ARCHIVO ESTÁ DEPRECATED ⚠️
 * 
 * Este archivo ha sido marcado como obsoleto y será removido en futuras versiones.
 * 
 * ❌ NO USAR: questionTracker
 * ✅ USAR EN SU LUGAR: useCxCProgress() de CxCProgressContext
 * 
 * Razón: Centralización de estado en un único contexto de React para:
 * - Evitar inconsistencias entre múltiples fuentes de datos
 * - Aprovechar el sistema de sincronización multi-pestaña
 * - Mantener una única fuente de verdad (Single Source of Truth)
 * 
 * Migración:
 * ```javascript
 * // ❌ Antes (deprecated)
 * import { questionTracker } from '../utils/questionTracker';
 * questionTracker.recordAttempt('q1', true, 30);
 * 
 * // ✅ Ahora (recomendado)
 * import { useCxCProgress } from '../contexts/CxCProgressContext';
 * const { recordQuestionAttempt } = useCxCProgress();
 * recordQuestionAttempt('q1', true, 30);
 * ```
 * 
 * @deprecated Usar useCxCProgress en su lugar
 * @see CxCProgressContext
 */

/**
 * 🎯 SISTEMA ROBUSTO DE TRACKING DE PREGUNTAS
 * 
 * Sistema avanzado de seguimiento individual de preguntas que implementa:
 * - Repetición espaciada (Spaced Repetition)
 * - Tracking de dominio por pregunta
 * - Sistema de confianza (confidence scoring)
 * - Algoritmo de selección inteligente
 */

// ============================================================================
// 1. CONFIGURACIÓN DEL SISTEMA
// ============================================================================

export const QUESTION_STATUS = {
  NEW: 'new',                    // Nunca vista
  LEARNING: 'learning',          // En proceso de aprendizaje (incorrecta al menos 1 vez)
  REVIEWING: 'reviewing',        // Correcta, pero necesita repaso
  MASTERED: 'mastered',          // Dominada (correcta múltiples veces consecutivas)
  RETIRED: 'retired'             // Retirada temporalmente (muy dominada)
};

export const CONFIDENCE_LEVELS = {
  NONE: 0,           // No respondida
  VERY_LOW: 1,       // 1 correcta de 3+ intentos
  LOW: 2,            // 1-2 correctas de 3 intentos
  MEDIUM: 3,         // 2 correctas de 3 intentos
  HIGH: 4,           // 3+ correctas consecutivas
  VERY_HIGH: 5       // 5+ correctas consecutivas
};

export const MASTERY_CONFIG = {
  ATTEMPTS_TO_MASTER: 3,        // Intentos correctos consecutivos para dominar
  ATTEMPTS_TO_RETIRE: 5,        // Intentos correctos consecutivos para retirar
  REVIEW_INTERVAL_DAYS: 7,      // Días antes de revisar pregunta dominada
  MAX_STREAK_REWARD: 10,        // Máxima racha de correctas para rewards
  MIN_ATTEMPTS_FOR_CONFIDENCE: 2 // Mínimo de intentos para calcular confianza
};

// ============================================================================
// 2. CLASE PRINCIPAL: QuestionTracker
// ============================================================================

/**
 * @deprecated Usar useCxCProgress en su lugar
 */
export class QuestionTracker {
  constructor() {
    this.storageKey = 'pl300_question_tracking';
    this.historyKey = 'pl300_question_history';
    this._deprecationWarned = false;
  }

  /**
   * Muestra advertencia de deprecación en consola
   * @private
   */
  _warnDeprecation(methodName) {
    if (!this._deprecationWarned) {
      console.warn(
        `%c⚠️ ADVERTENCIA DE DEPRECACIÓN`,
        'color: #ff6b6b; font-weight: bold; font-size: 14px;',
        `\n\nEstás usando questionTracker.${methodName}() que está DEPRECATED.`,
        `\n\n✅ MIGRA A: useCxCProgress() de CxCProgressContext`,
        `\n\nEjemplo:`,
        `\n  import { useCxCProgress } from '../contexts/CxCProgressContext';`,
        `\n  const { recordQuestionAttempt } = useCxCProgress();`,
        `\n  recordQuestionAttempt(...);`,
        `\n\nEste archivo será removido en futuras versiones.`,
        `\n`
      );
      this._deprecationWarned = true;
    }
  }

  /**
   * Obtiene el tracking completo de todas las preguntas
   * @deprecated Usar useCxCProgress().getAllQuestionsTracking() en su lugar
   */
  getAllTracking() {
    this._warnDeprecation('getAllTracking');
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  /**
   * Alias para getAllTracking (compatibilidad)
   * @deprecated Usar useCxCProgress().getAllQuestionsTracking() en su lugar
   */
  getAllQuestionsTracking() {
    this._warnDeprecation('getAllQuestionsTracking');
    return this.getAllTracking();
  }

  /**
   * Obtiene el tracking de una pregunta específica
   * @deprecated Usar useCxCProgress().getQuestionTracking() en su lugar
   */
  getQuestionTracking(questionId) {
    this._warnDeprecation('getQuestionTracking');
    const allTracking = this.getAllTracking();
    return allTracking[questionId] || this.createNewTracking(questionId);
  }

  /**
   * Crea un nuevo registro de tracking para una pregunta
   */
  createNewTracking(questionId) {
    return {
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
      difficultyRating: null,      // Dificultad percibida por el usuario
      personalDifficulty: null,     // Dificultad calculada basada en rendimiento
      tags: [],                     // Tags adicionales
      notes: ''                     // Notas del usuario
    };
  }

  /**
   * Registra un intento de respuesta a una pregunta
   * @deprecated Usar useCxCProgress().recordQuestionAttempt() en su lugar
   */
  recordAttempt(questionId, isCorrect, timeSpent = 0, metadata = {}) {
    this._warnDeprecation('recordAttempt');
    const allTracking = this.getAllTracking();
    const questionTracking = allTracking[questionId] || this.createNewTracking(questionId);
    const now = new Date().toISOString();

    // Actualizar estadísticas básicas
    questionTracking.totalAttempts += 1;
    questionTracking.lastAttemptDate = now;
    questionTracking.lastAttemptCorrect = isCorrect;

    if (questionTracking.totalAttempts === 1) {
      questionTracking.firstAttemptDate = now;
    }

    // Actualizar contadores de correctas/incorrectas
    if (isCorrect) {
      questionTracking.correctAttempts += 1;
      questionTracking.consecutiveCorrect += 1;
      questionTracking.consecutiveIncorrect = 0;
    } else {
      questionTracking.incorrectAttempts += 1;
      questionTracking.consecutiveIncorrect += 1;
      questionTracking.consecutiveCorrect = 0;
    }

    // Actualizar tiempo promedio
    if (timeSpent > 0) {
      const totalTime = questionTracking.averageTimeSpent * (questionTracking.totalAttempts - 1);
      questionTracking.averageTimeSpent = (totalTime + timeSpent) / questionTracking.totalAttempts;
    }

    // Registrar timestamp del intento
    questionTracking.timestamps.push({
      date: now,
      correct: isCorrect,
      timeSpent: timeSpent,
      ...metadata
    });

    // Mantener solo los últimos 20 timestamps para no ocupar mucho espacio
    if (questionTracking.timestamps.length > 20) {
      questionTracking.timestamps = questionTracking.timestamps.slice(-20);
    }

    // Actualizar estado y nivel de confianza
    this.updateStatusAndConfidence(questionTracking);

    // Calcular dificultad personal
    this.calculatePersonalDifficulty(questionTracking);

    // Calcular próxima fecha de revisión
    this.calculateNextReviewDate(questionTracking);

    // Guardar
    allTracking[questionId] = questionTracking;
    this.saveAllTracking(allTracking);

    // Guardar en historial global
    this.saveToHistory(questionId, isCorrect, timeSpent, metadata);

    return questionTracking;
  }

  /**
   * Actualiza el estado y nivel de confianza de una pregunta
   */
  updateStatusAndConfidence(tracking) {
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
  }

  /**
   * Calcula la dificultad personal basada en el rendimiento
   */
  calculatePersonalDifficulty(tracking) {
    if (tracking.totalAttempts < 2) {
      tracking.personalDifficulty = null;
      return;
    }

    const successRate = tracking.correctAttempts / tracking.totalAttempts;
    const avgTime = tracking.averageTimeSpent;

    // Fórmula de dificultad: 
    // - Menor tasa de éxito = más difícil
    // - Más tiempo = más difícil
    // Escala: 0-100 (0 = muy fácil, 100 = muy difícil)
    
    const timeScore = Math.min(avgTime / 60, 1) * 40; // Máx 40 puntos por tiempo (60s = difícil)
    const errorScore = (1 - successRate) * 60;        // Máx 60 puntos por errores
    
    tracking.personalDifficulty = Math.round(timeScore + errorScore);
  }

  /**
   * Calcula la próxima fecha de revisión usando repetición espaciada
   */
  calculateNextReviewDate(tracking) {
    const { status, consecutiveCorrect, lastAttemptDate } = tracking;

    if (status === QUESTION_STATUS.NEW || !lastAttemptDate) {
      tracking.nextReviewDate = null;
      return;
    }

    const lastAttempt = new Date(lastAttemptDate);
    let daysToAdd = 0;

    // Algoritmo de repetición espaciada (SM-2 simplificado)
    switch (status) {
      case QUESTION_STATUS.LEARNING:
        daysToAdd = 1; // Revisar mañana
        break;
      case QUESTION_STATUS.REVIEWING:
        daysToAdd = Math.min(3 * consecutiveCorrect, 14); // 3, 6, 9, 12, 14 días
        break;
      case QUESTION_STATUS.MASTERED:
        daysToAdd = MASTERY_CONFIG.REVIEW_INTERVAL_DAYS;
        break;
      case QUESTION_STATUS.RETIRED:
        daysToAdd = 30; // Revisar en 1 mes
        break;
      default:
        daysToAdd = 0;
    }

    const nextDate = new Date(lastAttempt);
    nextDate.setDate(nextDate.getDate() + daysToAdd);
    tracking.nextReviewDate = nextDate.toISOString();
  }

  /**
   * Guarda el tracking completo
   */
  saveAllTracking(tracking) {
    localStorage.setItem(this.storageKey, JSON.stringify(tracking));
  }

  /**
   * Guarda un intento en el historial global
   */
  saveToHistory(questionId, isCorrect, timeSpent, metadata) {
    const history = this.getHistory();
    history.push({
      questionId,
      correct: isCorrect,
      timeSpent,
      timestamp: new Date().toISOString(),
      ...metadata
    });

    // Mantener solo los últimos 1000 intentos
    if (history.length > 1000) {
      history.splice(0, history.length - 1000);
    }

    localStorage.setItem(this.historyKey, JSON.stringify(history));
  }

  /**
   * Obtiene el historial global de intentos
   */
  getHistory() {
    const stored = localStorage.getItem(this.historyKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtiene estadísticas generales del tracking
   * @deprecated Usar useCxCProgress().getQuestionTrackingStats() en su lugar
   */
  getOverallStats() {
    this._warnDeprecation('getOverallStats');
    const allTracking = this.getAllTracking();
    const trackingArray = Object.values(allTracking);

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
      // Contar por estado
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
          // Estado desconocido, contar como nuevo
          stats.new++;
          stats.newQuestions++;
      }

      // Acumular confianza
      totalConfidence += tracking.confidenceLevel;

      // Acumular intentos
      totalAttempts += tracking.totalAttempts;
      totalCorrect += tracking.correctAttempts;

      // Verificar si necesita revisión
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
  }

  /**
   * Resetea el tracking de una pregunta específica
   */
  resetQuestion(questionId) {
    const allTracking = this.getAllTracking();
    delete allTracking[questionId];
    this.saveAllTracking(allTracking);
  }

  /**
   * Obtiene estadísticas agrupadas por dominio
   */
  getStatsByDomain() {
    const allTracking = this.getAllTracking();
    const trackingArray = Object.values(allTracking);
    const domainStats = {};

    trackingArray.forEach(tracking => {
      const domain = tracking.domain || 'Sin categoría';
      
      if (!domainStats[domain]) {
        domainStats[domain] = {
          total: 0,
          new: 0,
          learning: 0,
          reviewing: 0,
          mastered: 0,
          retired: 0
        };
      }

      domainStats[domain].total++;
      
      switch (tracking.status) {
        case QUESTION_STATUS.NEW:
          domainStats[domain].new++;
          break;
        case QUESTION_STATUS.LEARNING:
          domainStats[domain].learning++;
          break;
        case QUESTION_STATUS.REVIEWING:
          domainStats[domain].reviewing++;
          break;
        case QUESTION_STATUS.MASTERED:
          domainStats[domain].mastered++;
          break;
        case QUESTION_STATUS.RETIRED:
          domainStats[domain].retired++;
          break;
        default:
          domainStats[domain].new++;
      }
    });

    return domainStats;
  }

  /**
   * Obtiene estadísticas agrupadas por nivel de dificultad
   */
  getStatsByLevel() {
    const allTracking = this.getAllTracking();
    const trackingArray = Object.values(allTracking);
    const levelStats = {
      principiante: { total: 0, new: 0, learning: 0, reviewing: 0, mastered: 0, retired: 0 },
      intermedio: { total: 0, new: 0, learning: 0, reviewing: 0, mastered: 0, retired: 0 },
      avanzado: { total: 0, new: 0, learning: 0, reviewing: 0, mastered: 0, retired: 0 }
    };

    trackingArray.forEach(tracking => {
      const level = tracking.level || 'intermedio';
      
      if (!levelStats[level]) {
        levelStats[level] = {
          total: 0,
          new: 0,
          learning: 0,
          reviewing: 0,
          mastered: 0,
          retired: 0
        };
      }

      levelStats[level].total++;
      
      switch (tracking.status) {
        case QUESTION_STATUS.NEW:
          levelStats[level].new++;
          break;
        case QUESTION_STATUS.LEARNING:
          levelStats[level].learning++;
          break;
        case QUESTION_STATUS.REVIEWING:
          levelStats[level].reviewing++;
          break;
        case QUESTION_STATUS.MASTERED:
          levelStats[level].mastered++;
          break;
        case QUESTION_STATUS.RETIRED:
          levelStats[level].retired++;
          break;
        default:
          levelStats[level].new++;
      }
    });

    return levelStats;
  }

  /**
   * Resetea todo el tracking
   */
  resetAll() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.historyKey);
  }
}

// ============================================================================
// 3. SELECTOR INTELIGENTE DE PREGUNTAS
// ============================================================================

export class QuestionSelector {
  constructor(questionTracker) {
    this.tracker = questionTracker;
  }

  /**
   * Selecciona preguntas para un quiz basado en el algoritmo inteligente
   */
  selectQuestions(availableQuestions, count, config = {}) {
    const {
      prioritizeWeak = true,      // Priorizar preguntas débiles
      includeNew = true,           // Incluir preguntas nuevas
      reviewDueQuestions = true,   // Incluir preguntas que necesitan revisión
      maxRetired = 0.1             // Máximo % de preguntas retiradas (10%)
    } = config;

    const allTracking = this.tracker.getAllTracking();
    const today = new Date();

    // Clasificar preguntas
    const classified = {
      dueForReview: [],
      weak: [],
      learning: [],
      reviewing: [],
      new: [],
      mastered: [],
      retired: []
    };

    availableQuestions.forEach(q => {
      const tracking = allTracking[q.id] || this.tracker.createNewTracking(q.id);
      const questionData = { ...q, tracking };

      // Verificar si necesita revisión
      if (tracking.nextReviewDate) {
        const reviewDate = new Date(tracking.nextReviewDate);
        if (reviewDate <= today) {
          classified.dueForReview.push(questionData);
          return;
        }
      }

      // Clasificar por estado
      switch (tracking.status) {
        case QUESTION_STATUS.NEW:
          classified.new.push(questionData);
          break;
        case QUESTION_STATUS.LEARNING:
          if (tracking.confidenceLevel <= CONFIDENCE_LEVELS.LOW) {
            classified.weak.push(questionData);
          } else {
            classified.learning.push(questionData);
          }
          break;
        case QUESTION_STATUS.REVIEWING:
          classified.reviewing.push(questionData);
          break;
        case QUESTION_STATUS.MASTERED:
          classified.mastered.push(questionData);
          break;
        case QUESTION_STATUS.RETIRED:
          classified.retired.push(questionData);
          break;
        default:
          // Estado desconocido, tratar como nueva
          classified.new.push(questionData);
      }
    });

    // Construir pool de preguntas con prioridades
    const selected = [];
    const maxRetiredCount = Math.floor(count * maxRetired);

    // 1. Preguntas que necesitan revisión (máxima prioridad)
    if (reviewDueQuestions && classified.dueForReview.length > 0) {
      const reviewCount = Math.min(classified.dueForReview.length, Math.ceil(count * 0.3));
      selected.push(...this.randomSample(classified.dueForReview, reviewCount));
    }

    // 2. Preguntas débiles (alta prioridad)
    if (prioritizeWeak && classified.weak.length > 0 && selected.length < count) {
      const weakCount = Math.min(classified.weak.length, Math.ceil(count * 0.3));
      selected.push(...this.randomSample(classified.weak, weakCount - selected.length));
    }

    // 3. Preguntas en aprendizaje
    if (classified.learning.length > 0 && selected.length < count) {
      const learningCount = Math.min(classified.learning.length, count - selected.length);
      selected.push(...this.randomSample(classified.learning, learningCount));
    }

    // 4. Preguntas nuevas
    if (includeNew && classified.new.length > 0 && selected.length < count) {
      const newCount = Math.min(classified.new.length, count - selected.length);
      selected.push(...this.randomSample(classified.new, newCount));
    }

    // 5. Preguntas en revisión
    if (classified.reviewing.length > 0 && selected.length < count) {
      const reviewingCount = Math.min(classified.reviewing.length, count - selected.length);
      selected.push(...this.randomSample(classified.reviewing, reviewingCount));
    }

    // 6. Preguntas dominadas
    if (classified.mastered.length > 0 && selected.length < count) {
      const masteredCount = Math.min(classified.mastered.length, count - selected.length);
      selected.push(...this.randomSample(classified.mastered, masteredCount));
    }

    // 7. Preguntas retiradas (solo si es necesario completar)
    if (classified.retired.length > 0 && selected.length < count) {
      const retiredCount = Math.min(
        classified.retired.length,
        Math.min(maxRetiredCount, count - selected.length)
      );
      selected.push(...this.randomSample(classified.retired, retiredCount));
    }

    // Mezclar aleatoriamente
    return this.shuffle(selected.map(q => ({ ...q, tracking: undefined }))).slice(0, count);
  }

  /**
   * Muestra aleatoria de un array
   */
  randomSample(array, count) {
    const shuffled = this.shuffle([...array]);
    return shuffled.slice(0, Math.min(count, array.length));
  }

  /**
   * Mezcla aleatoriamente un array (Fisher-Yates)
   */
  shuffle(array) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  /**
   * Obtiene recomendaciones de estudio personalizadas
   */
  getStudyRecommendations() {
    const stats = this.tracker.getOverallStats();
    const recommendations = [];

    // Preguntas débiles
    if (stats.learningQuestions > 10) {
      recommendations.push({
        priority: 'high',
        type: 'weak_questions',
        message: `Tienes ${stats.learningQuestions} preguntas en aprendizaje. Enfócate en estas primero.`,
        suggestedAction: 'Practicar preguntas débiles'
      });
    }

    // Revisiones pendientes
    if (stats.questionsNeedingReview > 5) {
      recommendations.push({
        priority: 'medium',
        type: 'review_needed',
        message: `${stats.questionsNeedingReview} preguntas necesitan revisión según el calendario de repetición espaciada.`,
        suggestedAction: 'Hacer sesión de repaso'
      });
    }

    // Pocas preguntas dominadas
    if (stats.totalQuestions > 20 && stats.masteredQuestions < stats.totalQuestions * 0.3) {
      recommendations.push({
        priority: 'low',
        type: 'mastery',
        message: 'Solo has dominado el ' + 
          ((stats.masteredQuestions / stats.totalQuestions) * 100).toFixed(0) + 
          '% de las preguntas. Continúa practicando.',
        suggestedAction: 'Aumentar sesiones de práctica'
      });
    }

    // Baja confianza general
    if (stats.averageConfidence < 2.5 && stats.totalQuestions > 10) {
      recommendations.push({
        priority: 'medium',
        type: 'confidence',
        message: 'Tu nivel de confianza promedio es bajo. Revisa los conceptos fundamentales.',
        suggestedAction: 'Estudiar guía de conceptos'
      });
    }

    return recommendations;
  }
}

// ============================================================================
// 4. EXPORTAR INSTANCIA SINGLETON
// ============================================================================

export const questionTracker = new QuestionTracker();
export const questionSelector = new QuestionSelector(questionTracker);

export default questionTracker;
