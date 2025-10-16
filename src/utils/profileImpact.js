/**
 * 📊 SISTEMA DE IMPACTO EN EL PERFIL
 * 
 * Calcula cómo las respuestas individuales afectan el perfil global del usuario
 * 
 * ✅ REFACTORIZADO: Ahora usa inyección de dependencias
 * En lugar de importar directamente questionTracker y questionScorer,
 * recibe las funciones del contexto como parámetros en el constructor.
 * 
 * Uso:
 * ```js
 * const { getQuestionTracking, getAllQuestionsTracking, getQuestionTrackingStats, ... } = useCxCProgress();
 * const impact = new ProfileImpactCalculator({
 *   getQuestionTracking,
 *   getAllQuestionsTracking,
 *   getQuestionTrackingStats
 * });
 * ```
 */

// ============================================================================
// 1. CONFIGURACIÓN DE IMPACTO
// ============================================================================

export const PROFILE_IMPACT_CONFIG = {
  // Pesos para calcular nivel de competencia global
  COMPETENCY_WEIGHTS: {
    accuracy: 0.40,          // 40% - Precisión general
    consistency: 0.25,       // 25% - Consistencia en el tiempo
    domainMastery: 0.20,     // 20% - Dominio por áreas
    progression: 0.15        // 15% - Progresión y mejora
  },

  // Umbrales para niveles de competencia
  COMPETENCY_LEVELS: {
    NOVICE: { min: 0, max: 20, label: 'Novato', color: '#ef4444' },
    BEGINNER: { min: 20, max: 40, label: 'Principiante', color: '#f97316' },
    INTERMEDIATE: { min: 40, max: 60, label: 'Intermedio', color: '#eab308' },
    ADVANCED: { min: 60, max: 80, label: 'Avanzado', color: '#3b82f6' },
    EXPERT: { min: 80, max: 100, label: 'Experto', color: '#8b5cf6' }
  },

  // Factores de impacto por dominio
  DOMAIN_IMPACT: {
    // Cuánto afecta una pregunta al dominio
    SINGLE_QUESTION_WEIGHT: 0.05,
    
    // Mínimo de preguntas para considerar dominio
    MIN_QUESTIONS_FOR_ASSESSMENT: 5
  }
};

// ============================================================================
// 2. CLASE PRINCIPAL: ProfileImpactCalculator
// ============================================================================

export class ProfileImpactCalculator {
  /**
   * Constructor con inyección de dependencias
   * @param {Object} contextFunctions - Funciones del CxCProgressContext
   * @param {Function} contextFunctions.getQuestionTracking
   * @param {Function} contextFunctions.getAllQuestionsTracking
   * @param {Function} contextFunctions.getQuestionTrackingStats
   */
  constructor(contextFunctions = {}) {
    // Guardar funciones del contexto
    this.getQuestionTracking = contextFunctions.getQuestionTracking || (() => ({ totalAttempts: 0, confidenceLevel: 0 }));
    this.getAllQuestionsTracking = contextFunctions.getAllQuestionsTracking || (() => ({}));
    this.getQuestionTrackingStats = contextFunctions.getQuestionTrackingStats || (() => ({
      total: 0,
      new: 0,
      learning: 0,
      reviewing: 0,
      mastered: 0,
      retired: 0,
      byDomain: {},
      byLevel: {}
    }));
  }

  /**
   * Calcula el impacto completo en el perfil después de responder una pregunta
   */
  calculateImpact(scoreResult, question) {
    const questionId = question.id;
    const tracking = this.getQuestionTracking(questionId);
    const domain = question.dominio || 'general';
    const level = question.nivel || 'intermedio';

    return {
      // Impacto en competencia global
      globalCompetency: this.calculateGlobalCompetencyChange(),
      
      // Impacto en dominio específico
      domainImpact: this.calculateDomainImpact(domain),
      
      // Impacto en nivel de dificultad
      levelImpact: this.calculateLevelImpact(level),
      
      // Cambios en fortalezas y debilidades
      strengthsWeaknesses: this.identifyStrengthsWeaknesses(),
      
      // Progresión de aprendizaje
      learningProgression: this.calculateLearningProgression(),
      
      // Predicción de preparación para examen
      examReadiness: this.calculateExamReadiness(),
      
      // Recomendaciones personalizadas
      recommendations: this.generateRecommendations(tracking, domain, level)
    };
  }

  /**
   * Calcula el cambio en la competencia global
   */
  calculateGlobalCompetencyChange() {
    const stats = this.getQuestionTrackingStats();
    const totalQuestions = stats.total;

    if (totalQuestions === 0) {
      return {
        level: 'NOVICE',
        score: 0,
        label: 'Novato',
        color: '#ef4444',
        change: 0
      };
    }

    // Factor 1: Precisión global (40%)
    const accuracyScore = (stats.mastered + stats.reviewing) / totalQuestions * 100;
    const accuracyWeight = accuracyScore * PROFILE_IMPACT_CONFIG.COMPETENCY_WEIGHTS.accuracy;

    // Factor 2: Consistencia (25%)
    const consistencyScore = this.calculateConsistencyScore();
    const consistencyWeight = consistencyScore * PROFILE_IMPACT_CONFIG.COMPETENCY_WEIGHTS.consistency;

    // Factor 3: Dominio por áreas (20%)
    const domainMasteryScore = this.calculateDomainMasteryScore();
    const domainMasteryWeight = domainMasteryScore * PROFILE_IMPACT_CONFIG.COMPETENCY_WEIGHTS.domainMastery;

    // Factor 4: Progresión (15%)
    const progressionScore = this.calculateProgressionScore();
    const progressionWeight = progressionScore * PROFILE_IMPACT_CONFIG.COMPETENCY_WEIGHTS.progression;

    // Competencia total
    const totalCompetency = accuracyWeight + consistencyWeight + domainMasteryWeight + progressionWeight;

    // Determinar nivel
    const level = this.getCompetencyLevel(totalCompetency);

    return {
      level: level.key,
      score: Math.round(totalCompetency * 10) / 10,
      label: level.label,
      color: level.color,
      breakdown: {
        accuracy: { score: Math.round(accuracyScore), weight: accuracyWeight },
        consistency: { score: Math.round(consistencyScore), weight: consistencyWeight },
        domainMastery: { score: Math.round(domainMasteryScore), weight: domainMasteryWeight },
        progression: { score: Math.round(progressionScore), weight: progressionWeight }
      }
    };
  }

  /**
   * Calcula el score de consistencia
   */
  calculateConsistencyScore() {
    const allTracking = this.getAllQuestionsTracking();
    const trackingArray = Object.values(allTracking);

    if (trackingArray.length === 0) return 0;

    // Calcular varianza en el rendimiento
    const successRates = trackingArray.map(t => {
      if (t.totalAttempts === 0) return 0;
      return (t.correctAttempts / t.totalAttempts) * 100;
    });

    const average = successRates.reduce((a, b) => a + b, 0) / successRates.length;
    const variance = successRates.reduce((sum, rate) => {
      return sum + Math.pow(rate - average, 2);
    }, 0) / successRates.length;

    const stdDev = Math.sqrt(variance);

    // Menor desviación estándar = mayor consistencia
    // Normalizar a 0-100 (30 de stdDev = 0, 0 de stdDev = 100)
    const consistencyScore = Math.max(0, 100 - (stdDev * 3.33));

    return consistencyScore;
  }

  /**
   * Calcula el score de dominio de áreas
   */
  calculateDomainMasteryScore() {
    const stats = this.getQuestionTrackingStats();
    const domainStats = stats.byDomain || {};
    const domains = Object.values(domainStats);

    if (domains.length === 0) return 0;

    const domainScores = domains.map(domain => {
      const total = domain.total;
      if (total < PROFILE_IMPACT_CONFIG.DOMAIN_IMPACT.MIN_QUESTIONS_FOR_ASSESSMENT) {
        return 0; // No suficientes preguntas
      }

      const masteryRate = (domain.mastered / total) * 100;
      return masteryRate;
    });

    // Promedio de todos los dominios
    const avgDomainMastery = domainScores.reduce((a, b) => a + b, 0) / domainScores.length;
    return avgDomainMastery;
  }

  /**
   * Calcula el score de progresión
   */
  calculateProgressionScore() {
    const allTracking = this.getAllQuestionsTracking();
    const trackingArray = Object.values(allTracking)
      .filter(t => t.totalAttempts > 0)
      .sort((a, b) => new Date(a.lastAttemptDate) - new Date(b.lastAttemptDate));

    if (trackingArray.length < 5) return 50; // Neutral si hay pocas preguntas

    // Analizar últimas 10 preguntas vs primeras 10
    const recentCount = Math.min(10, Math.floor(trackingArray.length / 2));
    const recent = trackingArray.slice(-recentCount);
    const early = trackingArray.slice(0, recentCount);

    const recentSuccess = recent.reduce((sum, t) => {
      return sum + (t.correctAttempts / t.totalAttempts);
    }, 0) / recent.length;

    const earlySuccess = early.reduce((sum, t) => {
      return sum + (t.correctAttempts / t.totalAttempts);
    }, 0) / early.length;

    // Calcular mejora
    const improvement = ((recentSuccess - earlySuccess) / earlySuccess) * 100;
    
    // Normalizar: -50% mejora = 0, 0% = 50, +100% mejora = 100
    const progressionScore = Math.max(0, Math.min(100, 50 + improvement));

    return progressionScore;
  }

  /**
   * Determina el nivel de competencia basado en el score
   */
  getCompetencyLevel(score) {
    for (const [key, value] of Object.entries(PROFILE_IMPACT_CONFIG.COMPETENCY_LEVELS)) {
      if (score >= value.min && score < value.max) {
        return { key, ...value };
      }
    }
    return { key: 'EXPERT', ...PROFILE_IMPACT_CONFIG.COMPETENCY_LEVELS.EXPERT };
  }

  /**
   * Calcula el impacto en un dominio específico
   */
  calculateDomainImpact(domain) {
    const stats = this.getQuestionTrackingStats();
    const domainData = stats.byDomain?.[domain];
    
    if (!domainData) {
      return {
        domain,
        level: 'NOVICE',
        score: 0,
        questionsAnswered: 0,
        masteryRate: 0,
        averageConfidence: 0
      };
    }

    const total = domainData.total || 0;
    const masteryRate = total > 0 ? (domainData.mastered / total) * 100 : 0;
    const reviewingRate = total > 0 ? (domainData.reviewing / total) * 100 : 0;
    
    // Score del dominio: 70% mastery + 30% reviewing
    const domainScore = (masteryRate * 0.7) + (reviewingRate * 0.3);
    
    const level = this.getCompetencyLevel(domainScore);

    return {
      domain,
      level: level.key,
      score: Math.round(domainScore * 10) / 10,
      questionsAnswered: total,
      masteryRate: Math.round(masteryRate * 10) / 10,
      reviewingRate: Math.round(reviewingRate * 10) / 10,
      newRate: total > 0 ? Math.round((domainData.new / total) * 100 * 10) / 10 : 0,
      color: level.color,
      label: level.label
    };
  }

  /**
   * Calcula el impacto en un nivel de dificultad
   */
  calculateLevelImpact(level) {
    const stats = this.getQuestionTrackingStats();
    const levelData = stats.byLevel?.[level];
    
    if (!levelData) {
      return {
        level,
        score: 0,
        questionsAnswered: 0,
        masteryRate: 0
      };
    }

    const total = levelData.total || 0;
    const masteryRate = total > 0 ? (levelData.mastered / total) * 100 : 0;

    return {
      level,
      score: Math.round(masteryRate * 10) / 10,
      questionsAnswered: total,
      masteryRate: Math.round(masteryRate * 10) / 10
    };
  }

  /**
   * Identifica fortalezas y debilidades
   */
  identifyStrengthsWeaknesses() {
    const stats = this.getQuestionTrackingStats();
    const domainStats = stats.byDomain || {};
    const domains = Object.entries(domainStats);

    // Calcular score por dominio
    const domainScores = domains.map(([domain, stats]) => {
      if (stats.total < PROFILE_IMPACT_CONFIG.DOMAIN_IMPACT.MIN_QUESTIONS_FOR_ASSESSMENT) {
        return { domain, score: null, total: stats.total };
      }

      const masteryRate = (stats.mastered / stats.total) * 100;
      return { domain, score: masteryRate, total: stats.total };
    }).filter(d => d.score !== null);

    // Ordenar por score
    domainScores.sort((a, b) => b.score - a.score);

    const strengths = domainScores.slice(0, 3).map(d => ({
      domain: d.domain,
      score: Math.round(d.score * 10) / 10,
      questionsAnswered: d.total
    }));

    const weaknesses = domainScores.slice(-3).reverse().map(d => ({
      domain: d.domain,
      score: Math.round(d.score * 10) / 10,
      questionsAnswered: d.total
    }));

    return { strengths, weaknesses };
  }

  /**
   * Calcula la progresión de aprendizaje
   */
  calculateLearningProgression() {
    const stats = this.getQuestionTrackingStats();
    const total = stats.total;

    if (total === 0) {
      return {
        stage: 'starting',
        progress: 0,
        description: 'Iniciando aprendizaje'
      };
    }

    const masteredPercentage = (stats.mastered / total) * 100;
    const reviewingPercentage = (stats.reviewing / total) * 100;
    const learningPercentage = (stats.learning / total) * 100;

    // Determinar etapa
    let stage = 'starting';
    let description = 'Iniciando aprendizaje';

    if (masteredPercentage >= 70) {
      stage = 'mastery';
      description = 'Nivel de maestría alcanzado';
    } else if (masteredPercentage >= 40) {
      stage = 'consolidation';
      description = 'Consolidando conocimientos';
    } else if (reviewingPercentage >= 30) {
      stage = 'practice';
      description = 'En fase de práctica';
    } else if (learningPercentage >= 20) {
      stage = 'learning';
      description = 'Aprendiendo activamente';
    }

    return {
      stage,
      progress: Math.round(masteredPercentage),
      description,
      breakdown: {
        mastered: Math.round(masteredPercentage),
        reviewing: Math.round(reviewingPercentage),
        learning: Math.round(learningPercentage),
        new: Math.round((stats.new / total) * 100)
      }
    };
  }

  /**
   * Calcula la preparación para el examen
   */
  calculateExamReadiness() {
    const stats = this.getQuestionTrackingStats();
    const domainStats = stats.byDomain || {};
    const total = stats.total;

    if (total < 50) {
      return {
        ready: false,
        score: 0,
        message: `Necesitas practicar más. Completa al menos ${50 - total} preguntas adicionales.`,
        confidence: 'low',
        factors: {
          mastery: 0,
          consistency: 0,
          domainCoverage: Object.keys(domainStats).length
        }
      };
    }

    // Factores de preparación
    const masteryRate = (stats.mastered / total) * 100;
    const domainCoverage = Object.keys(domainStats).length;
    const consistencyScore = this.calculateConsistencyScore();

    // Score de preparación
    const readinessScore = (masteryRate * 0.5) + (consistencyScore * 0.3) + (Math.min(domainCoverage * 10, 20));

    let ready = false;
    let confidence = 'low';
    let message = 'Continúa practicando para mejorar tu preparación.';

    if (readinessScore >= 75) {
      ready = true;
      confidence = 'high';
      message = '¡Estás listo para el examen! Mantén tu nivel de práctica.';
    } else if (readinessScore >= 60) {
      ready = true;
      confidence = 'medium';
      message = 'Estás cerca de estar listo. Enfócate en tus áreas débiles.';
    } else if (readinessScore >= 40) {
      confidence = 'medium';
      message = 'Vas por buen camino. Sigue practicando consistentemente.';
    }

    return {
      ready,
      score: Math.round(readinessScore),
      message,
      confidence,
      factors: {
        mastery: Math.round(masteryRate),
        consistency: Math.round(consistencyScore),
        domainCoverage
      }
    };
  }

  /**
   * Genera recomendaciones personalizadas
   */
  generateRecommendations(tracking, domain, level) {
    const recommendations = [];

    // Recomendación basada en estado de la pregunta
    if (tracking.status === 'learning') {
      recommendations.push({
        type: 'practice',
        priority: 'high',
        message: `Sigue practicando preguntas de ${domain}. Estás en fase de aprendizaje.`,
        action: `Revisa el concepto relacionado con esta pregunta.`
      });
    }

    // Recomendación basada en fortalezas/debilidades
    const { weaknesses } = this.identifyStrengthsWeaknesses();
    if (weaknesses.length > 0 && weaknesses[0].domain === domain) {
      recommendations.push({
        type: 'improvement',
        priority: 'high',
        message: `${domain} es un área de oportunidad.`,
        action: `Dedica más tiempo a estudiar este dominio.`
      });
    }

    // Recomendación basada en preparación
    const examReadiness = this.calculateExamReadiness();
    if (!examReadiness.ready) {
      recommendations.push({
        type: 'preparation',
        priority: 'medium',
        message: examReadiness.message,
        action: 'Practica al menos 30 minutos diarios.'
      });
    }

    return recommendations;
  }
}

// ============================================================================
// 3. HELPER PARA CREAR INSTANCIA CON CONTEXTO
// ============================================================================

/**
 * Crea una nueva instancia de ProfileImpactCalculator con las funciones del contexto
 * 
 * @param {Object} contextFunctions - Funciones extraídas del useCxCProgress hook
 * @returns {ProfileImpactCalculator} - Nueva instancia configurada
 * 
 * @example
 * const { getQuestionTracking, getAllQuestionsTracking, getQuestionTrackingStats } = useCxCProgress();
 * const impact = createProfileImpactCalculator({ getQuestionTracking, getAllQuestionsTracking, getQuestionTrackingStats });
 */
export function createProfileImpactCalculator(contextFunctions) {
  return new ProfileImpactCalculator(contextFunctions);
}

// ============================================================================
// 4. EXPORTAR CLASE (NO INSTANCIA - requiere contexto)
// ============================================================================

export default ProfileImpactCalculator;
