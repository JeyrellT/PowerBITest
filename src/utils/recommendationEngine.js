/**
 * 🧠 MOTOR DE RECOMENDACIONES INTELIGENTE
 * Sistema avanzado de análisis y recomendaciones personalizadas
 * para el aprendizaje PL-300 Power BI
 */

// Tipos de recomendaciones
export const RECOMMENDATION_TYPES = {
  CRITICAL: 'critical',    // Problemas críticos que necesitan atención inmediata
  WARNING: 'warning',      // Advertencias importantes
  INFO: 'info',           // Información útil
  TIP: 'tip',             // Consejos para mejorar
  SUCCESS: 'success',     // Reconocimiento de logros
  MOTIVATIONAL: 'motivational' // Motivación y ánimo
};

// Prioridades (mayor número = mayor prioridad)
export const PRIORITY = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  INFO: 1
};

/**
 * Analiza el rendimiento del usuario y genera recomendaciones personalizadas
 */
export class RecommendationEngine {
  constructor(stats) {
    this.stats = stats;
    this.recommendations = [];
  }

  /**
   * Genera todas las recomendaciones basadas en el análisis completo
   */
  generateRecommendations() {
    this.recommendations = [];

    // Análisis de precisión
    this.analyzeAccuracy();
    
    // Análisis de consistencia
    this.analyzeConsistency();
    
    // Análisis de dominio
    this.analyzeDomainPerformance();
    
    // Análisis de tiempo
    this.analyzeTimeSpent();
    
    // Análisis de racha
    this.analyzeStreak();
    
    // Análisis de progreso
    this.analyzeProgress();
    
    // Análisis de preparación para el examen
    this.analyzeExamReadiness();

    // Motivación y logros
    this.analyzeAchievements();

    // Ordenar por prioridad
    return this.recommendations.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Agrega una recomendación al sistema
   */
  addRecommendation(type, icon, title, message, priority, actionable = null) {
    this.recommendations.push({
      type,
      icon,
      title,
      message,
      priority,
      actionable, // Objeto con sugerencias accionables
      timestamp: Date.now()
    });
  }

  /**
   * Análisis de precisión general
   */
  analyzeAccuracy() {
    const { accuracy, questionsAnswered } = this.stats;

    if (questionsAnswered < 10) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.INFO,
        '🎯',
        'Comienza tu entrenamiento',
        'Responde al menos 10 preguntas para obtener un análisis más preciso de tu rendimiento.',
        PRIORITY.MEDIUM,
        { suggestedAction: 'Tomar quiz de diagnóstico' }
      );
      return;
    }

    // Precisión crítica (< 50%)
    if (accuracy < 50) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.CRITICAL,
        '🚨',
        'Atención: Precisión muy baja',
        `Tu precisión es del ${accuracy.toFixed(1)}%. Necesitas reforzar los conceptos básicos. Considera revisar la guía de estudio y practicar más.`,
        PRIORITY.CRITICAL,
        {
          suggestedAction: 'Estudiar guía completa',
          estimatedTime: '2-3 horas diarias'
        }
      );
    }
    // Precisión baja (50-60%)
    else if (accuracy < 60) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.WARNING,
        '⚠️',
        'Necesitas más práctica',
        `Precisión: ${accuracy.toFixed(1)}%. Estás por debajo del umbral recomendado (70%). Enfócate en los dominios con menor rendimiento.`,
        PRIORITY.HIGH,
        {
          suggestedAction: 'Práctica enfocada en dominios débiles',
          estimatedTime: '1-2 horas diarias'
        }
      );
    }
    // Precisión moderada (60-70%)
    else if (accuracy < 70) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.WARNING,
        '📊',
        'Estás progresando',
        `Precisión: ${accuracy.toFixed(1)}%. Estás cerca del objetivo (70%). Continúa practicando y revisa tus errores más comunes.`,
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Revisar respuestas incorrectas',
          estimatedTime: '1 hora diaria'
        }
      );
    }
    // Precisión buena (70-80%)
    else if (accuracy < 80) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '✅',
        '¡Buen trabajo!',
        `Precisión: ${accuracy.toFixed(1)}%. Has alcanzado el nivel mínimo recomendado. Ahora enfócate en dominar los temas más complejos.`,
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Practicar preguntas avanzadas',
          estimatedTime: '45 min diarios'
        }
      );
    }
    // Precisión muy buena (80-90%)
    else if (accuracy < 90) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '🌟',
        '¡Excelente rendimiento!',
        `Precisión: ${accuracy.toFixed(1)}%. Estás muy bien preparado. Mantén la práctica constante y refuerza los detalles.`,
        PRIORITY.LOW,
        {
          suggestedAction: 'Simulacros de examen completo',
          estimatedTime: '30 min diarios'
        }
      );
    }
    // Precisión excepcional (90%+)
    else {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '🏆',
        '¡Dominando el examen!',
        `Precisión: ${accuracy.toFixed(1)}%. ¡Excepcional! Estás completamente preparado para el examen PL-300. Mantén esta consistencia.`,
        PRIORITY.INFO,
        {
          suggestedAction: 'Mantener práctica de repaso',
          estimatedTime: '20 min diarios'
        }
      );
    }
  }

  /**
   * Análisis de consistencia en el rendimiento
   */
  analyzeConsistency() {
    const { history } = this.stats;
    
    if (history.length < 3) return;

    const recentScores = history.slice(-5).map(h => h.score);
    const variance = this.calculateVariance(recentScores);

    // Alta variabilidad en rendimiento
    if (variance > 500) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.TIP,
        '📉',
        'Rendimiento inconsistente',
        'Tus resultados varían mucho entre sesiones. Intenta mantener un horario de estudio regular y evita la fatiga mental.',
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Establecer rutina de estudio fija',
          estimatedTime: 'Mismo horario diario'
        }
      );
    }
  }

  /**
   * Análisis por dominio de conocimiento
   */
  analyzeDomainPerformance() {
    const { domainStats } = this.stats;
    
    if (!domainStats || Object.keys(domainStats).length === 0) return;

    // Encontrar el dominio más débil
    let weakestDomain = null;
    let lowestAccuracy = 100;

    Object.entries(domainStats).forEach(([domain, data]) => {
      const accuracy = (data.correctCount / data.totalQuestions) * 100;
      if (accuracy < lowestAccuracy && data.totalQuestions >= 3) {
        lowestAccuracy = accuracy;
        weakestDomain = { domain, accuracy, data };
      }
    });

    if (weakestDomain && lowestAccuracy < 60) {
      const domainNames = {
        'preparar': 'Preparar Datos',
        'modelar': 'Modelar Datos',
        'visualizar': 'Visualizar y Analizar'
      };

      this.addRecommendation(
        RECOMMENDATION_TYPES.WARNING,
        '🎯',
        `Refuerza: ${domainNames[weakestDomain.domain] || weakestDomain.domain}`,
        `Tu precisión en "${domainNames[weakestDomain.domain]}" es del ${lowestAccuracy.toFixed(1)}%. Este dominio requiere más atención.`,
        PRIORITY.HIGH,
        {
          suggestedAction: `Estudiar sección específica de ${domainNames[weakestDomain.domain]}`,
          estimatedTime: '1-2 horas'
        }
      );
    }

    // Encontrar dominio fuerte para reconocimiento
    let strongestDomain = null;
    let highestAccuracy = 0;

    Object.entries(domainStats).forEach(([domain, data]) => {
      const accuracy = (data.correctCount / data.totalQuestions) * 100;
      if (accuracy > highestAccuracy && data.totalQuestions >= 5) {
        highestAccuracy = accuracy;
        strongestDomain = { domain, accuracy, data };
      }
    });

    if (strongestDomain && highestAccuracy >= 85) {
      const domainNames = {
        'preparar': 'Preparar Datos',
        'modelar': 'Modelar Datos',
        'visualizar': 'Visualizar y Analizar'
      };

      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '💪',
        `Fortaleza: ${domainNames[strongestDomain.domain] || strongestDomain.domain}`,
        `¡Excelente! Dominas "${domainNames[strongestDomain.domain]}" con ${highestAccuracy.toFixed(1)}% de precisión.`,
        PRIORITY.LOW
      );
    }
  }

  /**
   * Análisis de tiempo invertido
   */
  analyzeTimeSpent() {
    const { history, questionsAnswered } = this.stats;
    
    if (history.length < 3) return;

    const recentHistory = history.slice(-5);
    const avgTimePerQuestion = recentHistory.reduce((sum, h) => 
      sum + (h.timeSpent / h.questionsAnswered), 0
    ) / recentHistory.length;

    // Demasiado rápido (< 20 segundos)
    if (avgTimePerQuestion < 20 && questionsAnswered > 10) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.TIP,
        '⏱️',
        'Tómate más tiempo',
        `Promedio: ${avgTimePerQuestion.toFixed(0)}s por pregunta. Leer cuidadosamente cada opción puede mejorar tu precisión.`,
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Leer todas las opciones antes de responder',
          estimatedTime: '30-45s por pregunta recomendado'
        }
      );
    }
    // Demasiado lento (> 120 segundos)
    else if (avgTimePerQuestion > 120) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.TIP,
        '⚡',
        'Mejora tu velocidad',
        `Promedio: ${avgTimePerQuestion.toFixed(0)}s por pregunta. En el examen real tendrás tiempo limitado. Practica con límite de tiempo.`,
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Practicar con cronómetro',
          estimatedTime: '45-60s por pregunta objetivo'
        }
      );
    }
    // Tiempo óptimo (20-60 segundos)
    else if (avgTimePerQuestion >= 20 && avgTimePerQuestion <= 60 && questionsAnswered > 20) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '⏰',
        'Ritmo perfecto',
        `Mantienes un excelente equilibrio entre velocidad y precisión (${avgTimePerQuestion.toFixed(0)}s/pregunta).`,
        PRIORITY.LOW
      );
    }
  }

  /**
   * Análisis de racha de estudio
   */
  analyzeStreak() {
    const { streakDays, bestStreak, quizzesTaken } = this.stats;

    // Sin racha activa pero con experiencia
    if (streakDays === 0 && quizzesTaken > 0) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.INFO,
        '📅',
        'Crea una rutina de estudio',
        'La práctica diaria y consistente es clave para retener conocimientos. ¡Comienza una racha hoy!',
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Practicar al menos 1 quiz diario',
          estimatedTime: '15-20 min diarios'
        }
      );
    }
    // Racha corta (1-3 días)
    else if (streakDays >= 1 && streakDays <= 3) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.MOTIVATIONAL,
        '🔥',
        '¡Construye tu racha!',
        `Llevas ${streakDays} día${streakDays > 1 ? 's' : ''} seguidos. ¡No rompas la cadena! La consistencia es tu mejor aliado.`,
        PRIORITY.LOW
      );
    }
    // Racha buena (4-7 días)
    else if (streakDays >= 4 && streakDays <= 7) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '🔥',
        '¡Racha sólida!',
        `¡${streakDays} días consecutivos! Estás desarrollando un excelente hábito de estudio. ¡Continúa así!`,
        PRIORITY.LOW
      );
    }
    // Racha excelente (8+ días)
    else if (streakDays >= 8) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '🔥',
        '¡Racha increíble!',
        `¡${streakDays} días seguidos! Tu dedicación es excepcional. Este tipo de consistencia garantiza el éxito.`,
        PRIORITY.INFO
      );
    }

    // Récord personal
    if (streakDays > 0 && streakDays === bestStreak && streakDays >= 5) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '🏅',
        '¡Nuevo récord personal!',
        `¡${streakDays} días es tu mejor racha! Cada día que añadas establece un nuevo estándar.`,
        PRIORITY.LOW
      );
    }
  }

  /**
   * Análisis de progreso general
   */
  analyzeProgress() {
    const { quizzesTaken, levelInfo } = this.stats;

    // Usuario nuevo (< 5 quizzes)
    if (quizzesTaken < 5) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.INFO,
        '🚀',
        '¡Bienvenido al entrenamiento!',
        `Has completado ${quizzesTaken} quiz${quizzesTaken !== 1 ? 'zes' : ''}. Completa al menos 5 para desbloquear análisis detallado.`,
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Completar quiz de diagnóstico',
          estimatedTime: '30-45 min'
        }
      );
    }
    // Progreso moderado (5-15 quizzes)
    else if (quizzesTaken >= 5 && quizzesTaken < 15) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.TIP,
        '📚',
        'Aumenta tu volumen de práctica',
        `Has completado ${quizzesTaken} quizzes. Para estar completamente preparado, recomendamos al menos 30 quizzes.`,
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Practicar regularmente',
          estimatedTime: '2-3 quizzes por semana'
        }
      );
    }
    // Buen progreso (15-30 quizzes)
    else if (quizzesTaken >= 15 && quizzesTaken < 30) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '📈',
        'Progreso sólido',
        `${quizzesTaken} quizzes completados. Estás en buen camino. Continúa para alcanzar los 30 recomendados.`,
        PRIORITY.LOW
      );
    }
    // Excelente volumen (30+ quizzes)
    else if (quizzesTaken >= 30) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '🎓',
        'Volumen de práctica excepcional',
        `¡${quizzesTaken} quizzes! Has superado la cantidad recomendada. Tu preparación es exhaustiva.`,
        PRIORITY.INFO
      );
    }

    // Progreso hacia siguiente nivel
    if (levelInfo.level < 10 && levelInfo.progressToNext > 50) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.MOTIVATIONAL,
        '⭐',
        'Cerca del siguiente nivel',
        `Estás al ${levelInfo.progressToNext.toFixed(0)}% del nivel ${levelInfo.level + 1}. Solo ${levelInfo.pointsToNext} puntos más.`,
        PRIORITY.LOW
      );
    }
  }

  /**
   * Análisis de preparación para el examen
   */
  analyzeExamReadiness() {
    const { accuracy, quizzesTaken, domainStats } = this.stats;

    // Criterios de preparación
    const isAccuracyReady = accuracy >= 75;
    const isVolumeReady = quizzesTaken >= 20;
    const areCriteria = [isAccuracyReady, isVolumeReady];
    const readyCount = areCriteria.filter(Boolean).length;

    // Análisis de cobertura de dominios
    let domainsReady = 0;
    const totalDomains = 3; // preparar, modelar, visualizar

    if (domainStats) {
      Object.values(domainStats).forEach(data => {
        const domainAccuracy = (data.correctCount / data.totalQuestions) * 100;
        if (domainAccuracy >= 70 && data.totalQuestions >= 5) {
          domainsReady++;
        }
      });
    }

    // No está listo
    if (readyCount === 0 || quizzesTaken < 10) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.INFO,
        '📋',
        'Preparación inicial',
        'Aún estás en fase de aprendizaje. Enfócate en completar más quizzes y mejorar tu precisión antes de considerar el examen real.',
        PRIORITY.MEDIUM,
        {
          suggestedAction: 'Plan de estudio: 2-3 semanas',
          estimatedTime: '1-2 horas diarias'
        }
      );
    }
    // Parcialmente listo
    else if (readyCount === 1) {
      const missingCriteria = [];
      if (!isAccuracyReady) missingCriteria.push(`precisión (actual: ${accuracy.toFixed(1)}%, objetivo: 75%)`);
      if (!isVolumeReady) missingCriteria.push(`volumen de práctica (actual: ${quizzesTaken}, objetivo: 20)`);

      this.addRecommendation(
        RECOMMENDATION_TYPES.WARNING,
        '📊',
        'Preparación parcial',
        `Estás progresando, pero necesitas mejorar: ${missingCriteria.join(', ')}.`,
        PRIORITY.HIGH,
        {
          suggestedAction: 'Enfocarte en criterios faltantes',
          estimatedTime: '1-2 semanas más'
        }
      );
    }
    // Listo para el examen
    else if (readyCount === 2 && domainsReady >= 2) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '✅',
        '¡Listo para el examen!',
        `Has alcanzado los criterios de preparación: ${accuracy.toFixed(1)}% precisión, ${quizzesTaken} quizzes completados, ${domainsReady}/${totalDomains} dominios dominados.`,
        PRIORITY.HIGH,
        {
          suggestedAction: 'Programar fecha de examen',
          estimatedTime: 'Próximas 1-2 semanas'
        }
      );
    }
  }

  /**
   * Análisis de logros
   */
  analyzeAchievements() {
    const { achievements } = this.stats;
    const totalAchievements = 20; // Número estimado de logros totales

    if (achievements.length === 0 && this.stats.quizzesTaken >= 1) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.MOTIVATIONAL,
        '🎯',
        'Desbloquea logros',
        'Completa más quizzes para comenzar a desbloquear logros y obtener bonificaciones de puntos.',
        PRIORITY.LOW
      );
    }
    else if (achievements.length > 0 && achievements.length < 5) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.MOTIVATIONAL,
        '🏅',
        'Coleccionista de logros',
        `Has desbloqueado ${achievements.length} de ${totalAchievements} logros. ¡Continúa desbloqueando más!`,
        PRIORITY.LOW
      );
    }
    else if (achievements.length >= totalAchievements * 0.75) {
      this.addRecommendation(
        RECOMMENDATION_TYPES.SUCCESS,
        '🏆',
        'Maestro de logros',
        `¡${achievements.length}/${totalAchievements} logros desbloqueados! Eres un verdadero completista.`,
        PRIORITY.INFO
      );
    }
  }

  /**
   * Calcula la varianza de un conjunto de números
   */
  calculateVariance(numbers) {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
  }
}

/**
 * Función auxiliar para obtener recomendaciones
 */
export const getRecommendations = (stats, maxRecommendations = 6) => {
  const engine = new RecommendationEngine(stats);
  const allRecommendations = engine.generateRecommendations();
  
  // Limitar cantidad y asegurar variedad de tipos
  return allRecommendations.slice(0, maxRecommendations);
};

export default RecommendationEngine;
