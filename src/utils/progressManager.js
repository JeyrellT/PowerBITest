/**
 * ⚠️ ADVERTENCIA: ESTE ARCHIVO ESTÁ DEPRECATED ⚠️
 * 
 * Este archivo ha sido marcado como obsoleto y será removido en futuras versiones.
 * 
 * ❌ NO USAR: progressManager
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
 * import { progressManager } from '../utils/progressManager';
 * progressManager.addPoints(100);
 * 
 * // ✅ Ahora (recomendado)
 * import { useCxCProgress } from '../contexts/CxCProgressContext';
 * const { addPoints } = useCxCProgress();
 * addPoints(100);
 * ```
 * 
 * @deprecated Usar useCxCProgress en su lugar
 * @see CxCProgressContext
 */

// Sistema de gestión de progreso y puntuaciones

export const ACHIEVEMENT_TYPES = {
  FIRST_QUIZ: { id: 'first_quiz', name: 'Primer Paso', icon: '🎯', points: 50 },
  PERFECT_QUIZ: { id: 'perfect_quiz', name: 'Perfecto', icon: '💯', points: 200 },
  STREAK_5: { id: 'streak_5', name: 'Racha de 5', icon: '🔥', points: 100 },
  STREAK_10: { id: 'streak_10', name: 'Racha de 10', icon: '⚡', points: 250 },
  MASTER_DOMAIN: { id: 'master_domain', name: 'Maestro del Dominio', icon: '👑', points: 300 },
  SPEED_DEMON: { id: 'speed_demon', name: 'Velocista', icon: '🚀', points: 150 },
  HUNDRED_QUESTIONS: { id: '100_questions', name: '100 Preguntas', icon: '🎓', points: 500 },
  WEEK_WARRIOR: { id: 'week_warrior', name: 'Guerrero Semanal', icon: '⭐', points: 200 }
};

export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Novato', points: 0, icon: '🌱' },
  { level: 2, name: 'Aprendiz', points: 500, icon: '📚' },
  { level: 3, name: 'Estudiante', points: 1000, icon: '🎓' },
  { level: 4, name: 'Competente', points: 2000, icon: '💼' },
  { level: 5, name: 'Profesional', points: 3500, icon: '⭐' },
  { level: 6, name: 'Experto', points: 5500, icon: '🏆' },
  { level: 7, name: 'Maestro', points: 8000, icon: '👑' },
  { level: 8, name: 'Gran Maestro', points: 12000, icon: '💎' },
  { level: 9, name: 'Leyenda', points: 18000, icon: '🌟' },
  { level: 10, name: 'Divinidad', points: 25000, icon: '✨' }
];

class ProgressManager {
  constructor() {
    this.storageKey = 'pl300_progress';
    this.questionsKey = 'pl300_answered_questions';
    this.dailyStreakKey = 'pl300_daily_streak';
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
        `\n\nEstás usando progressManager.${methodName}() que está DEPRECATED.`,
        `\n\n✅ MIGRA A: useCxCProgress() de CxCProgressContext`,
        `\n\nEjemplo:`,
        `\n  import { useCxCProgress } from '../contexts/CxCProgressContext';`,
        `\n  const { ${methodName} } = useCxCProgress();`,
        `\n  ${methodName}(...);`,
        `\n\nEste archivo será removido en futuras versiones.`,
        `\n`
      );
      this._deprecationWarned = true;
    }
  }

  /**
   * @deprecated Usar useCxCProgress().getStats() en su lugar
   */
  /**
   * @deprecated Usar useCxCProgress().getStats() en su lugar
   */
  getProgress() {
    this._warnDeprecation('getProgress');
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      return this.createInitialProgress();
    }
    return JSON.parse(stored);
  }

  /**
   * @deprecated Usar useCxCProgress().addPoints() en su lugar
   */
  addPoints(points) {
    this._warnDeprecation('addPoints');
    const progress = this.getProgress();
    progress.totalPoints += points;
    this.saveProgress(progress);
    return progress.totalPoints;
  }

  /**
   * @deprecated Usar useCxCProgress().addXP() en su lugar
   */
  addXP(xp) {
    this._warnDeprecation('addXP');
    const progress = this.getProgress();
    if (!progress.totalXP) progress.totalXP = 0;
    progress.totalXP += xp;
    this.saveProgress(progress);
    return progress.totalXP;
  }

  /**
   * @deprecated Usar useCxCProgress().updateDomainStats() en su lugar
   */
  updateDomainStats(domain, stats) {
    this._warnDeprecation('updateDomainStats');
    const progress = this.getProgress();
    if (!progress.domainStats) progress.domainStats = {};
    if (!progress.domainStats[domain]) {
      progress.domainStats[domain] = {
        attempted: 0,
        correct: 0,
        timeSpent: 0
      };
    }
    
    progress.domainStats[domain].attempted += stats.attempted || 0;
    progress.domainStats[domain].correct += stats.correct || 0;
    progress.domainStats[domain].timeSpent += stats.timeSpent || 0;
    
    this.saveProgress(progress);
  }

  /**
   * @deprecated Usar useCxCProgress().updateLevelStats() en su lugar
   */
  updateLevelStats(level, stats) {
    this._warnDeprecation('updateLevelStats');
    const progress = this.getProgress();
    if (!progress.levelStats) progress.levelStats = {};
    if (!progress.levelStats[level]) {
      progress.levelStats[level] = {
        attempted: 0,
        correct: 0
      };
    }
    
    progress.levelStats[level].attempted += stats.attempted || 0;
    progress.levelStats[level].correct += stats.correct || 0;
    
    this.saveProgress(progress);
  }

  // Crear progreso inicial
  createInitialProgress() {
    const progress = {
      totalPoints: 0,
      currentLevel: 1,
      quizzesTaken: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      totalTimeSpent: 0,
      achievements: [],
      domainStats: {
        'preparar-datos': { correct: 0, total: 0, avgTime: 0 },
        'modelar-datos': { correct: 0, total: 0, avgTime: 0 },
        'visualizar-analizar': { correct: 0, total: 0, avgTime: 0 },
        'administrar-asegurar': { correct: 0, total: 0, avgTime: 0 }
      },
      streakDays: 0,
      lastQuizDate: null,
      bestScore: 0,
      fastestQuiz: null,
      history: []
    };
    this.saveProgress(progress);
    return progress;
  }

  /**
   * @deprecated Usar useCxCProgress en su lugar
   */
  saveProgress(progress) {
    this._warnDeprecation('saveProgress');
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  }

  /**
   * @deprecated Usar useCxCProgress().getAnsweredQuestions() en su lugar
   */
  getAnsweredQuestions() {
    this._warnDeprecation('getAnsweredQuestions');
    const stored = localStorage.getItem(this.questionsKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * @deprecated Usar useCxCProgress().saveAnsweredQuestion() en su lugar
   */
  saveAnsweredQuestion(questionId) {
    this._warnDeprecation('saveAnsweredQuestion');
    const answered = this.getAnsweredQuestions();
    if (!answered.includes(questionId)) {
      answered.push(questionId);
      localStorage.setItem(this.questionsKey, JSON.stringify(answered));
    }
  }

  /**
   * @deprecated Usar useCxCProgress en su lugar
   */
  saveAnsweredQuestions(questionIds) {
    this._warnDeprecation('saveAnsweredQuestions');
    questionIds.forEach(id => this.saveAnsweredQuestion(id));
  }

  /**
   * @deprecated Usar useCxCProgress().isQuestionAnswered() en su lugar
   */
  isQuestionAnswered(questionId) {
    this._warnDeprecation('isQuestionAnswered');
    return this.getAnsweredQuestions().includes(questionId);
  }

  /**
   * @deprecated Usar useCxCProgress en su lugar
   */
  clearAnsweredQuestions() {
    this._warnDeprecation('clearAnsweredQuestions');
    localStorage.removeItem(this.questionsKey);
  }

  /**
   * @deprecated Usar useCxCProgress().updateProgressAfterQuiz() en su lugar
   */
  updateProgressAfterQuiz(quizResults) {
    this._warnDeprecation('updateProgressAfterQuiz');
    const progress = this.getProgress();
    const newAchievements = [];
    const totalQuestions = Math.max(0, Number(quizResults?.totalQuestions) || 0);
    const correctAnswers = Math.max(0, Number(quizResults?.correctAnswers) || 0);
    const totalTime = Math.max(0, Number(quizResults?.totalTime) || 0);

    // Actualizar estadísticas básicas
    progress.quizzesTaken += 1;
    progress.questionsAnswered += totalQuestions;
    progress.correctAnswers += correctAnswers;
    progress.totalTimeSpent += totalTime;

    // Calcular puntos base del quiz
    const scorePercentage = totalQuestions > 0
      ? (correctAnswers / totalQuestions) * 100
      : 0;
    let quizPoints = Math.round(correctAnswers * 10); // 10 puntos por respuesta correcta

    // Bonus por porcentaje
    if (scorePercentage === 100) {
      quizPoints += 100; // Bonus por perfecto
      if (!progress.achievements.includes(ACHIEVEMENT_TYPES.PERFECT_QUIZ.id)) {
        newAchievements.push(ACHIEVEMENT_TYPES.PERFECT_QUIZ);
      }
    } else if (scorePercentage >= 90) {
      quizPoints += 50;
    } else if (scorePercentage >= 80) {
      quizPoints += 25;
    }

    // Bonus por velocidad (menos de 30 segundos por pregunta en promedio)
    const avgTimePerQuestion = totalQuestions > 0
      ? totalTime / totalQuestions
      : Infinity;
    if (avgTimePerQuestion < 30 && scorePercentage >= 80) {
      quizPoints += 50;
      if (!progress.achievements.includes(ACHIEVEMENT_TYPES.SPEED_DEMON.id)) {
        newAchievements.push(ACHIEVEMENT_TYPES.SPEED_DEMON);
      }
    }

    progress.totalPoints += quizPoints;

    // Actualizar mejor puntaje
    if (scorePercentage > progress.bestScore) {
      progress.bestScore = scorePercentage;
    }

    // Actualizar quiz más rápido
    if (!progress.fastestQuiz || totalTime < progress.fastestQuiz) {
      progress.fastestQuiz = totalTime;
    }

    // Actualizar racha diaria
    const today = new Date().toDateString();
    const lastQuizDate = progress.lastQuizDate ? new Date(progress.lastQuizDate).toDateString() : null;
    
    if (lastQuizDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (lastQuizDate === yesterday) {
        progress.streakDays += 1;
      } else if (!lastQuizDate) {
        progress.streakDays = 1;
      } else {
        progress.streakDays = 1;
      }
      progress.lastQuizDate = new Date().toISOString();
    }

    // Verificar logros de racha
    if (progress.streakDays >= 5 && !progress.achievements.includes(ACHIEVEMENT_TYPES.STREAK_5.id)) {
      newAchievements.push(ACHIEVEMENT_TYPES.STREAK_5);
    }
    if (progress.streakDays >= 10 && !progress.achievements.includes(ACHIEVEMENT_TYPES.STREAK_10.id)) {
      newAchievements.push(ACHIEVEMENT_TYPES.STREAK_10);
    }

    // Verificar logro de primera quiz
    if (progress.quizzesTaken === 1) {
      newAchievements.push(ACHIEVEMENT_TYPES.FIRST_QUIZ);
    }

    // Verificar logro de 100 preguntas
    if (progress.questionsAnswered >= 100 && !progress.achievements.includes(ACHIEVEMENT_TYPES.HUNDRED_QUESTIONS.id)) {
      newAchievements.push(ACHIEVEMENT_TYPES.HUNDRED_QUESTIONS);
    }

    // Actualizar estadísticas por dominio
    if (quizResults.questionDetails) {
      quizResults.questionDetails.forEach(q => {
        if (q.domain && progress.domainStats[q.domain]) {
          progress.domainStats[q.domain].total += 1;
          if (q.correct) {
            progress.domainStats[q.domain].correct += 1;
          }
          if (q.timeSpent) {
            const currentAvg = progress.domainStats[q.domain].avgTime;
            const total = progress.domainStats[q.domain].total;
            progress.domainStats[q.domain].avgTime = 
              (currentAvg * (total - 1) + q.timeSpent) / total;
          }
        }
      });

      // Verificar maestría en dominio (90%+ de precisión con 20+ preguntas)
      Object.keys(progress.domainStats).forEach(domain => {
        const stats = progress.domainStats[domain];
        if (stats.total >= 20) {
          const accuracy = (stats.correct / stats.total) * 100;
          if (accuracy >= 90 && !progress.achievements.includes(`master_${domain}`)) {
            newAchievements.push({
              ...ACHIEVEMENT_TYPES.MASTER_DOMAIN,
              id: `master_${domain}`,
              name: `Maestro: ${domain}`
            });
          }
        }
      });
    }

    // Agregar nuevos logros
    newAchievements.forEach(achievement => {
      if (!progress.achievements.includes(achievement.id)) {
        progress.achievements.push(achievement.id);
        progress.totalPoints += achievement.points;
      }
    });

    // Actualizar nivel basado en puntos
    const newLevel = this.calculateLevel(progress.totalPoints);
    progress.currentLevel = newLevel.level;

    // Agregar a historial
    progress.history.unshift({
      date: new Date().toISOString(),
      score: scorePercentage,
      points: quizPoints,
      questions: totalQuestions,
      domain: quizResults.domain || 'all',
      newAchievements: newAchievements.map(a => a.id)
    });

    // Mantener solo últimos 50 registros
    if (progress.history.length > 50) {
      progress.history = progress.history.slice(0, 50);
    }

    // Guardar preguntas respondidas
    if (Array.isArray(quizResults.questionDetails)) {
      const questionIds = quizResults.questionDetails
        .map(q => q?.id)
        .filter(Boolean);
      this.saveAnsweredQuestions(questionIds);
    }

    this.saveProgress(progress);

    return {
      progress,
      newAchievements,
      pointsEarned: quizPoints,
      levelUp: newLevel.level > (progress.currentLevel - 1)
    };
  }

  /**
   * @deprecated Usar useCxCProgress en su lugar
   */
  calculateLevel(points) {
    this._warnDeprecation('calculateLevel');
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
  }

  /**
   * @deprecated Usar useCxCProgress en su lugar
   */
  getCurrentLevelInfo() {
    this._warnDeprecation('getCurrentLevelInfo');
    const progress = this.getProgress();
    return this.calculateLevel(progress.totalPoints);
  }

  /**
   * @deprecated Usar useCxCProgress().resetProgress() en su lugar
   */
  resetProgress() {
    this._warnDeprecation('resetProgress');
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.questionsKey);
    localStorage.removeItem(this.dailyStreakKey);
    return this.createInitialProgress();
  }

  /**
   * @deprecated Usar useCxCProgress().getStats() en su lugar
   */
  getStats() {
    this._warnDeprecation('getStats');
    const progress = this.getProgress();
    const levelInfo = this.calculateLevel(progress.totalPoints);
    const accuracy = progress.questionsAnswered > 0
      ? (progress.correctAnswers / progress.questionsAnswered) * 100
      : 0;

    return {
      ...progress,
      levelInfo,
      accuracy,
      avgTimePerQuestion: progress.questionsAnswered > 0
        ? progress.totalTimeSpent / progress.questionsAnswered
        : 0
    };
  }
}

export const progressManager = new ProgressManager();
export default progressManager;
