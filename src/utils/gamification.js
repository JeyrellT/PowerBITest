// Sistema de Gamificación Avanzado
// Inspirado en Codewars, CodinGame y TopCoder

// ============================================================================
// 1. SISTEMA DE RANGOS ESTILO ARTES MARCIALES
// ============================================================================

export const RANK_SYSTEM = {
  // Kyu (principiante a intermedio) - orden inverso
  '8kyu': { name: '8 Kyu', minXP: 0, color: '#8B4513', icon: '🥋' },
  '7kyu': { name: '7 Kyu', minXP: 500, color: '#CD853F', icon: '🥋' },
  '6kyu': { name: '6 Kyu', minXP: 1200, color: '#DAA520', icon: '🥋' },
  '5kyu': { name: '5 Kyu', minXP: 2000, color: '#FFD700', icon: '🥈' },
  '4kyu': { name: '4 Kyu', minXP: 3000, color: '#87CEEB', icon: '🥈' },
  '3kyu': { name: '3 Kyu', minXP: 4500, color: '#4169E1', icon: '🥈' },
  '2kyu': { name: '2 Kyu', minXP: 6500, color: '#8A2BE2', icon: '🥇' },
  '1kyu': { name: '1 Kyu', minXP: 9000, color: '#9400D3', icon: '🥇' },
  
  // Dan (maestro) - orden normal
  '1dan': { name: '1 Dan', minXP: 12000, color: '#1a1a1a', icon: '⚫' },
  '2dan': { name: '2 Dan', minXP: 16000, color: '#0d0d0d', icon: '⚫⚫' },
  '3dan': { name: '3 Dan', minXP: 21000, color: '#000000', icon: '⚫⚫⚫' },
  '4dan': { name: '4 Dan', minXP: 27000, color: '#FFD700', icon: '🏆' },
  '5dan': { name: '5 Dan', minXP: 35000, color: '#FF6347', icon: '🏆🏆' },
  '6dan': { name: '6 Dan', minXP: 45000, color: '#DC143C', icon: '🏆🏆🏆' },
  '7dan': { name: '7 Dan', minXP: 60000, color: '#8B0000', icon: '👑' },
  '8dan': { name: '8 Dan - Maestro', minXP: 80000, color: '#4B0082', icon: '👑👑' }
};

// ============================================================================
// 2. SISTEMA DE BADGES Y LOGROS
// ============================================================================

export const ACHIEVEMENTS = {
  // Logros de progreso
  firstSteps: {
    id: 'first-steps',
    name: 'Primeros Pasos',
    description: 'Completa tu primer quiz',
    icon: '👣',
    condition: (stats) => stats.quizzesCompleted >= 1,
    xpReward: 50
  },
  
  dedicated: {
    id: 'dedicated',
    name: 'Dedicado',
    description: 'Completa 10 quizzes',
    icon: '💪',
    condition: (stats) => stats.quizzesCompleted >= 10,
    xpReward: 200
  },
  
  marathoner: {
    id: 'marathoner',
    name: 'Maratonista',
    description: 'Completa 50 quizzes',
    icon: '🏃',
    condition: (stats) => stats.quizzesCompleted >= 50,
    xpReward: 1000
  },
  
  // Logros de precisión
  perfectScore: {
    id: 'perfect-score',
    name: 'Puntuación Perfecta',
    description: 'Obtén 100% en un quiz',
    icon: '💯',
    condition: (stats) => stats.perfectQuizzes >= 1,
    xpReward: 300
  },
  
  sharpshooter: {
    id: 'sharpshooter',
    name: 'Tirador Experto',
    description: 'Mantén 90%+ de precisión en 5 quizzes consecutivos',
    icon: '🎯',
    condition: (stats) => stats.highAccuracyStreak >= 5,
    xpReward: 500
  },
  
  // Logros de velocidad
  speedDemon: {
    id: 'speed-demon',
    name: 'Demonio de Velocidad',
    description: 'Completa un quiz de 20 preguntas en menos de 10 minutos',
    icon: '⚡',
    condition: (stats) => stats.fastestQuiz && stats.fastestQuiz <= 600,
    xpReward: 250
  },
  
  // Logros de racha
  hotStreak: {
    id: 'hot-streak',
    name: 'Racha Caliente',
    description: 'Responde 10 preguntas correctas seguidas',
    icon: '🔥',
    condition: (stats) => stats.longestStreak >= 10,
    xpReward: 200
  },
  
  unstoppable: {
    id: 'unstoppable',
    name: 'Imparable',
    description: 'Responde 25 preguntas correctas seguidas',
    icon: '🔥🔥',
    condition: (stats) => stats.longestStreak >= 25,
    xpReward: 750
  },
  
  // Logros de dominio
  daxMaster: {
    id: 'dax-master',
    name: 'Maestro DAX',
    description: 'Logra 90%+ en preguntas de DAX (mínimo 20 preguntas)',
    icon: '📊',
    condition: (stats) => stats.domainStats?.['crear-calculos-dax']?.accuracy >= 0.9 && 
                          stats.domainStats?.['crear-calculos-dax']?.total >= 20,
    xpReward: 600
  },
  
  dataModeler: {
    id: 'data-modeler',
    name: 'Modelador de Datos',
    description: 'Logra 90%+ en preguntas de modelado (mínimo 20 preguntas)',
    icon: '🗂️',
    condition: (stats) => stats.domainStats?.['diseñar-implementar-modelo']?.accuracy >= 0.9 && 
                          stats.domainStats?.['diseñar-implementar-modelo']?.total >= 20,
    xpReward: 600
  },
  
  visualWizard: {
    id: 'visual-wizard',
    name: 'Mago Visual',
    description: 'Logra 90%+ en preguntas de visualización (mínimo 20 preguntas)',
    icon: '📈',
    condition: (stats) => stats.domainStats?.['crear-reportes']?.accuracy >= 0.9 && 
                          stats.domainStats?.['crear-reportes']?.total >= 20,
    xpReward: 600
  },
  
  // Logros especiales
  nightOwl: {
    id: 'night-owl',
    name: 'Búho Nocturno',
    description: 'Completa un quiz entre medianoche y 6am',
    icon: '🦉',
    condition: (stats) => stats.hasNightQuiz === true,
    xpReward: 100
  },
  
  earlyBird: {
    id: 'early-bird',
    name: 'Madrugador',
    description: 'Completa un quiz antes de las 7am',
    icon: '🐦',
    condition: (stats) => stats.hasEarlyQuiz === true,
    xpReward: 100
  },
  
  challenger: {
    id: 'challenger',
    name: 'Desafiante',
    description: 'Responde correctamente 5 preguntas de nivel avanzado estando en nivel principiante',
    icon: '⚔️',
    condition: (stats) => stats.challengeAnswers >= 5,
    xpReward: 400
  }
};

// ============================================================================
// 3. SISTEMA DE XP Y PROGRESIÓN
// ============================================================================

/**
 * Calcula XP ganada por responder una pregunta
 */
export function calculateQuestionXP(question, isCorrect, timeTaken, currentStreak) {
  if (!isCorrect) return 0;
  
  // XP base según dificultad
  const baseXP = {
    'principiante': 10,
    'intermedio': 20,
    'avanzado': 35
  }[question.nivel] || 10;
  
  // Bonus por velocidad (responder en menos de 30 segundos)
  let speedBonus = 0;
  if (timeTaken < 30) {
    speedBonus = Math.floor(baseXP * 0.3);
  } else if (timeTaken < 60) {
    speedBonus = Math.floor(baseXP * 0.15);
  }
  
  // Bonus por racha (5% por cada acierto en racha, hasta 50%)
  const streakBonus = Math.min(Math.floor(baseXP * currentStreak * 0.05), baseXP * 0.5);
  
  // Bonus por complejidad del dominio
  const domainMultiplier = {
    'crear-calculos-dax': 1.2,
    'optimizar-rendimiento': 1.3,
    'diseñar-implementar-modelo': 1.15
  }[question.dominio] || 1.0;
  
  const total = Math.floor((baseXP + speedBonus + streakBonus) * domainMultiplier);
  
  return {
    total,
    breakdown: {
      base: baseXP,
      speed: speedBonus,
      streak: streakBonus,
      domainMultiplier: domainMultiplier
    }
  };
}

/**
 * Calcula XP ganada por completar un quiz
 */
export function calculateQuizCompletionXP(results) {
  const totalQuestions = Math.max(0, Number(results?.totalQuestions) || 0);
  const correctAnswers = Math.max(0, Number(results?.correctAnswers) || 0);
  const timeElapsed = Math.max(0, Number(results?.timeElapsed) || 0);

  if (totalQuestions === 0) {
    return {
      total: 0,
      breakdown: {
        base: 0,
        accuracy: 0,
        speed: 0
      }
    };
  }

  const accuracy = correctAnswers / totalQuestions;
  
  // XP base por completar
  let baseXP = 100;
  
  // Bonus por alta precisión
  let accuracyBonus = 0;
  if (accuracy >= 0.95) accuracyBonus = 200;
  else if (accuracy >= 0.85) accuracyBonus = 100;
  else if (accuracy >= 0.70) accuracyBonus = 50;
  
  // Bonus por completar rápido (menos de 1 min por pregunta)
  const avgTimePerQuestion = totalQuestions > 0 ? timeElapsed / totalQuestions : Infinity;
  let speedBonus = 0;
  if (avgTimePerQuestion < 60) {
    speedBonus = 50;
  }
  
  return {
    total: baseXP + accuracyBonus + speedBonus,
    breakdown: {
      base: baseXP,
      accuracy: accuracyBonus,
      speed: speedBonus
    }
  };
}

/**
 * Determina el rango actual basado en XP total
 */
export function getCurrentRank(totalXP) {
  const ranks = Object.entries(RANK_SYSTEM).reverse();
  
  for (const [key, rank] of ranks) {
    if (totalXP >= rank.minXP) {
      return {
        key,
        ...rank,
        progress: calculateRankProgress(totalXP, key)
      };
    }
  }
  
  return {
    key: '8kyu',
    ...RANK_SYSTEM['8kyu'],
    progress: calculateRankProgress(totalXP, '8kyu')
  };
}

/**
 * Calcula el progreso hacia el siguiente rango
 */
function calculateRankProgress(totalXP, currentRankKey) {
  const rankKeys = Object.keys(RANK_SYSTEM);
  const currentIndex = rankKeys.indexOf(currentRankKey);
  
  if (currentIndex === -1 || currentIndex === rankKeys.length - 1) {
    return { percentage: 100, xpToNext: 0, nextRank: null };
  }
  
  const currentRank = RANK_SYSTEM[currentRankKey];
  const nextRankKey = rankKeys[currentIndex + 1];
  const nextRank = RANK_SYSTEM[nextRankKey];
  
  const xpInCurrentRank = totalXP - currentRank.minXP;
  const xpNeededForNext = nextRank.minXP - currentRank.minXP;
  const percentage = Math.min((xpInCurrentRank / xpNeededForNext) * 100, 100);
  
  return {
    percentage: Math.floor(percentage),
    xpToNext: nextRank.minXP - totalXP,
    nextRank: nextRank.name,
    nextRankKey
  };
}

/**
 * Verifica logros desbloqueados
 */
export function checkAchievements(stats, previousAchievements = []) {
  const newAchievements = [];
  
  Object.values(ACHIEVEMENTS).forEach(achievement => {
    // Si ya está desbloqueado, saltar
    if (previousAchievements.includes(achievement.id)) return;
    
    // Verificar condición
    if (achievement.condition(stats)) {
      newAchievements.push({
        ...achievement,
        unlockedAt: new Date().toISOString()
      });
    }
  });
  
  return newAchievements;
}

// ============================================================================
// 4. SISTEMA DE LEADERBOARD
// ============================================================================

export function calculateLeaderboardScore(stats) {
  const {
    totalXP = 0,
    quizzesCompleted = 0,
    totalCorrect = 0,
    totalQuestions = 1,
    longestStreak = 0
  } = stats;
  
  const accuracy = totalCorrect / totalQuestions;
  
  // Fórmula ponderada para leaderboard
  const score = 
    (totalXP * 0.5) +                          // 50% XP
    (quizzesCompleted * 50) +                  // Volumen
    (accuracy * 5000) +                        // 50% precisión
    (longestStreak * 20);                      // Racha
  
  return Math.floor(score);
}

// ============================================================================
// 5. GESTOR DE PERFIL DE JUGADOR
// ============================================================================

export class PlayerProfile {
  constructor(userId, savedData = null) {
    this.userId = userId;
    
    if (savedData) {
      Object.assign(this, savedData);
    } else {
      this.initializeProfile();
    }
  }
  
  initializeProfile() {
    this.totalXP = 0;
    this.quizzesCompleted = 0;
    this.totalQuestions = 0;
    this.totalCorrect = 0;
    this.longestStreak = 0;
    this.currentStreak = 0;
    this.perfectQuizzes = 0;
    this.highAccuracyStreak = 0;
    this.fastestQuiz = null;
    this.achievements = [];
    this.domainStats = {};
    this.quizHistory = [];
    this.hasNightQuiz = false;
    this.hasEarlyQuiz = false;
    this.challengeAnswers = 0;
    this.createdAt = new Date().toISOString();
    this.lastActive = new Date().toISOString();
  }
  
  recordQuizCompletion(quizResults) {
    const {
      correctAnswers,
      totalQuestions,
      timeElapsed,
      longestStreak,
      domainBreakdown
    } = quizResults;
    
    // Actualizar estadísticas básicas
    this.quizzesCompleted++;
    this.totalQuestions += totalQuestions;
    this.totalCorrect += correctAnswers;
    this.lastActive = new Date().toISOString();
    
    // Actualizar racha más larga
    if (longestStreak > this.longestStreak) {
      this.longestStreak = longestStreak;
    }
    
    // Quiz perfecto
    const accuracy = correctAnswers / totalQuestions;
    if (accuracy === 1.0) {
      this.perfectQuizzes++;
    }
    
    // Racha de alta precisión
    if (accuracy >= 0.9) {
      this.highAccuracyStreak++;
    } else {
      this.highAccuracyStreak = 0;
    }
    
    // Quiz más rápido
    if (!this.fastestQuiz || timeElapsed < this.fastestQuiz) {
      this.fastestQuiz = timeElapsed;
    }
    
    // Verificar hora del quiz
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 6) this.hasNightQuiz = true;
    if (hour >= 5 && hour < 7) this.hasEarlyQuiz = true;
    
    // Actualizar estadísticas por dominio
    Object.entries(domainBreakdown || {}).forEach(([domain, stats]) => {
      if (!this.domainStats[domain]) {
        this.domainStats[domain] = { total: 0, correct: 0, accuracy: 0 };
      }
      this.domainStats[domain].total += stats.total;
      this.domainStats[domain].correct += stats.correct;
      this.domainStats[domain].accuracy = 
        this.domainStats[domain].correct / this.domainStats[domain].total;
    });
    
    // Calcular XP del quiz
    const quizXP = calculateQuizCompletionXP(quizResults);
    this.addXP(quizXP.total);
    
    // Guardar en historial
    this.quizHistory.push({
      timestamp: new Date().toISOString(),
      accuracy,
      timeElapsed,
      xpGained: quizXP.total,
      questionsAnswered: totalQuestions
    });
    
    // Verificar logros
    const newAchievements = checkAchievements(this, this.achievements.map(a => a.id));
    newAchievements.forEach(achievement => {
      this.unlockAchievement(achievement);
    });
    
    return {
      xpGained: quizXP,
      newAchievements,
      newRank: this.checkRankUp()
    };
  }
  
  addXP(amount) {
    const oldRank = getCurrentRank(this.totalXP);
    this.totalXP += amount;
    const newRank = getCurrentRank(this.totalXP);
    
    return oldRank.key !== newRank.key ? newRank : null;
  }
  
  unlockAchievement(achievement) {
    this.achievements.push({
      id: achievement.id,
      unlockedAt: new Date().toISOString()
    });
    
    // Agregar XP de recompensa
    this.addXP(achievement.xpReward);
  }
  
  checkRankUp() {
    return getCurrentRank(this.totalXP);
  }
  
  getStats() {
    return {
      totalXP: this.totalXP,
      rank: getCurrentRank(this.totalXP),
      quizzesCompleted: this.quizzesCompleted,
      overallAccuracy: this.totalQuestions > 0 ? this.totalCorrect / this.totalQuestions : 0,
      longestStreak: this.longestStreak,
      achievements: this.achievements,
      domainStats: this.domainStats,
      leaderboardScore: calculateLeaderboardScore(this)
    };
  }
  
  save() {
    const data = {
      userId: this.userId,
      totalXP: this.totalXP,
      quizzesCompleted: this.quizzesCompleted,
      totalQuestions: this.totalQuestions,
      totalCorrect: this.totalCorrect,
      longestStreak: this.longestStreak,
      currentStreak: this.currentStreak,
      perfectQuizzes: this.perfectQuizzes,
      highAccuracyStreak: this.highAccuracyStreak,
      fastestQuiz: this.fastestQuiz,
      achievements: this.achievements,
      domainStats: this.domainStats,
      quizHistory: this.quizHistory.slice(-50), // Guardar solo últimos 50
      hasNightQuiz: this.hasNightQuiz,
      hasEarlyQuiz: this.hasEarlyQuiz,
      challengeAnswers: this.challengeAnswers,
      createdAt: this.createdAt,
      lastActive: this.lastActive
    };
    
    localStorage.setItem('gamificationProfile', JSON.stringify(data));
    return data;
  }
  
  static load(userId) {
    const saved = localStorage.getItem('gamificationProfile');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        return new PlayerProfile(userId, data);
      } catch (e) {
        console.error('Error loading profile:', e);
      }
    }
    return new PlayerProfile(userId);
  }
}
