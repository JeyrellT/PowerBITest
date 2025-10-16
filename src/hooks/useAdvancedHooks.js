/**
 * Hooks Avanzados 2025 - FSRS & ZPD Integration
 * 
 * Nuevos hooks para:
 * - Repetición espaciada científica (FSRS)
 * - Selección adaptativa de preguntas (ZPD)
 * - Analytics mejorados con nuevas métricas
 */

import { useMemo, useCallback } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { FSRSIntegration, createFSRSScheduler, getQuestionsForReview } from '../utils/fsrsScheduler';
import { ZPDSelector, LearningZone } from '../utils/zpdSelector';

/**
 * Hook para gestionar repetición espaciada con FSRS
 * @returns {Object} Funciones y datos de spaced repetition
 */
export function useSpacedRepetition() {
  const profile = useUserProfile();
  const scheduler = useMemo(() => createFSRSScheduler(), []);
  
  // Obtener preguntas listas para review
  const questionsForReview = useMemo(() => {
    return getQuestionsForReview(profile.questionTracking || {}, scheduler);
  }, [profile.questionTracking, scheduler]);
  
  // Estadísticas FSRS
  const stats = useMemo(() => {
    return FSRSIntegration.getUserStats(profile.questionTracking || {});
  }, [profile.questionTracking]);
  
  // Verificar si pregunta específica necesita review
  const isReadyForReview = useCallback((questionId) => {
    const tracking = profile.questionTracking?.[questionId];
    return FSRSIntegration.isReadyForReview(tracking);
  }, [profile.questionTracking]);
  
  // Obtener próximas N preguntas para review
  const getNextReviews = useCallback((count = 10) => {
    return questionsForReview.slice(0, count);
  }, [questionsForReview]);
  
  // Obtener reviews críticas (alta prioridad)
  const getCriticalReviews = useCallback(() => {
    return questionsForReview.filter(q => q.retrievability < 0.7);
  }, [questionsForReview]);
  
  return {
    // Datos
    questionsForReview,
    stats,
    criticalCount: questionsForReview.filter(q => q.retrievability < 0.7).length,
    totalReviewCount: questionsForReview.length,
    
    // Funciones
    isReadyForReview,
    getNextReviews,
    getCriticalReviews,
    
    // Scheduler (para uso avanzado)
    scheduler,
  };
}

/**
 * Hook para selección adaptativa de preguntas basada en ZPD
 * @param {Array} availableQuestions - Pool de preguntas disponibles
 * @param {Object} options - Opciones de selección
 * @returns {Object} Preguntas seleccionadas y funciones
 */
export function useAdaptiveQuizSelection(availableQuestions, options = {}) {
  const profile = useUserProfile();
  
  // Seleccionar preguntas óptimas
  const selectedQuestions = useMemo(() => {
    if (!availableQuestions || availableQuestions.length === 0) return [];
    
    return ZPDSelector.selectOptimalQuestions(
      availableQuestions,
      profile,
      profile.questionTracking || {},
      options
    );
  }, [availableQuestions, profile, options]);
  
  // Analizar zona actual del usuario
  const zoneAnalysis = useMemo(() => {
    return ZPDSelector.analyzeUserZone(profile, profile.questionTracking || {});
  }, [profile]);
  
  // Obtener recomendación de próxima acción
  const nextAction = useMemo(() => {
    return ZPDSelector.recommendNextAction(profile, profile.questionTracking || {});
  }, [profile]);
  
  // Estimar probabilidad de éxito para pregunta
  const estimateSuccessProbability = useCallback((question) => {
    const tracking = profile.questionTracking?.[question.id] || {};
    return ZPDSelector.estimateSuccessProbability(
      { ...tracking, domain: question.dominio, skill: question.skill, difficulty: question.difficulty },
      profile
    );
  }, [profile]);
  
  // Filtrar preguntas por zona
  const filterByZone = useCallback((zone) => {
    return selectedQuestions.filter(q => q.zone === zone);
  }, [selectedQuestions]);
  
  return {
    // Preguntas seleccionadas
    questions: selectedQuestions,
    
    // Análisis de zona
    zoneAnalysis,
    nextAction,
    
    // Funciones
    estimateSuccessProbability,
    filterByZone,
    
    // Métricas
    inZPD: filterByZone(LearningZone.ZPD).length,
    inComfort: filterByZone(LearningZone.COMFORT).length,
    inFrustration: filterByZone(LearningZone.FRUSTRATION).length,
  };
}

/**
 * Hook para analytics avanzados con FSRS y ZPD
 * @returns {Object} Métricas avanzadas
 */
export function useAdvancedAnalytics() {
  const profile = useUserProfile();
  const { stats: fsrsStats, questionsForReview } = useSpacedRepetition();
  
  // Métricas de retención (FSRS)
  const retentionMetrics = useMemo(() => {
    const avgRetention = fsrsStats.averageRetrievability || 0;
    const avgStability = fsrsStats.averageStability || 0;
    
    return {
      averageRetention: Math.round(avgRetention * 100),
      averageStabilityDays: Math.round(avgStability),
      retentionLevel: avgRetention >= 0.85 ? 'excellent' : 
                      avgRetention >= 0.70 ? 'good' :
                      avgRetention >= 0.50 ? 'fair' : 'poor',
      reviewPressure: questionsForReview.length,
      criticalReviews: questionsForReview.filter(q => q.retrievability < 0.7).length,
    };
  }, [fsrsStats, questionsForReview]);
  
  // Métricas de dificultad (FSRS)
  const difficultyMetrics = useMemo(() => {
    const avgDifficulty = fsrsStats.averageDifficulty || 5;
    
    return {
      averageDifficulty: avgDifficulty.toFixed(1),
      difficultyLevel: avgDifficulty >= 7 ? 'challenging' :
                       avgDifficulty >= 4 ? 'moderate' : 'easy',
      hardCards: Object.values(profile.questionTracking || {})
        .filter(t => (t.correct / Math.max(t.attempts, 1)) < 0.5).length,
      easyCards: Object.values(profile.questionTracking || {})
        .filter(t => (t.correct / Math.max(t.attempts, 1)) >= 0.8).length,
    };
  }, [fsrsStats, profile.questionTracking]);
  
  // Métricas de zona (ZPD)
  const zoneMetrics = useMemo(() => {
    return ZPDSelector.analyzeUserZone(profile, profile.questionTracking || {});
  }, [profile]);
  
  // Eficiencia de estudio
  const efficiencyMetrics = useMemo(() => {
    const totalTime = profile.progress?.totalTimeSpent || 0;
    const totalQuestions = profile.progress?.questionsAnswered || 0;
    const avgTimePerQuestion = totalQuestions > 0 ? totalTime / totalQuestions : 0;
    
    return {
      totalStudyTime: Math.round(totalTime / 60), // minutos
      avgTimePerQuestion: Math.round(avgTimePerQuestion),
      questionsPerHour: avgTimePerQuestion > 0 ? Math.round(3600 / avgTimePerQuestion) : 0,
      efficiency: avgTimePerQuestion <= 30 && profile.progress?.accuracyOverall >= 70 ? 'high' :
                  avgTimePerQuestion <= 45 || profile.progress?.accuracyOverall >= 60 ? 'moderate' : 'low',
    };
  }, [profile.progress]);
  
  // Predicción de preparación
  const readinessPrediction = useMemo(() => {
    const currentReadiness = profile.readinessScore?.overall || 0;
    const avgAccuracy = profile.progress?.accuracyOverall || 0;
    const questionsAnswered = profile.progress?.questionsAnswered || 0;
    const totalAvailableQuestions = 100; // Total de preguntas en el sistema
    
    // Calcular preguntas restantes del pool
    const questionsRemaining = Math.max(0, totalAvailableQuestions - questionsAnswered);
    
    // Estimar preguntas necesarias para estar listo (85%)
    // Basado en: si tienes 0% necesitas ~70-80 preguntas, si tienes 50% necesitas ~30-40, etc.
    const baseQuestionsNeeded = currentReadiness >= 85 ? 0 :
                               Math.round((85 - currentReadiness) * 0.9); // Más realista: 0.9 por punto de preparación
    
    // No podemos necesitar más preguntas de las que quedan disponibles
    const questionsNeeded = Math.min(baseQuestionsNeeded, questionsRemaining);
    
    // Estimar días basado en racha actual
    const currentStreak = profile.progress?.currentStreak || 0;
    const avgQuestionsPerDay = currentStreak > 0 ? 20 : 10;
    const daysNeeded = questionsNeeded > 0 ? Math.ceil(questionsNeeded / avgQuestionsPerDay) : 0;
    
    return {
      currentReadiness,
      questionsNeeded,
      questionsRemaining,
      daysNeeded,
      projectedReadinessDate: new Date(Date.now() + daysNeeded * 24 * 60 * 60 * 1000),
      readyForExam: currentReadiness >= 85,
      confidenceLevel: avgAccuracy >= 80 ? 'high' : avgAccuracy >= 65 ? 'medium' : 'building',
    };
  }, [profile]);
  
  return {
    retention: retentionMetrics,
    difficulty: difficultyMetrics,
    zone: zoneMetrics,
    efficiency: efficiencyMetrics,
    readiness: readinessPrediction,
    
    // Resumen ejecutivo
    summary: {
      strongPoints: [
        retentionMetrics.retentionLevel === 'excellent' && '✅ Excelente retención de conocimiento',
        zoneMetrics.zpdPercentage >= 40 && '✅ Zona de aprendizaje óptima',
        efficiencyMetrics.efficiency === 'high' && '✅ Alta eficiencia de estudio',
        readinessPrediction.readyForExam && '✅ Listo para el examen',
      ].filter(Boolean),
      
      improvements: [
        retentionMetrics.criticalReviews > 5 && `⚠️ ${retentionMetrics.criticalReviews} reviews críticos pendientes`,
        zoneMetrics.comfortPercentage > 60 && '⚠️ Aumentar nivel de desafío',
        zoneMetrics.frustrationPercentage > 40 && '⚠️ Reforzar fundamentos',
        efficiencyMetrics.efficiency === 'low' && '⚠️ Mejorar velocidad de respuesta',
      ].filter(Boolean),
    },
  };
}

/**
 * Hook para sugerencias de scaffolding adaptativo
 * @param {string} questionId - ID de la pregunta
 * @param {number} attempts - Intentos en la pregunta
 * @returns {Object} Nivel de ayuda sugerido
 */
export function useAdaptiveScaffolding(questionId, attempts = 0) {
  const profile = useUserProfile();
  
  const scaffolding = useMemo(() => {
    const tracking = profile.questionTracking?.[questionId];
    if (!tracking) return { level: 'none' };
    
    const accuracy = tracking.correct / Math.max(tracking.attempts, 1);
    const zone = ZPDSelector.determineZone(accuracy);
    
    return ZPDSelector.provideAdaptiveScaffolding(zone, attempts);
  }, [profile.questionTracking, questionId, attempts]);
  
  return scaffolding;
}

/**
 * Hook para métricas de comparación temporal
 * @param {number} days - Días hacia atrás para comparar (default 7)
 * @returns {Object} Comparación de métricas
 */
export function useProgressComparison(days = 7) {
  const profile = useUserProfile();
  
  const comparison = useMemo(() => {
    // TODO: Implementar tracking temporal más detallado
    // Por ahora retorna comparación básica
    
    const currentAccuracy = profile.progress?.accuracyOverall || 0;
    const currentStreak = profile.progress?.currentStreak || 0;
    const totalQuestions = profile.progress?.questionsAnswered || 0;
    
    return {
      accuracy: {
        current: currentAccuracy,
        change: '+2.5', // Mock - implementar tracking real
        trend: 'improving',
      },
      streak: {
        current: currentStreak,
        longestEver: profile.progress?.longestStreak || 0,
        onTrack: currentStreak >= 3,
      },
      volume: {
        totalQuestions,
        recentAvg: Math.round(totalQuestions / Math.max(days, 1)),
        recommendation: totalQuestions < 100 ? 'increase' : 'maintain',
      },
    };
  }, [profile, days]);
  
  return comparison;
}

const AdvancedHooks = {
  useSpacedRepetition,
  useAdaptiveQuizSelection,
  useAdvancedAnalytics,
  useAdaptiveScaffolding,
  useProgressComparison,
};

export default AdvancedHooks;
