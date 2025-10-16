/**
 * Zone of Proximal Development (ZPD) Item Selection
 * 
 * Selecciona preguntas óptimas donde el usuario tiene:
 * - Probabilidad de éxito entre 40-60% (zona gris)
 * - Máximo potencial de aprendizaje
 * - Desafío apropiado sin frustración
 * 
 * Basado en:
 * - Grey Area Model (2017)
 * - IRT probability targeting
 * - Adaptive scaffolding principles
 */

import { calculateRetrievability, convertToFSRSCard } from './fsrsScheduler';

/**
 * Niveles de zona de aprendizaje
 */
export const LearningZone = {
  COMFORT: 'comfort',        // > 70% éxito - muy fácil
  ZPD: 'zpd',                // 40-70% éxito - zona óptima
  FRUSTRATION: 'frustration' // < 40% éxito - muy difícil
};

/**
 * Calcula probabilidad de éxito estimada para una pregunta
 * @param {Object} questionTracking - Tracking de la pregunta
 * @param {Object} userProfile - Perfil del usuario
 * @returns {number} Probabilidad 0-1
 */
export function estimateSuccessProbability(questionTracking, userProfile) {
  // Si nunca intentada, usar estadísticas del dominio/skill
  if (!questionTracking || questionTracking.attempts === 0) {
    return estimateFromDomainStats(questionTracking, userProfile);
  }
  
  // Si ya intentada, combinar historial + retrievability FSRS
  const historicalAccuracy = questionTracking.correct / questionTracking.attempts;
  const card = convertToFSRSCard(questionTracking);
  const retrievability = calculateRetrievability(card);
  
  // Peso 60% historial + 40% retrievability
  return (historicalAccuracy * 0.6) + (retrievability * 0.4);
}

/**
 * Estima probabilidad desde estadísticas de dominio/skill
 */
function estimateFromDomainStats(questionData, userProfile) {
  const domain = questionData?.domain;
  const skill = questionData?.skill;
  const difficulty = questionData?.difficulty || 'intermedio';
  
  // Obtener precisión del usuario en ese dominio/skill
  let domainAccuracy = 0.5; // Default
  
  if (domain && userProfile.domainStats?.[domain]) {
    domainAccuracy = userProfile.domainStats[domain].accuracy / 100;
  } else if (skill && userProfile.skillsMastery?.[skill]) {
    domainAccuracy = userProfile.skillsMastery[skill].accuracy / 100;
  } else {
    // Usar precisión general
    domainAccuracy = (userProfile.progress?.accuracyOverall || 50) / 100;
  }
  
  // Ajustar por dificultad de la pregunta
  const difficultyModifier = {
    'basico': 0.15,      // +15% para básicas
    'intermedio': 0,     // sin ajuste
    'avanzado': -0.15    // -15% para avanzadas
  };
  
  const modifier = difficultyModifier[difficulty] || 0;
  const estimated = domainAccuracy + modifier;
  
  return Math.max(0.1, Math.min(0.9, estimated));
}

/**
 * Determina zona de aprendizaje para una pregunta
 * @param {number} successProbability - Probabilidad de éxito 0-1
 * @returns {string} Zona de aprendizaje
 */
export function determineZone(successProbability) {
  if (successProbability > 0.7) return LearningZone.COMFORT;
  if (successProbability < 0.4) return LearningZone.FRUSTRATION;
  return LearningZone.ZPD;
}

/**
 * Selecciona preguntas óptimas de la ZPD
 * @param {Array} questions - Pool de preguntas disponibles
 * @param {Object} userProfile - Perfil del usuario
 * @param {Object} questionTracking - Tracking de todas las preguntas
 * @param {Object} options - Opciones de selección
 * @returns {Array} Preguntas seleccionadas ordenadas por optimalidad
 */
export function selectOptimalQuestions(questions, userProfile, questionTracking, options = {}) {
  const {
    targetZone = LearningZone.ZPD,
    count = 10,
    includeFringe = true, // Incluir preguntas en borde de ZPD
    diversity = true,     // Diversificar dominios/skills
    minProbability = 0.3,
    maxProbability = 0.8,
  } = options;
  
  // Calcular probabilidad y zona para cada pregunta
  const questionsWithMetrics = questions.map(question => {
    const tracking = questionTracking[question.id] || {};
    const probability = estimateSuccessProbability(
      { ...tracking, domain: question.dominio, skill: question.skill, difficulty: question.difficulty },
      userProfile
    );
    
    return {
      ...question,
      successProbability: probability,
      zone: determineZone(probability),
      tracking,
      optimalityScore: calculateOptimalityScore(probability, targetZone),
    };
  });
  
  // Filtrar por zona objetivo y rangos
  let candidates = questionsWithMetrics.filter(q => {
    if (targetZone === LearningZone.ZPD) {
      // ZPD core: 40-60%, fringe: 30-70%
      const min = includeFringe ? minProbability : 0.4;
      const max = includeFringe ? maxProbability : 0.6;
      return q.successProbability >= min && q.successProbability <= max;
    }
    return q.zone === targetZone;
  });
  
  // Si no hay suficientes, relajar filtro
  if (candidates.length < count) {
    console.log(`ZPD: Solo ${candidates.length} preguntas en zona objetivo, expandiendo...`);
    candidates = questionsWithMetrics.filter(q => 
      q.successProbability >= minProbability && q.successProbability <= maxProbability
    );
  }
  
  // Ordenar por optimalidad
  candidates.sort((a, b) => b.optimalityScore - a.optimalityScore);
  
  // Diversificar si solicitado
  if (diversity) {
    candidates = diversifySelection(candidates, count);
  } else {
    candidates = candidates.slice(0, count);
  }
  
  return candidates;
}

/**
 * Calcula score de optimalidad (0-100)
 * Máximo en centro de ZPD (50% probabilidad)
 */
function calculateOptimalityScore(probability, targetZone) {
  if (targetZone === LearningZone.ZPD) {
    // Máximo en 0.5, decae hacia extremos
    const distanceFrom50 = Math.abs(probability - 0.5);
    const score = 100 * (1 - (distanceFrom50 * 2));
    return Math.max(0, score);
  }
  
  if (targetZone === LearningZone.COMFORT) {
    // Máximo en 0.85
    return 100 * Math.max(0, 1 - Math.abs(probability - 0.85));
  }
  
  // FRUSTRATION - para diagnóstico
  return 100 * Math.max(0, 1 - Math.abs(probability - 0.3));
}

/**
 * Diversifica selección por dominios y skills
 */
function diversifySelection(candidates, count) {
  const selected = [];
  const domainCount = {};
  const skillCount = {};
  
  // Primera pasada: al menos una pregunta de cada dominio representado
  const domains = [...new Set(candidates.map(c => c.dominio))];
  domains.forEach(domain => {
    const fromDomain = candidates.find(c => 
      c.dominio === domain && !selected.includes(c)
    );
    if (fromDomain && selected.length < count) {
      selected.push(fromDomain);
      domainCount[domain] = (domainCount[domain] || 0) + 1;
      skillCount[fromDomain.skill] = (skillCount[fromDomain.skill] || 0) + 1;
    }
  });
  
  // Segunda pasada: completar con mejor balance
  const remaining = candidates.filter(c => !selected.includes(c));
  
  for (const candidate of remaining) {
    if (selected.length >= count) break;
    
    // Preferir dominios/skills menos representados
    const domainWeight = 1 / (domainCount[candidate.dominio] || 1);
    const skillWeight = 1 / (skillCount[candidate.skill] || 1);
    candidate.diversityScore = candidate.optimalityScore * (domainWeight + skillWeight);
  }
  
  remaining.sort((a, b) => (b.diversityScore || 0) - (a.diversityScore || 0));
  selected.push(...remaining.slice(0, count - selected.length));
  
  return selected;
}

/**
 * Recomienda próxima acción de aprendizaje basada en ZPD
 * @param {Object} userProfile - Perfil del usuario
 * @param {Object} questionTracking - Tracking de preguntas
 * @returns {Object} Recomendación
 */
export function recommendNextAction(userProfile, questionTracking) {
  const stats = analyzeUserZone(userProfile, questionTracking);
  
  // Si muchas en comfort zone → aumentar dificultad
  if (stats.comfortPercentage > 60) {
    return {
      action: 'INCREASE_DIFFICULTY',
      message: '¡Estás dominando el contenido actual! Es momento de desafiarte más.',
      targetZone: LearningZone.ZPD,
      reasoning: `${stats.comfortPercentage}% de preguntas están en tu zona de confort`,
    };
  }
  
  // Si muchas en frustration → reducir dificultad
  if (stats.frustrationPercentage > 40) {
    return {
      action: 'DECREASE_DIFFICULTY',
      message: 'Vamos a reforzar fundamentos antes de avanzar.',
      targetZone: LearningZone.COMFORT,
      reasoning: `${stats.frustrationPercentage}% de preguntas son muy desafiantes`,
    };
  }
  
  // Si balance bueno → mantener en ZPD
  return {
    action: 'MAINTAIN_ZPD',
    message: 'Continúa practicando, estás en la zona óptima de aprendizaje.',
    targetZone: LearningZone.ZPD,
    reasoning: `${stats.zpdPercentage}% de preguntas en zona de desarrollo proximal`,
  };
}

/**
 * Analiza distribución de zonas del usuario
 */
function analyzeUserZone(userProfile, questionTracking) {
  const zones = {
    comfort: 0,
    zpd: 0,
    frustration: 0,
  };
  
  Object.entries(questionTracking).forEach(([, tracking]) => {
    if (tracking.attempts === 0) return;
    
    const probability = tracking.correct / tracking.attempts;
    const zone = determineZone(probability);
    zones[zone]++;
  });
  
  const total = zones.comfort + zones.zpd + zones.frustration;
  
  return {
    total,
    comfortCount: zones.comfort,
    zpdCount: zones.zpd,
    frustrationCount: zones.frustration,
    comfortPercentage: total > 0 ? Math.round((zones.comfort / total) * 100) : 0,
    zpdPercentage: total > 0 ? Math.round((zones.zpd / total) * 100) : 0,
    frustrationPercentage: total > 0 ? Math.round((zones.frustration / total) * 100) : 0,
  };
}

/**
 * Sugiere nivel de dificultad óptimo para quiz adaptativo
 * @param {Object} userProfile - Perfil del usuario
 * @param {string} domain - Dominio específico (opcional)
 * @returns {string} Nivel de dificultad sugerido
 */
export function suggestDifficultyLevel(userProfile, domain = null) {
  let accuracy = userProfile.progress?.accuracyOverall || 50;
  
  // Si especifica dominio, usar precisión de ese dominio
  if (domain && userProfile.domainStats?.[domain]) {
    accuracy = userProfile.domainStats[domain].accuracy;
  }
  
  // Mapear precisión a dificultad
  if (accuracy >= 80) return 'avanzado';
  if (accuracy >= 60) return 'intermedio';
  return 'basico';
}

/**
 * Provee scaffolding adaptativo basado en zona
 * @param {string} zone - Zona de aprendizaje actual
 * @param {number} attempts - Intentos en la pregunta
 * @returns {Object} Nivel de ayuda sugerido
 */
export function provideAdaptiveScaffolding(zone, attempts) {
  // En comfort zone → sin ayuda
  if (zone === LearningZone.COMFORT) {
    return {
      level: 'none',
      message: null,
      hints: [],
    };
  }
  
  // En ZPD → hints progresivos
  if (zone === LearningZone.ZPD) {
    if (attempts === 0) {
      return { level: 'minimal', message: 'Piensa en los conceptos clave que aprendiste.' };
    }
    if (attempts === 1) {
      return { level: 'moderate', message: 'Pista: Revisa la relación entre las variables.' };
    }
    if (attempts >= 2) {
      return { level: 'substantial', message: 'Ayuda: Elimina las opciones claramente incorrectas primero.' };
    }
  }
  
  // En frustration → intervención directa
  if (zone === LearningZone.FRUSTRATION) {
    return {
      level: 'direct',
      message: 'Esta pregunta requiere conceptos que aún no dominas. Te recomiendo revisar el material de base primero.',
      suggestion: 'REVIEW_PREREQUISITES',
    };
  }
  
  return { level: 'none' };
}

/**
 * Exporta funciones principales para integración
 */
export const ZPDSelector = {
  estimateSuccessProbability,
  determineZone,
  selectOptimalQuestions,
  recommendNextAction,
  analyzeUserZone,
  suggestDifficultyLevel,
  provideAdaptiveScaffolding,
  LearningZone,
};

export default ZPDSelector;
