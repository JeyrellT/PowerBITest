/**
 * 🧠 SISTEMA AVANZADO DE RECOMENDACIONES ADAPTATIVAS
 * Motor inteligente basado en análisis de desempeño, repetición espaciada,
 * mastery learning y principios de aprendizaje adaptativo
 * 
 * MEJORAS 2025:
 * - FSRS (Free Spaced Repetition Scheduler) - reducción 20-30% reviews
 * - Zone of Proximal Development (ZPD) - selección óptima de preguntas
 * - Modelado mejorado de dificultad (Stability + Retrievability)
 */

import { getQuestionsForReview } from './fsrsScheduler';
import { ZPDSelector, LearningZone } from './zpdSelector';

// ============================================================================
// TIPOS Y PRIORIDADES
// ============================================================================

export const RECOMMENDATION_TYPE = {
  HABIT: 'habit',                    // Formación de hábitos de estudio
  WEAKNESS: 'weakness',              // Refuerzo de puntos débiles
  REVIEW: 'review',                  // Revisión de errores (repetición espaciada)
  CHALLENGE: 'challenge',            // Aumentar dificultad
  MAINTENANCE: 'maintenance',        // Mantener fortalezas
  DIAGNOSTIC: 'diagnostic',          // Evaluación diagnóstica
  MOTIVATIONAL: 'motivational',      // Motivación y reconocimiento
  STRATEGY: 'strategy'               // Cambio de estrategia de estudio
};

export const PRIORITY = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  INFO: 1
};

// ============================================================================
// MOTOR DE RECOMENDACIONES ADAPTATIVAS
// ============================================================================

export class AdaptiveRecommendationEngine {
  constructor(profile) {
    this.profile = profile;
    this.recommendations = [];
  }
  
  /**
   * Genera recomendaciones personalizadas completas
   */
  generateRecommendations() {
    this.recommendations = [];
    
    // 1. Análisis de hábitos de estudio
    this.analyzeStudyHabits();
    
    // 2. Análisis de puntos débiles
    this.analyzeWeaknesses();
    
    // 3. Análisis de repetición espaciada
    this.analyzeSpacedRepetition();
    
    // 4. Análisis de desafío apropiado
    this.analyzeChallengeLevel();
    
    // 5. Análisis de mantenimiento de fortalezas
    this.analyzeStrengthMaintenance();
    
    // 6. Análisis de preparación para examen
    this.analyzeExamReadiness();
    
    // 7. Motivación y reconocimiento
    this.analyzeAchievements();
    
    // 8. Análisis de estrategia de estudio
    this.analyzeStudyStrategy();
    
    // Ordenar por prioridad y retornar
    return this.recommendations.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * 1. ANÁLISIS DE HÁBITOS DE ESTUDIO
   * Detecta falta de práctica y recomienda establecer hábitos
   */
  analyzeStudyHabits() {
    const { progress } = this.profile;
    const { questionsAnswered, currentStreak, lastActivityDate } = progress;
    
    // Verificar si hay actividad reciente
    const daysSinceLastActivity = this.getDaysSince(lastActivityDate);
    
    // CRÍTICO: Usuario inactivo por mucho tiempo
    if (daysSinceLastActivity > 7) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.HABIT,
        priority: PRIORITY.CRITICAL,
        icon: '🔥',
        title: '¡Te extrañamos!',
        message: `Han pasado ${daysSinceLastActivity} días desde tu última práctica. La consistencia es clave para retener conocimiento.`,
        action: {
          label: 'Retomar práctica',
          type: 'start-quiz',
          config: { numberOfQuestions: 10 }
        },
        insight: 'Estudios muestran que la práctica espaciada mejora la retención hasta en un 200%.'
      });
      return; // Si está muy inactivo, esta es la prioridad
    }
    
    // Alto: Racha rota recientemente
    if (daysSinceLastActivity === 1 && currentStreak === 0) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.HABIT,
        priority: PRIORITY.HIGH,
        icon: '💔',
        title: 'Racha interrumpida',
        message: 'Tu racha de estudio se interrumpió ayer. ¡No te desanimes! Comienza una nueva racha hoy.',
        action: {
          label: 'Iniciar nueva racha',
          type: 'start-quiz',
          config: { numberOfQuestions: 5 }
        },
        insight: 'Solo 5 minutos diarios pueden hacer la diferencia.'
      });
    }
    
    // Medio: Pocas preguntas respondidas (necesita establecer hábito)
    if (questionsAnswered < 20) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.HABIT,
        priority: PRIORITY.MEDIUM,
        icon: '🎯',
        title: 'Establece tu ritmo de estudio',
        message: 'Responder al menos 10 preguntas diarias te ayudará a formar un hábito de estudio consistente.',
        action: {
          label: 'Práctica diaria',
          type: 'start-quiz',
          config: { numberOfQuestions: 10 }
        },
        insight: 'La formación de hábitos requiere al menos 21 días de práctica consistente.',
        goal: {
          current: questionsAnswered,
          target: 100,
          metric: 'preguntas'
        }
      });
    }
    
    // Bajo: Reconocimiento de buena racha
    if (currentStreak >= 3 && currentStreak < 7) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.MOTIVATIONAL,
        priority: PRIORITY.LOW,
        icon: '🔥',
        title: '¡Racha en progreso!',
        message: `Llevas ${currentStreak} días consecutivos de estudio. ¡Sigue así!`,
        action: {
          label: 'Continuar racha',
          type: 'start-quiz'
        },
        insight: 'Mantener una racha activa aumenta tu compromiso y retención.'
      });
    }
    
    // Info: Racha excepcional
    if (currentStreak >= 7) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.MOTIVATIONAL,
        priority: PRIORITY.INFO,
        icon: '⚡',
        title: `¡Racha de ${currentStreak} días!`,
        message: 'Tu consistencia es excepcional. Este hábito te llevará al éxito en el examen.',
        insight: `Estás en el top 10% de estudiantes más consistentes.`
      });
    }
  }
  
  /**
   * 2. ANÁLISIS DE PUNTOS DÉBILES
   * Identifica dominios y habilidades con bajo rendimiento
   */
  analyzeWeaknesses() {
    const { domainStats, skillsMastery, progress } = this.profile;
    
    // Necesita datos suficientes
    if (progress.questionsAnswered < 10) return;
    
    // Analizar dominios débiles
    const weakDomains = Object.entries(domainStats)
      .filter(([_, stats]) => stats.accuracy < 60 && stats.attempted >= 3)
      .sort((a, b) => a[1].accuracy - b[1].accuracy);
    
    if (weakDomains.length > 0) {
      const [weakestDomain, stats] = weakDomains[0];
      
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.WEAKNESS,
        priority: PRIORITY.HIGH,
        icon: '📊',
        title: `Refuerzo necesario: ${weakestDomain}`,
        message: `Tu precisión en ${weakestDomain} es ${stats.accuracy.toFixed(1)}%, por debajo del objetivo de 70%.`,
        action: {
          label: `Practicar ${weakestDomain}`,
          type: 'start-quiz',
          config: {
            domain: weakestDomain,
            numberOfQuestions: 15
          }
        },
        insight: 'Enfocarte en tus debilidades es la forma más rápida de mejorar tu score general.',
        metrics: {
          current: stats.accuracy,
          target: 70,
          unit: '%'
        }
      });
    }
    
    // Analizar habilidades no dominadas
    const weakSkills = Object.entries(skillsMastery)
      .filter(([_, skill]) => 
        skill.masteryLevel === 'beginner' && skill.attempted >= 3
      )
      .sort((a, b) => a[1].accuracy - b[1].accuracy);
    
    if (weakSkills.length >= 3) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.WEAKNESS,
        priority: PRIORITY.MEDIUM,
        icon: '🎓',
        title: 'Múltiples habilidades por mejorar',
        message: `Tienes ${weakSkills.length} habilidades que necesitan más práctica para alcanzar el nivel de dominio.`,
        action: {
          label: 'Práctica mixta',
          type: 'start-quiz',
          config: { numberOfQuestions: 20, level: 'basico' }
        },
        insight: 'La práctica variada ayuda a consolidar múltiples habilidades simultáneamente.'
      });
    }
    
    // Analizar precisión general baja
    if (progress.accuracyOverall < 65 && progress.questionsAnswered >= 20) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.STRATEGY,
        priority: PRIORITY.HIGH,
        icon: '💡',
        title: 'Revisa tu estrategia de estudio',
        message: `Tu precisión general es ${progress.accuracyOverall.toFixed(1)}%. Considera estudiar el material teórico antes de practicar.`,
        action: {
          label: 'Ver guía de estudio',
          type: 'view-guide'
        },
        insight: 'Combinar teoría y práctica mejora la retención en un 40%.',
        metrics: {
          current: progress.accuracyOverall,
          target: 75,
          unit: '%'
        }
      });
    }
  }
  
  /**
   * 3. ANÁLISIS DE REPETICIÓN ESPACIADA
   * Identifica preguntas que necesitan revisión
   */
  analyzeSpacedRepetition() {
    const { questionTracking } = this.profile;
    
    // 🔥 MEJORA 2025: Usar FSRS para detección más precisa
    const readyForReview = getQuestionsForReview(questionTracking);
    
    // Filtrar por urgencia basado en retrievability
    const criticalReviews = readyForReview.filter(q => q.retrievability < 0.7);
    const normalReviews = readyForReview.filter(q => q.retrievability >= 0.7);
    
    // Si hay reviews críticas (alta probabilidad de olvido)
    if (criticalReviews.length >= 3) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.REVIEW,
        priority: PRIORITY.CRITICAL,
        icon: '⚠️',
        title: 'Review urgente necesaria',
        message: `${criticalReviews.length} preguntas en riesgo de olvido (${Math.round(criticalReviews[0]?.retrievability * 100)}% retención).`,
        action: {
          label: 'Repasar urgente',
          type: 'review-mode',
          config: { questionIds: criticalReviews.map(q => q.questionId) }
        },
        insight: 'FSRS detectó que estas preguntas necesitan review inmediato para evitar olvido completo.',
        metrics: {
          current: Math.round((criticalReviews[0]?.retrievability || 0) * 100),
          target: 90,
          unit: '% retención'
        }
      });
    }
    // Si hay reviews normales
    else if (readyForReview.length >= 5) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.REVIEW,
        priority: PRIORITY.HIGH,
        icon: '🔄',
        title: 'Revisión programada (FSRS)',
        message: `${readyForReview.length} preguntas listas para repasar en momento óptimo.`,
        action: {
          label: 'Modo de revisión',
          type: 'review-mode',
          config: { questionIds: readyForReview.map(q => q.questionId) }
        },
        insight: 'Algoritmo FSRS optimiza el timing para maximizar retención con mínimo esfuerzo.',
        metrics: {
          current: readyForReview.length,
          unit: 'preguntas programadas'
        }
      });
    } else if (normalReviews.length > 0) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.REVIEW,
        priority: PRIORITY.MEDIUM,
        icon: '📝',
        title: 'Preguntas para repasar',
        message: `${normalReviews.length} pregunta(s) lista(s) para revisión.`,
        action: {
          label: 'Repasar ahora',
          type: 'review-mode',
          config: { questionIds: normalReviews.map(q => q.questionId) }
        }
      });
    }
    
    // Preguntas respondidas incorrectamente recientemente
    const recentErrors = Object.entries(questionTracking)
      .filter(([_, data]) => {
        const daysSince = this.getDaysSince(data.lastAttempt);
        return data.correct === 0 && daysSince <= 2;
      });
    
    if (recentErrors.length >= 3) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.REVIEW,
        priority: PRIORITY.MEDIUM,
        icon: '❌',
        title: 'Errores recientes',
        message: `Has fallado ${recentErrors.length} preguntas en los últimos 2 días. Repásalas ahora para reforzar.`,
        action: {
          label: 'Revisar errores',
          type: 'review-mode',
          config: { questionIds: recentErrors.map(([id]) => id) }
        },
        insight: 'Corregir errores inmediatamente previene la consolidación de información incorrecta.'
      });
    }
  }
  
  /**
   * 4. ANÁLISIS DE NIVEL DE DESAFÍO
   * 🔥 MEJORA 2025: Usa Zone of Proximal Development (ZPD)
   * Recomienda aumentar o disminuir dificultad basado en zona óptima
   */
  analyzeChallengeLevel() {
    const { progress, questionTracking } = this.profile;
    
    if (progress.questionsAnswered < 30) return;
    
    // Analizar zona actual del usuario
    const zoneAnalysis = ZPDSelector.analyzeUserZone(this.profile, questionTracking);
    const recommendation = ZPDSelector.recommendNextAction(this.profile, questionTracking);
    
    // Si está en comfort zone (muchas preguntas fáciles)
    if (zoneAnalysis.comfortPercentage > 60) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.CHALLENGE,
        priority: PRIORITY.HIGH,
        icon: '🚀',
        title: '¡Sal de tu zona de confort!',
        message: `${zoneAnalysis.comfortPercentage}% de tus preguntas son muy fáciles. Aumenta el desafío.`,
        action: {
          label: 'Quiz adaptativo ZPD',
          type: 'start-quiz',
          config: { 
            mode: 'zpd',
            targetZone: LearningZone.ZPD,
            numberOfQuestions: 15 
          }
        },
        insight: `${recommendation.reasoning}. La zona óptima tiene 40-70% dificultad.`,
        metrics: {
          current: zoneAnalysis.comfortPercentage,
          target: 40,
          unit: '% en zona confort'
        }
      });
    }
    
    // Si está en frustration zone (muchas preguntas muy difíciles)
    else if (zoneAnalysis.frustrationPercentage > 40) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.STRATEGY,
        priority: PRIORITY.HIGH,
        icon: '📖',
        title: 'Refuerza fundamentos primero',
        message: `${zoneAnalysis.frustrationPercentage}% de preguntas están muy difíciles. Construye base sólida.`,
        action: {
          label: 'Quiz básico ZPD',
          type: 'start-quiz',
          config: { 
            mode: 'zpd',
            targetZone: LearningZone.COMFORT,
            numberOfQuestions: 15 
          }
        },
        insight: `${recommendation.reasoning}. Domina fundamentos antes de avanzar.`,
        metrics: {
          current: zoneAnalysis.frustrationPercentage,
          target: 20,
          unit: '% en frustración'
        }
      });
    }
    
    // Si está en ZPD óptima
    else if (zoneAnalysis.zpdPercentage >= 40) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.MOTIVATIONAL,
        priority: PRIORITY.LOW,
        icon: '🎯',
        title: '¡Zona de aprendizaje óptima!',
        message: `${zoneAnalysis.zpdPercentage}% de tus preguntas están en la zona perfecta de desafío.`,
        action: {
          label: 'Continuar en ZPD',
          type: 'start-quiz',
          config: { 
            mode: 'zpd',
            numberOfQuestions: 15 
          }
        },
        insight: 'Mantén este equilibrio para maximizar tu progreso de aprendizaje.',
      });
    }
    
    // Rendimiento estancado
    const recentAccuracy = this.calculateRecentAccuracy();
    if (recentAccuracy !== null && Math.abs(recentAccuracy - progress.accuracyOverall) < 5 && progress.questionsAnswered >= 50) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.STRATEGY,
        priority: PRIORITY.LOW,
        icon: '📈',
        title: 'Rompe la meseta',
        message: 'Tu precisión se ha estabilizado. Intenta variar tus dominios de práctica o nivel de dificultad.',
        action: {
          label: 'Práctica variada',
          type: 'start-quiz',
          config: { domain: 'all', level: 'all', numberOfQuestions: 20 }
        },
        insight: 'La variabilidad en la práctica mejora la transferencia de conocimiento.'
      });
    }
  }
  
  /**
   * 5. ANÁLISIS DE MANTENIMIENTO DE FORTALEZAS
   * Asegura que las habilidades dominadas no se olviden
   */
  analyzeStrengthMaintenance() {
    const { skillsMastery } = this.profile;
    
    // Habilidades dominadas que no se han practicado recientemente
    const neglectedMasteredSkills = Object.entries(skillsMastery)
      .filter(([_, skill]) => {
        const daysSince = this.getDaysSince(skill.lastPracticed);
        return skill.masteryLevel === 'mastered' && daysSince > 14;
      });
    
    if (neglectedMasteredSkills.length > 0) {
      const [skillId, skill] = neglectedMasteredSkills[0];
      const daysSince = this.getDaysSince(skill.lastPracticed);
      
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.MAINTENANCE,
        priority: PRIORITY.LOW,
        icon: '🔧',
        title: 'Mantén tus fortalezas',
        message: `No has practicado ${skill.skillName} en ${daysSince} días. Un repaso breve mantendrá tu dominio.`,
        action: {
          label: 'Repaso rápido',
          type: 'start-quiz',
          config: { skill: skillId, numberOfQuestions: 5 }
        },
        insight: 'Incluso las habilidades dominadas necesitan repaso ocasional para evitar el olvido.'
      });
    }
  }
  
  /**
   * 6. ANÁLISIS DE PREPARACIÓN PARA EXAMEN
   * Evalúa la preparación general y hace recomendaciones estratégicas
   */
  analyzeExamReadiness() {
    const readiness = this.calculateReadinessScore();
    
    // Listo para examen de simulacro
    if (readiness.overall >= 70 && readiness.level === 'Casi Listo') {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.DIAGNOSTIC,
        priority: PRIORITY.HIGH,
        icon: '🎯',
        title: '¡Listo para simulacro!',
        message: `Con ${readiness.overall}% de preparación, estás listo para un examen de simulacro completo.`,
        action: {
          label: 'Examen simulacro',
          type: 'start-quiz',
          config: { numberOfQuestions: 50, level: 'all', domain: 'all' }
        },
        insight: 'Los exámenes de simulacro te preparan para la experiencia real y revelan áreas finales de mejora.',
        metrics: {
          current: readiness.overall,
          target: 100,
          unit: '% preparación'
        }
      });
    }
    
    // Necesita mejorar cobertura
    if (readiness.coverage < 50) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.STRATEGY,
        priority: PRIORITY.MEDIUM,
        icon: '🗺️',
        title: 'Amplía tu cobertura',
        message: `Has cubierto ${readiness.coverage.toFixed(0)}% del temario. Explora más dominios para una preparación completa.`,
        action: {
          label: 'Explorar todos los dominios',
          type: 'start-quiz',
          config: { domain: 'all', numberOfQuestions: 20 }
        },
        insight: 'El examen real cubre todos los dominios. Asegúrate de practicar cada uno.',
        metrics: {
          current: readiness.coverage,
          target: 100,
          unit: '% cobertura'
        }
      });
    }
    
    // Comenzando - necesita evaluación diagnóstica
    if (readiness.level === 'Comenzando') {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.DIAGNOSTIC,
        priority: PRIORITY.HIGH,
        icon: '📋',
        title: 'Evaluación diagnóstica',
        message: 'Toma una evaluación diagnóstica para identificar tu nivel actual en cada dominio.',
        action: {
          label: 'Iniciar diagnóstico',
          type: 'diagnostic-quiz'
        },
        insight: 'Una evaluación inicial te ayuda a enfocar tu estudio en lo que realmente necesitas.'
      });
    }
  }
  
  /**
   * 7. ANÁLISIS DE LOGROS Y MOTIVACIÓN
   * Reconoce logros y motiva al usuario
   */
  analyzeAchievements() {
    const { progress } = this.profile;
    
    // Cerca de un hito importante
    if (progress.questionsAnswered >= 95 && progress.questionsAnswered < 100) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.MOTIVATIONAL,
        priority: PRIORITY.LOW,
        icon: '🎓',
        title: '¡Casi 100 preguntas!',
        message: `Solo ${100 - progress.questionsAnswered} preguntas más para alcanzar tu primer centenar.`,
        action: {
          label: 'Completar hito',
          type: 'start-quiz',
          config: { numberOfQuestions: 5 }
        },
        metrics: {
          current: progress.questionsAnswered,
          target: 100,
          unit: 'preguntas'
        }
      });
    }
    
    // Reconocimiento de nivel alto
    if (progress.currentLevel >= 5) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.MOTIVATIONAL,
        priority: PRIORITY.INFO,
        icon: '⭐',
        title: `Nivel ${progress.currentLevel} alcanzado`,
        message: 'Tu dedicación y esfuerzo están dando resultados. ¡Sigue adelante!',
        insight: 'Estás en el camino correcto hacia la certificación.'
      });
    }
    
    // Precisión excelente
    if (progress.accuracyOverall >= 85 && progress.questionsAnswered >= 30) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.MOTIVATIONAL,
        priority: PRIORITY.INFO,
        icon: '💯',
        title: 'Precisión excepcional',
        message: `${progress.accuracyOverall.toFixed(1)}% de precisión demuestra tu sólida comprensión del material.`,
        insight: 'Con este nivel de dominio, estás bien encaminado para aprobar el examen.'
      });
    }
  }
  
  /**
   * 8. ANÁLISIS DE ESTRATEGIA DE ESTUDIO
   * Detecta patrones problemáticos y sugiere mejoras
   */
  analyzeStudyStrategy() {
    const { progress, domainStats } = this.profile;
    
    // Tiempo promedio muy bajo (posible respuestas apresuradas)
    const avgTime = progress.totalTimeSpent / progress.questionsAnswered;
    if (avgTime < 15 && progress.questionsAnswered >= 20) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.STRATEGY,
        priority: PRIORITY.MEDIUM,
        icon: '⏱️',
        title: 'Tómate tu tiempo',
        message: `Tu tiempo promedio de ${avgTime.toFixed(0)}s por pregunta es muy bajo. Lee cuidadosamente cada pregunta.`,
        insight: 'La velocidad es buena, pero la comprensión es más importante.'
      });
    }
    
    // Enfoque excesivo en un solo dominio
    const domainCount = Object.keys(domainStats).length;
    const totalAttempts = Object.values(domainStats).reduce((sum, s) => sum + s.attempted, 0);
    const mostPracticedDomain = Object.entries(domainStats)
      .sort((a, b) => b[1].attempted - a[1].attempted)[0];
    
    if (mostPracticedDomain && mostPracticedDomain[1].attempted / totalAttempts > 0.6 && domainCount >= 2) {
      this.addRecommendation({
        type: RECOMMENDATION_TYPE.STRATEGY,
        priority: PRIORITY.LOW,
        icon: '🎨',
        title: 'Diversifica tu práctica',
        message: `${(mostPracticedDomain[1].attempted / totalAttempts * 100).toFixed(0)}% de tu práctica está en ${mostPracticedDomain[0]}. Practica otros dominios también.`,
        action: {
          label: 'Práctica variada',
          type: 'start-quiz',
          config: { domain: 'all', numberOfQuestions: 15 }
        },
        insight: 'Una práctica balanceada entre dominios mejora tu preparación general.'
      });
    }
  }
  
  // ========================================================================
  // UTILIDADES
  // ========================================================================
  
  addRecommendation(recommendation) {
    this.recommendations.push({
      id: `rec_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      ...recommendation
    });
  }
  
  getDaysSince(timestamp) {
    if (!timestamp) return Infinity;
    const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  calculateRecentAccuracy() {
    // Implementar cálculo de precisión en últimas N preguntas
    // Para simplificar, retornamos null por ahora
    return null;
  }
  
  calculateReadinessScore() {
    const { progress, skillsMastery } = this.profile;
    
    // Coverage: porcentaje del banco de preguntas explorado
    const totalQuestions = 100; // Ajustar según banco real
    const coverage = Math.min(100, (progress.questionsAnswered / totalQuestions) * 100);
    
    // Mastery: promedio de dominio en habilidades
    const masteredSkills = Object.values(skillsMastery)
      .filter(s => s.masteryLevel === 'mastered' || s.masteryLevel === 'proficient').length;
    const totalSkills = Math.max(1, Object.keys(skillsMastery).length);
    const mastery = (masteredSkills / totalSkills) * 100;
    
    // Consistency: basado en precisión y racha
    const consistency = (progress.accuracyOverall * 0.7) + (Math.min(progress.currentStreak, 14) / 14 * 30);
    
    // Score general (ponderado)
    const overall = (coverage * 0.3) + (mastery * 0.4) + (consistency * 0.3);
    
    // Determinar nivel
    let level = 'Comenzando';
    if (overall >= 85) level = 'Listo';
    else if (overall >= 70) level = 'Casi Listo';
    else if (overall >= 50) level = 'En Progreso';
    else if (overall >= 30) level = 'Desarrollando';
    
    return {
      overall: Math.round(overall),
      coverage: Math.round(coverage),
      mastery: Math.round(mastery),
      consistency: Math.round(consistency),
      level
    };
  }
}

/**
 * Función de conveniencia para generar recomendaciones
 */
export function generatePersonalizedRecommendations(profile) {
  const engine = new AdaptiveRecommendationEngine(profile);
  return engine.generateRecommendations();
}

/**
 * Calcula el score de preparación
 */
export function calculateReadinessScore(profile) {
  const engine = new AdaptiveRecommendationEngine(profile);
  return engine.calculateReadinessScore();
}
