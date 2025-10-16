/**
 * FSRS (Free Spaced Repetition Scheduler) Implementation
 * 
 * Mejora científica sobre SM-2 con:
 * - 20-30% reducción en número de reviews
 * - Eliminación de "ease hell"
 * - Mejor manejo de reviews retrasadas
 * - Parámetros adaptativos por usuario
 * 
 * Basado en Three Component Model:
 * - Difficulty: complejidad inherente (1-10)
 * - Stability: días para decay 100% → 90%
 * - Retrievability: probabilidad de recordar
 */

import { fsrs, createEmptyCard, Rating, generatorParameters, State } from 'ts-fsrs';

/**
 * Inicializa el scheduler FSRS con parámetros optimizados
 * @param {Object} userParams - Parámetros personalizados del usuario (opcional)
 * @returns {Object} Scheduler FSRS configurado
 */
export function createFSRSScheduler(userParams = {}) {
  // Parámetros por defecto optimizados para PL-300
  const params = generatorParameters({
    // Retención objetivo (80% recomendado para certificaciones)
    request_retention: userParams.targetRetention || 0.80,
    
    // Máximo intervalo (180 días para certificación de 6 meses)
    maximum_interval: userParams.maxInterval || 180,
    
    // Pesos FSRS (19 parámetros) - se optimizan con datos del usuario
    w: userParams.weights || undefined,
    
    // Habilitar fuzz para variabilidad (evita patterns predecibles)
    enable_fuzz: true,
  });

  return fsrs(params);
}

/**
 * Convierte tracking de pregunta al formato FSRS Card
 * @param {Object} questionTracking - Datos de tracking existentes
 * @returns {Object} FSRS Card
 */
export function convertToFSRSCard(questionTracking) {
  if (!questionTracking || questionTracking.attempts === 0) {
    return createEmptyCard();
  }

  // Mapear estado existente a FSRS
  
  return {
    // Estado de la tarjeta
    state: determineCardState(questionTracking),
    
    // Dificultad calculada (1-10)
    difficulty: calculateDifficulty(questionTracking),
    
    // Estabilidad (días hasta 90% de recordar)
    stability: calculateStability(questionTracking),
    
    // Fechas
    due: questionTracking.nextReviewDate || new Date(),
    last_review: questionTracking.lastAttempt || null,
    
    // Intervalo actual
    scheduled_days: questionTracking.reviewInterval || 0,
    
    // Contadores
    reps: questionTracking.attempts,
    lapses: questionTracking.attempts - questionTracking.correct,
    elapsed_days: calculateElapsedDays(questionTracking.lastAttempt),
  };
}

/**
 * Determina el estado de la tarjeta FSRS
 */
function determineCardState(tracking) {
  if (tracking.attempts === 0) return State.New;
  if (tracking.markedForReview) return State.Relearning;
  
  const accuracy = tracking.correct / tracking.attempts;
  if (accuracy >= 0.8 && tracking.attempts >= 3) return State.Review;
  
  return State.Learning;
}

/**
 * Calcula dificultad inherente (1-10)
 * Más bajo = más fácil, más alto = más difícil
 */
function calculateDifficulty(tracking) {
  const accuracy = tracking.correct / tracking.attempts;
  const avgTime = tracking.averageTime || 30;
  
  // Combinar precisión y tiempo
  const accuracyFactor = (1 - accuracy) * 6; // 0-6
  const timeFactor = Math.min(avgTime / 15, 4); // 0-4
  
  return Math.max(1, Math.min(10, accuracyFactor + timeFactor));
}

/**
 * Calcula estabilidad (días para decay a 90%)
 */
function calculateStability(tracking) {
  const accuracy = tracking.correct / tracking.attempts;
  
  // Si alta precisión y múltiples intentos → alta estabilidad
  if (accuracy >= 0.9 && tracking.attempts >= 5) {
    return 30 + (tracking.attempts * 2);
  }
  
  // Si baja precisión → baja estabilidad
  if (accuracy < 0.6) {
    return Math.max(1, tracking.attempts * 0.5);
  }
  
  // Caso promedio
  return 5 + (tracking.attempts * accuracy * 2);
}

/**
 * Calcula días transcurridos desde último review
 */
function calculateElapsedDays(lastAttempt) {
  if (!lastAttempt) return 0;
  
  const now = new Date();
  const last = new Date(lastAttempt);
  const diffMs = now - last;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Procesa respuesta del usuario y calcula próximo review
 * @param {Object} scheduler - Scheduler FSRS
 * @param {Object} card - Tarjeta FSRS actual
 * @param {boolean} isCorrect - Si respondió correctamente
 * @param {number} timeSpent - Tiempo en segundos
 * @returns {Object} Nuevo estado y fecha de review
 */
export function scheduleNextReview(scheduler, card, isCorrect, timeSpent) {
  // Mapear respuesta a rating FSRS
  const rating = determineRating(isCorrect, timeSpent);
  
  // Calcular siguiente review
  const recordLog = scheduler.repeat(card, new Date());
  const selectedRecord = recordLog[rating];
  
  return {
    // Nuevo estado de la tarjeta
    card: selectedRecord.card,
    
    // Fecha de próximo review
    nextReviewDate: selectedRecord.card.due,
    
    // Intervalo en días
    reviewInterval: selectedRecord.card.scheduled_days,
    
    // Estado FSRS
    state: selectedRecord.card.state,
    
    // Métricas
    difficulty: selectedRecord.card.difficulty,
    stability: selectedRecord.card.stability,
    
    // Log para analytics
    log: selectedRecord.log,
  };
}

/**
 * Determina rating FSRS basado en rendimiento
 * 1 = Again (olvidó)
 * 2 = Hard (difícil recordar)
 * 3 = Good (recordó bien)
 * 4 = Easy (muy fácil)
 */
function determineRating(isCorrect, timeSpent) {
  if (!isCorrect) return Rating.Again;
  
  // Si correcto pero tardó mucho → Hard
  if (timeSpent > 45) return Rating.Hard;
  
  // Si correcto y tiempo normal → Good
  if (timeSpent > 15) return Rating.Good;
  
  // Si correcto y muy rápido → Easy
  return Rating.Easy;
}

/**
 * Calcula retrievability (probabilidad de recordar)
 * R(t) = e^(-t/(S*9))
 * @param {Object} card - Tarjeta FSRS
 * @returns {number} Probabilidad 0-1
 */
export function calculateRetrievability(card) {
  const elapsedDays = calculateElapsedDays(card.last_review);
  const stability = card.stability;
  
  // Fórmula FSRS
  const retrievability = Math.exp(-elapsedDays / (stability * 9));
  
  return Math.max(0, Math.min(1, retrievability));
}

/**
 * Optimiza parámetros FSRS con datos del usuario
 * Requiere al menos 100 reviews para ser efectivo
 * @param {Array} reviewHistory - Historial de reviews [{card, rating, timestamp}]
 * @returns {Array} Pesos optimizados (19 parámetros)
 */
export function optimizeFSRSParameters(reviewHistory) {
  // TODO: Implementar optimización con gradient descent
  // Por ahora retorna parámetros por defecto
  // Requiere mínimo 100 reviews para ser efectivo
  
  if (reviewHistory.length < 100) {
    console.log('FSRS: Necesitas al menos 100 reviews para optimización');
    return null;
  }
  
  // Aquí iría el algoritmo de optimización
  // Por ahora usamos defaults
  return null;
}

/**
 * Obtiene preguntas listas para review (retrievability < 0.9)
 * @param {Object} questionTracking - Objeto con tracking de todas las preguntas
 * @param {Object} scheduler - Scheduler FSRS
 * @returns {Array} IDs de preguntas listas para review
 */
export function getQuestionsForReview(questionTracking, scheduler) {
  const now = new Date();
  const readyForReview = [];
  
  Object.entries(questionTracking).forEach(([questionId, tracking]) => {
    const card = convertToFSRSCard(tracking);
    const retrievability = calculateRetrievability(card);
    
    // Si probabilidad de recordar < 90% → review
    if (retrievability < 0.9 && card.due <= now) {
      readyForReview.push({
        questionId,
        retrievability,
        difficulty: card.difficulty,
        stability: card.stability,
        dueDate: card.due,
        priority: 1 - retrievability, // Menor retrievability = mayor prioridad
      });
    }
  });
  
  // Ordenar por prioridad (menor retrievability primero)
  return readyForReview.sort((a, b) => b.priority - a.priority);
}

/**
 * Exporta scheduler pre-configurado por defecto
 */
export const defaultScheduler = createFSRSScheduler();

/**
 * Helper para integración con sistema existente
 */
export const FSRSIntegration = {
  /**
   * Actualiza tracking existente con datos FSRS
   */
  updateTracking(currentTracking, isCorrect, timeSpent, scheduler = defaultScheduler) {
    const card = convertToFSRSCard(currentTracking);
    const nextReview = scheduleNextReview(scheduler, card, isCorrect, timeSpent);
    
    return {
      ...currentTracking,
      
      // Actualizar con FSRS
      nextReviewDate: nextReview.nextReviewDate,
      reviewInterval: nextReview.reviewInterval,
      
      // Agregar métricas FSRS
      fsrs: {
        difficulty: nextReview.difficulty,
        stability: nextReview.stability,
        state: nextReview.state,
        retrievability: calculateRetrievability(nextReview.card),
      },
      
      // Mantener tracking original
      attempts: currentTracking.attempts + 1,
      correct: currentTracking.correct + (isCorrect ? 1 : 0),
      lastAttempt: new Date().toISOString(),
      averageTime: calculateNewAverage(
        currentTracking.averageTime,
        timeSpent,
        currentTracking.attempts
      ),
    };
  },
  
  /**
   * Verifica si pregunta está lista para review
   */
  isReadyForReview(tracking) {
    if (!tracking || !tracking.nextReviewDate) return false;
    
    const card = convertToFSRSCard(tracking);
    const retrievability = calculateRetrievability(card);
    
    return retrievability < 0.9 && new Date(tracking.nextReviewDate) <= new Date();
  },
  
  /**
   * Obtiene estadísticas FSRS del usuario
   */
  getUserStats(questionTracking) {
    const cards = Object.values(questionTracking).map(convertToFSRSCard);
    
    return {
      totalCards: cards.length,
      newCards: cards.filter(c => c.state === State.New).length,
      learningCards: cards.filter(c => c.state === State.Learning).length,
      reviewCards: cards.filter(c => c.state === State.Review).length,
      averageDifficulty: average(cards.map(c => c.difficulty)),
      averageStability: average(cards.map(c => c.stability)),
      averageRetrievability: average(cards.map(c => calculateRetrievability(c))),
    };
  },
};

// Helpers
function calculateNewAverage(currentAvg, newValue, count) {
  if (!currentAvg || count === 0) return newValue;
  return (currentAvg * count + newValue) / (count + 1);
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

export default FSRSIntegration;
