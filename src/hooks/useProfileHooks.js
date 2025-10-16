/**
 * 🎣 HOOKS PERSONALIZADOS PARA GESTIÓN DE PERFIL
 * Composición de hooks para encapsular lógica compleja
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Hook para persistencia en localStorage con manejo de errores
 */
export function useLocalStorage(key, initialValue) {
  // State para almacenar valor
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error loading ${key} from localStorage:`, error);
      return initialValue;
    }
  });

  // Función para actualizar valor
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
      
      // Manejar quota exceeded
      if (error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Consider cleaning old data.');
      }
    }
  }, [key, storedValue]);

  // Función para remover valor
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook para análisis de progreso
 * Encapsula la lógica de cálculo de métricas de progreso
 */
export function useProgressAnalysis(profile) {
  const analysis = useMemo(() => {
    if (!profile) return null;

    const { progress, domainStats, skillsMastery, questionTracking } = profile;

    // Métricas básicas
    const totalQuestions = progress.questionsAnswered;
    const accuracy = progress.accuracyOverall;
    const level = progress.currentLevel;
    const xp = progress.totalXP;

    // Análisis de dominios
    const domainAnalysis = Object.entries(domainStats).map(([domain, stats]) => ({
      domain,
      accuracy: stats.accuracy,
      attempted: stats.attempted,
      masteryLevel: stats.masteryLevel,
      isStrength: stats.accuracy >= 75 && stats.attempted >= 5,
      isWeakness: stats.accuracy < 60 && stats.attempted >= 3
    }));

    const strengths = domainAnalysis.filter(d => d.isStrength);
    const weaknesses = domainAnalysis.filter(d => d.isWeakness);

    // Análisis de habilidades
    const skillsAnalysis = Object.entries(skillsMastery).map(([skillId, skill]) => ({
      skillId,
      skillName: skill.skillName,
      accuracy: skill.accuracy,
      attempted: skill.attempted,
      masteryLevel: skill.masteryLevel,
      isMastered: skill.masteryLevel === 'mastered',
      needsReview: skill.masteryLevel !== 'mastered' && skill.attempted > 0
    }));

    const masteredSkills = skillsAnalysis.filter(s => s.isMastered).length;
    const totalSkills = skillsAnalysis.length;
    const masteryPercentage = totalSkills > 0 ? (masteredSkills / totalSkills) * 100 : 0;

    // Preguntas para revisión (repetición espaciada)
    const now = Date.now();
    const questionsForReview = Object.entries(questionTracking)
      .filter(([_, data]) => 
        data.markedForReview && 
        data.nextReviewDate && 
        data.nextReviewDate <= now
      )
      .map(([id]) => id);

    // Tasa de mejora (últimas 20 vs primeras 20)
    const improvementRate = calculateImprovementRate(questionTracking);

    // Tiempo promedio por pregunta
    const avgTimePerQuestion = totalQuestions > 0 
      ? progress.totalTimeSpent / totalQuestions 
      : 0;

    // Velocidad de respuesta (preguntas por día)
    const daysSinceStart = Math.max(1, 
      (Date.now() - new Date(profile.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const questionsPerDay = totalQuestions / daysSinceStart;

    return {
      basic: {
        totalQuestions,
        accuracy,
        level,
        xp
      },
      domains: {
        all: domainAnalysis,
        strengths,
        weaknesses
      },
      skills: {
        all: skillsAnalysis,
        masteredCount: masteredSkills,
        totalCount: totalSkills,
        masteryPercentage
      },
      review: {
        questionsReady: questionsForReview,
        count: questionsForReview.length
      },
      performance: {
        improvementRate,
        avgTimePerQuestion,
        questionsPerDay
      },
      streak: {
        current: progress.currentStreak,
        longest: progress.longestStreak
      }
    };
  }, [profile]);

  return analysis;
}

/**
 * Hook para gestión de recomendaciones
 */
export function useRecommendations(profile, engine) {
  const [recommendations, setRecommendations] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  useEffect(() => {
    if (profile && engine) {
      const generated = engine.generateRecommendations();
      // Filtrar las ya descartadas
      const filtered = generated.filter(rec => !dismissed.includes(rec.id));
      setRecommendations(filtered);
    }
  }, [profile, engine, dismissed]);

  const dismissRecommendation = useCallback((recommendationId) => {
    setDismissed(prev => [...prev, recommendationId]);
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
  }, []);

  const clearDismissed = useCallback(() => {
    setDismissed([]);
  }, []);

  return {
    recommendations,
    dismissRecommendation,
    clearDismissed
  };
}

/**
 * Hook para gamificación y logros
 */
export function useGamification(profile, dispatch) {
  const checkAndUnlockAchievements = useCallback(() => {
    if (!profile) return;

    const { progress, achievements } = profile;
    const newAchievements = [];

    // Definir logros
    const achievementRules = [
      {
        id: 'first_quiz',
        condition: progress.quizzesCompleted >= 1,
        name: 'Primer Quiz',
        xp: 50
      },
      {
        id: 'streak_5',
        condition: progress.currentStreak >= 5,
        name: 'Racha de 5 días',
        xp: 100
      },
      {
        id: 'streak_10',
        condition: progress.currentStreak >= 10,
        name: 'Racha de 10 días',
        xp: 250
      },
      {
        id: '100_questions',
        condition: progress.questionsAnswered >= 100,
        name: '100 Preguntas',
        xp: 500
      },
      {
        id: 'accuracy_master',
        condition: progress.accuracyOverall >= 85 && progress.questionsAnswered >= 30,
        name: 'Maestro de la Precisión',
        xp: 300
      },
      {
        id: 'level_5',
        condition: progress.currentLevel >= 5,
        name: 'Nivel 5 Alcanzado',
        xp: 200
      },
      {
        id: 'speed_demon',
        condition: progress.totalTimeSpent / progress.questionsAnswered < 20 && 
                   progress.questionsAnswered >= 20,
        name: 'Velocista',
        xp: 150
      }
    ];

    // Verificar cada logro
    achievementRules.forEach(rule => {
      if (rule.condition && !achievements.includes(rule.id)) {
        newAchievements.push(rule);
        dispatch({
          type: 'UNLOCK_ACHIEVEMENT',
          payload: { achievementId: rule.id }
        });
        dispatch({
          type: 'ADD_XP',
          payload: { xp: rule.xp }
        });
      }
    });

    return newAchievements;
  }, [profile, dispatch]);

  return {
    checkAndUnlockAchievements
  };
}

/**
 * Hook para análisis de preparación del examen
 */
export function useExamReadiness(profile) {
  const readiness = useMemo(() => {
    if (!profile) return null;

    const { progress, domainStats, skillsMastery } = profile;

    // 1. Cobertura del temario (30%)
    const totalQuestionsInBank = 100; // Ajustar según tamaño real del banco
    const coverage = Math.min(100, (progress.questionsAnswered / totalQuestionsInBank) * 100);

    // 2. Dominio de habilidades (40%)
    const masteredSkills = Object.values(skillsMastery)
      .filter(s => s.masteryLevel === 'mastered' || s.masteryLevel === 'proficient').length;
    const totalSkills = Math.max(1, Object.keys(skillsMastery).length);
    const mastery = (masteredSkills / totalSkills) * 100;

    // 3. Precisión y consistencia (30%)
    const accuracyScore = progress.accuracyOverall;
    const streakBonus = Math.min(10, progress.currentStreak); // Bonus hasta 10%
    const consistency = accuracyScore * 0.9 + streakBonus;

    // Score general (0-100)
    const overall = (coverage * 0.3) + (mastery * 0.4) + (consistency * 0.3);

    // Nivel cualitativo
    let level = 'Comenzando';
    let color = '#e74c3c';
    let icon = '🌱';

    if (overall >= 85) {
      level = 'Listo';
      color = '#27ae60';
      icon = '🏆';
    } else if (overall >= 70) {
      level = 'Casi Listo';
      color = '#2ecc71';
      icon = '⭐';
    } else if (overall >= 50) {
      level = 'En Progreso';
      color = '#f39c12';
      icon = '📈';
    } else if (overall >= 30) {
      level = 'Desarrollando';
      color = '#e67e22';
      icon = '🌿';
    }

    // Dominios críticos
    const criticalDomains = Object.entries(domainStats)
      .filter(([_, stats]) => stats.accuracy < 60 && stats.attempted >= 3)
      .map(([domain]) => domain);

    // Estimación de días para estar listo
    const questionsPerDay = progress.questionsAnswered / Math.max(1, progress.currentStreak);
    const questionsNeeded = Math.max(0, totalQuestionsInBank - progress.questionsAnswered);
    const daysUntilReady = questionsPerDay > 0 ? Math.ceil(questionsNeeded / questionsPerDay) : null;

    return {
      overall: Math.round(overall),
      coverage: Math.round(coverage),
      mastery: Math.round(mastery),
      consistency: Math.round(consistency),
      level,
      color,
      icon,
      criticalDomains,
      estimatedDaysToReady: daysUntilReady,
      recommendations: generateReadinessRecommendations(overall, coverage, mastery, consistency)
    };
  }, [profile]);

  return readiness;
}

/**
 * Hook para estado de quiz adaptativo
 */
export function useAdaptiveQuiz(profile) {
  const [quizState, setQuizState] = useState({
    currentDifficulty: 'intermedio',
    suggestedDomain: 'all',
    numberOfQuestions: 20
  });

  useEffect(() => {
    if (!profile) return;

    const { progress, domainStats } = profile;

    // Ajustar dificultad según rendimiento
    let difficulty = 'basico';
    if (progress.accuracyOverall >= 75) {
      difficulty = 'avanzado';
    } else if (progress.accuracyOverall >= 60) {
      difficulty = 'intermedio';
    }

    // Sugerir dominio más débil
    const weakestDomain = Object.entries(domainStats)
      .filter(([_, stats]) => stats.attempted >= 3)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)[0];

    const suggestedDomain = weakestDomain ? weakestDomain[0] : 'all';

    setQuizState({
      currentDifficulty: difficulty,
      suggestedDomain,
      numberOfQuestions: 20
    });
  }, [profile]);

  return quizState;
}

/**
 * Hook para tracking de sesión actual
 */
export function useSessionTracking() {
  const [session, setSession] = useState({
    startTime: null,
    questionsInSession: 0,
    correctInSession: 0,
    isActive: false
  });

  const startSession = useCallback(() => {
    setSession({
      startTime: Date.now(),
      questionsInSession: 0,
      correctInSession: 0,
      isActive: true
    });
  }, []);

  const recordQuestion = useCallback((isCorrect) => {
    setSession(prev => ({
      ...prev,
      questionsInSession: prev.questionsInSession + 1,
      correctInSession: prev.correctInSession + (isCorrect ? 1 : 0)
    }));
  }, []);

  const endSession = useCallback(() => {
    const duration = Date.now() - session.startTime;
    const sessionData = {
      ...session,
      duration,
      accuracy: session.questionsInSession > 0 
        ? (session.correctInSession / session.questionsInSession) * 100 
        : 0,
      isActive: false
    };
    setSession({ ...sessionData, isActive: false });
    return sessionData;
  }, [session]);

  return {
    session,
    startSession,
    recordQuestion,
    endSession
  };
}

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function calculateImprovementRate(questionTracking) {
  const attempts = Object.values(questionTracking)
    .sort((a, b) => a.lastAttempt - b.lastAttempt);

  if (attempts.length < 20) return null;

  const first20 = attempts.slice(0, 20);
  const last20 = attempts.slice(-20);

  const first20Accuracy = first20.filter(a => a.correct > 0).length / 20 * 100;
  const last20Accuracy = last20.filter(a => a.correct > 0).length / 20 * 100;

  return last20Accuracy - first20Accuracy;
}

function generateReadinessRecommendations(overall, coverage, mastery, consistency) {
  const recommendations = [];

  if (coverage < 50) {
    recommendations.push({
      area: 'Cobertura',
      message: 'Necesitas responder más preguntas para cubrir todo el temario',
      priority: 'high'
    });
  }

  if (mastery < 60) {
    recommendations.push({
      area: 'Dominio',
      message: 'Enfócate en dominar más habilidades antes del examen',
      priority: 'high'
    });
  }

  if (consistency < 70) {
    recommendations.push({
      area: 'Consistencia',
      message: 'Mejora tu precisión y mantén una racha de estudio diaria',
      priority: 'medium'
    });
  }

  if (overall >= 85) {
    recommendations.push({
      area: 'Preparación',
      message: '¡Estás listo! Considera programar tu examen',
      priority: 'success'
    });
  }

  return recommendations;
}
