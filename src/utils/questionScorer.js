/**
 * 🎯 SISTEMA DE CALIFICACIÓN INDIVIDUAL DE PREGUNTAS
 * 
 * Sistema que califica cada pregunta individualmente y actualiza
 * el perfil del usuario en tiempo real
 * 
 * ✅ REFACTORIZADO: Ahora usa inyección de dependencias
 * En lugar de importar directamente progressManager y questionTracker,
 * recibe las funciones del contexto como parámetros en el constructor.
 * 
 * Uso:
 * ```js
 * const { recordQuestionAttempt, getQuestionTracking, addPoints, addXP, ... } = useCxCProgress();
 * const scorer = new QuestionScorer({
 *   recordQuestionAttempt,
 *   getQuestionTracking,
 *   addPoints,
 *   addXP,
 *   updateDomainStats,
 *   updateLevelStats
 * });
 * ```
 */

// ============================================================================
// 1. CONFIGURACIÓN DE PUNTUACIÓN
// ============================================================================

// Sistema balanceado para 100 preguntas totales
// Meta: 100 preguntas perfectas = ~5,000 puntos = Nivel 10 (Divinidad)
export const SCORING_CONFIG = {
  // Puntos base por pregunta (ajustados para balance)
  BASE_POINTS: {
    principiante: 15,  // 22 preguntas × 15 = 330 puntos base
    intermedio: 25,    // 25 preguntas × 25 = 625 puntos base
    avanzado: 40       // 53 preguntas × 40 = 2,120 puntos base
    // Total base: 3,075 puntos (sin bonos)
    // Con bonos realistas: ~5,000 puntos máximos
  },

  // Multiplicadores por velocidad de respuesta (reducidos)
  SPEED_MULTIPLIERS: {
    VERY_FAST: 1.3,      // < 15 segundos (reducido de 1.5)
    FAST: 1.2,           // 15-30 segundos (reducido de 1.3)
    NORMAL: 1.0,         // 30-60 segundos
    SLOW: 0.9,           // 60-120 segundos (ajustado de 0.8)
    VERY_SLOW: 0.8       // > 120 segundos (ajustado de 0.6)
  },

  // Bonus por racha de correctas (reducidos)
  STREAK_BONUS: {
    3: 5,      // 3 correctas seguidas (reducido de 10)
    5: 15,     // 5 correctas seguidas (reducido de 25)
    10: 30,    // 10 correctas seguidas (reducido de 50)
    15: 60,    // 15 correctas seguidas (reducido de 100)
    20: 100    // 20 correctas seguidas (reducido de 200)
  },

  // Bonus por primera vez correcta (reducido)
  FIRST_TRY_BONUS: 10,  // reducido de 20

  // Bonus por dominar pregunta (reducido)
  MASTERY_BONUS: 25,    // reducido de 50

  // Penalización por respuesta incorrecta (no resta, pero no suma)
  INCORRECT_POINTS: 0,

  // Bonus por mejorar pregunta débil (reducido)
  IMPROVEMENT_BONUS: 15,  // reducido de 30

  // XP base por pregunta (separado de puntos, sin cambios)
  BASE_XP: {
    principiante: 5,
    intermedio: 8,
    avanzado: 12
  }
};

// ============================================================================
// 2. CLASE PRINCIPAL: QuestionScorer
// ============================================================================

export class QuestionScorer {
  /**
   * Constructor con inyección de dependencias
   * @param {Object} contextFunctions - Funciones del CxCProgressContext
   * @param {Function} contextFunctions.recordQuestionAttempt
   * @param {Function} contextFunctions.getQuestionTracking
   * @param {Function} contextFunctions.addPoints
   * @param {Function} contextFunctions.addXP
   * @param {Function} contextFunctions.updateDomainStats
   * @param {Function} contextFunctions.updateLevelStats
   */
  constructor(contextFunctions = {}) {
    // Guardar funciones del contexto
    this.recordQuestionAttempt = contextFunctions.recordQuestionAttempt || (() => {});
    this.getQuestionTracking = contextFunctions.getQuestionTracking || (() => ({ totalAttempts: 0, confidenceLevel: 0 }));
    this.addPoints = contextFunctions.addPoints || (() => {});
    this.addXP = contextFunctions.addXP || (() => {});
    this.updateDomainStats = contextFunctions.updateDomainStats || (() => {});
    this.updateLevelStats = contextFunctions.updateLevelStats || (() => {});
    
    // Estado de sesión
    this.currentStreak = 0;
    this.sessionStats = {
      questionsAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalPoints: 0,
      totalXP: 0,
      averageTime: 0,
      bonusesEarned: []
    };
  }

  /**
   * Califica una pregunta individual
   */
  scoreQuestion(question, userAnswer, timeSpent) {
    const questionId = question.id;
    const correctAnswerIndex = question.respuestaCorrecta;
    const isCorrect = userAnswer === correctAnswerIndex;
    const difficulty = question.nivel || 'intermedio';

    // Obtener tracking previo
    const previousTracking = this.getQuestionTracking(questionId);
    const isFirstAttempt = previousTracking.totalAttempts === 0;
    const wasWeak = previousTracking.confidenceLevel <= 1; // VERY_LOW o NONE

    // Registrar intento en el tracker
    const updatedTracking = this.recordQuestionAttempt(
      questionId,
      isCorrect,
      timeSpent,
      {
        domain: question.dominio,
        subDomain: question.subdominio,
        level: difficulty,
        userAnswer: userAnswer,
        correctAnswer: correctAnswerIndex
      }
    );

    // Calcular puntuación
    const scoreResult = this.calculateScore({
      isCorrect,
      difficulty,
      timeSpent,
      isFirstAttempt,
      wasWeak,
      previousTracking,
      updatedTracking,
      question
    });

    // Actualizar racha de sesión
    if (isCorrect) {
      this.currentStreak++;
    } else {
      this.currentStreak = 0;
    }

    // Actualizar estadísticas de sesión
    this.updateSessionStats(scoreResult);

    // Actualizar perfil del usuario
    this.updateUserProfile(scoreResult, question, timeSpent);

    // Retornar resultado completo
    return {
      ...scoreResult,
      questionId,
      tracking: updatedTracking,
      sessionStreak: this.currentStreak,
      sessionStats: { ...this.sessionStats }
    };
  }

  /**
   * Calcula la puntuación detallada de una respuesta
   */
  calculateScore(context) {
    const {
      isCorrect,
      difficulty,
      timeSpent,
      isFirstAttempt,
      wasWeak,
      previousTracking,
      updatedTracking
    } = context;

    const result = {
      isCorrect,
      basePoints: 0,
      speedMultiplier: 1.0,
      speedBonus: 0,
      streakBonus: 0,
      firstTryBonus: 0,
      masteryBonus: 0,
      improvementBonus: 0,
      totalPoints: 0,
      xpEarned: 0,
      bonuses: [],
      penalties: [],
      feedback: ''
    };

    // Si es incorrecta, no hay puntos
    if (!isCorrect) {
      result.totalPoints = SCORING_CONFIG.INCORRECT_POINTS;
      result.xpEarned = 0;
      result.feedback = this.generateFeedback(result, updatedTracking);
      return result;
    }

    // ===== PUNTOS BASE =====
    result.basePoints = SCORING_CONFIG.BASE_POINTS[difficulty] || SCORING_CONFIG.BASE_POINTS.intermedio;

    // ===== MULTIPLICADOR DE VELOCIDAD =====
    result.speedMultiplier = this.calculateSpeedMultiplier(timeSpent);
    
    if (result.speedMultiplier > 1.0) {
      const bonus = Math.round(result.basePoints * (result.speedMultiplier - 1));
      result.speedBonus = bonus;
      result.bonuses.push({
        type: 'speed',
        amount: bonus,
        description: `Respuesta rápida (${timeSpent}s)`
      });
    }

    // ===== BONUS POR RACHA =====
    const streakBonus = this.calculateStreakBonus(this.currentStreak + 1);
    if (streakBonus > 0) {
      result.streakBonus = streakBonus;
      result.bonuses.push({
        type: 'streak',
        amount: streakBonus,
        description: `Racha de ${this.currentStreak + 1} correctas`
      });
    }

    // ===== BONUS POR PRIMERA VEZ CORRECTA =====
    if (isFirstAttempt) {
      result.firstTryBonus = SCORING_CONFIG.FIRST_TRY_BONUS;
      result.bonuses.push({
        type: 'first_try',
        amount: SCORING_CONFIG.FIRST_TRY_BONUS,
        description: 'Primera vez correcta'
      });
    }

    // ===== BONUS POR DOMINAR PREGUNTA =====
    if (updatedTracking.status === 'mastered' && previousTracking.status !== 'mastered') {
      result.masteryBonus = SCORING_CONFIG.MASTERY_BONUS;
      result.bonuses.push({
        type: 'mastery',
        amount: SCORING_CONFIG.MASTERY_BONUS,
        description: '¡Pregunta dominada!'
      });
    }

    // ===== BONUS POR MEJORAR PREGUNTA DÉBIL =====
    if (wasWeak && updatedTracking.confidenceLevel > 1) {
      result.improvementBonus = SCORING_CONFIG.IMPROVEMENT_BONUS;
      result.bonuses.push({
        type: 'improvement',
        amount: SCORING_CONFIG.IMPROVEMENT_BONUS,
        description: 'Mejoraste una pregunta débil'
      });
    }

    // ===== CALCULAR TOTAL =====
    result.totalPoints = Math.round(
      (result.basePoints * result.speedMultiplier) +
      result.streakBonus +
      result.firstTryBonus +
      result.masteryBonus +
      result.improvementBonus
    );

    // ===== CALCULAR XP =====
    result.xpEarned = this.calculateXP(difficulty, result.totalPoints);

    // ===== GENERAR FEEDBACK =====
    result.feedback = this.generateFeedback(result, updatedTracking);

    return result;
  }

  /**
   * Calcula el multiplicador de velocidad
   */
  calculateSpeedMultiplier(timeSpent) {
    if (timeSpent < 15) return SCORING_CONFIG.SPEED_MULTIPLIERS.VERY_FAST;
    if (timeSpent < 30) return SCORING_CONFIG.SPEED_MULTIPLIERS.FAST;
    if (timeSpent < 60) return SCORING_CONFIG.SPEED_MULTIPLIERS.NORMAL;
    if (timeSpent < 120) return SCORING_CONFIG.SPEED_MULTIPLIERS.SLOW;
    return SCORING_CONFIG.SPEED_MULTIPLIERS.VERY_SLOW;
  }

  /**
   * Calcula el bonus por racha
   */
  calculateStreakBonus(streak) {
    const bonusKeys = Object.keys(SCORING_CONFIG.STREAK_BONUS)
      .map(Number)
      .sort((a, b) => b - a); // Descendente

    for (const threshold of bonusKeys) {
      if (streak >= threshold) {
        return SCORING_CONFIG.STREAK_BONUS[threshold];
      }
    }
    return 0;
  }

  /**
   * Calcula XP basado en dificultad y puntos
   */
  calculateXP(difficulty, points) {
    const baseXP = SCORING_CONFIG.BASE_XP[difficulty] || SCORING_CONFIG.BASE_XP.intermedio;
    const bonusXP = Math.floor(points / 10); // 1 XP extra por cada 10 puntos
    return baseXP + bonusXP;
  }

  /**
   * Genera feedback personalizado
   */
  generateFeedback(scoreResult, tracking) {
    if (!scoreResult.isCorrect) {
      const attempts = tracking.totalAttempts;
      if (attempts === 1) {
        return '❌ Incorrecto en el primer intento. Revisa el concepto y vuelve a intentarlo.';
      } else if (attempts <= 3) {
        return `❌ Incorrecto (intento ${attempts}). Tómate más tiempo para analizar la pregunta.`;
      } else {
        return `❌ Esta pregunta te está costando trabajo. Considera estudiar este tema más a fondo.`;
      }
    }

    // Feedback positivo basado en rendimiento
    const messages = ['✅ ¡Correcto!'];

    if (scoreResult.firstTryBonus > 0) {
      messages.push('🎯 Primera vez correcta - ¡Excelente!');
    }

    if (scoreResult.masteryBonus > 0) {
      messages.push('👑 ¡Has dominado esta pregunta!');
    }

    if (scoreResult.improvementBonus > 0) {
      messages.push('📈 ¡Gran mejora! Sigue así.');
    }

    if (scoreResult.speedBonus > 0) {
      messages.push('⚡ Respuesta rápida');
    }

    if (scoreResult.streakBonus > 0) {
      messages.push(`🔥 ¡Racha de ${this.currentStreak + 1}!`);
    }

    // Agregar mensaje sobre estado
    if (tracking.status === 'mastered') {
      messages.push('💎 Estado: Dominada');
    } else if (tracking.status === 'reviewing') {
      messages.push('📚 Estado: En revisión');
    } else if (tracking.consecutiveCorrect >= 2) {
      messages.push(`✨ ${tracking.consecutiveCorrect} correctas consecutivas`);
    }

    return messages.join(' | ');
  }

  /**
   * Actualiza las estadísticas de la sesión actual
   */
  updateSessionStats(scoreResult) {
    this.sessionStats.questionsAnswered++;
    
    if (scoreResult.isCorrect) {
      this.sessionStats.correctAnswers++;
    } else {
      this.sessionStats.incorrectAnswers++;
    }

    this.sessionStats.totalPoints += scoreResult.totalPoints;
    this.sessionStats.totalXP += scoreResult.xpEarned;

    // Agregar bonuses únicos
    scoreResult.bonuses.forEach(bonus => {
      const existingBonus = this.sessionStats.bonusesEarned.find(b => b.type === bonus.type);
      if (existingBonus) {
        existingBonus.count++;
        existingBonus.totalAmount += bonus.amount;
      } else {
        this.sessionStats.bonusesEarned.push({
          type: bonus.type,
          count: 1,
          totalAmount: bonus.amount,
          description: bonus.description
        });
      }
    });
  }

  /**
   * Actualiza el perfil del usuario con los puntos y XP
   */
  updateUserProfile(scoreResult, question, timeSpent) {
    // Actualizar puntos totales
    this.addPoints(scoreResult.totalPoints);

    // Actualizar XP
    this.addXP(scoreResult.xpEarned);

    // Actualizar estadísticas por dominio
    const domain = question.dominio || 'general';
    this.updateDomainStats(domain, {
      attempted: 1,
      correct: scoreResult.isCorrect ? 1 : 0,
      timeSpent: timeSpent
    });

    // Actualizar estadísticas por nivel
    const level = question.nivel || 'intermedio';
    this.updateLevelStats(level, {
      attempted: 1,
      correct: scoreResult.isCorrect ? 1 : 0
    });
  }

  /**
   * Obtiene el resumen de la sesión actual
   */
  getSessionSummary() {
    const accuracy = this.sessionStats.questionsAnswered > 0
      ? (this.sessionStats.correctAnswers / this.sessionStats.questionsAnswered) * 100
      : 0;

    return {
      ...this.sessionStats,
      accuracy: Math.round(accuracy * 10) / 10,
      currentStreak: this.currentStreak,
      averagePointsPerQuestion: this.sessionStats.questionsAnswered > 0
        ? Math.round(this.sessionStats.totalPoints / this.sessionStats.questionsAnswered)
        : 0
    };
  }

  /**
   * Resetea las estadísticas de la sesión
   */
  resetSession() {
    this.currentStreak = 0;
    this.sessionStats = {
      questionsAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      totalPoints: 0,
      totalXP: 0,
      averageTime: 0,
      bonusesEarned: []
    };
  }
}

// ============================================================================
// 3. HELPER PARA CREAR INSTANCIA CON CONTEXTO
// ============================================================================

/**
 * Crea una nueva instancia de QuestionScorer con las funciones del contexto
 * 
 * @param {Object} contextFunctions - Funciones extraídas del useCxCProgress hook
 * @returns {QuestionScorer} - Nueva instancia configurada
 * 
 * @example
 * const { recordQuestionAttempt, getQuestionTracking, addPoints, addXP, updateDomainStats, updateLevelStats } = useCxCProgress();
 * const scorer = createQuestionScorer({ recordQuestionAttempt, getQuestionTracking, addPoints, addXP, updateDomainStats, updateLevelStats });
 */
export function createQuestionScorer(contextFunctions) {
  return new QuestionScorer(contextFunctions);
}

// ============================================================================
// 4. EXPORTAR CLASE (NO INSTANCIA - requiere contexto)
// ============================================================================

export default QuestionScorer;
