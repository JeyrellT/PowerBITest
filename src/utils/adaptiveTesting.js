// Sistema de Evaluación Adaptativa (Computerized Adaptive Testing - CAT)
// Basado en Item Response Theory (IRT) y algoritmos de búsqueda binaria

// ============================================================================
// 1. CONFIGURACIÓN DEL MOTOR ADAPTATIVO
// ============================================================================

export const CAT_CONFIG = {
  // Parámetros IRT
  discriminationParam: 1.5, // Qué tan bien discrimina la pregunta entre niveles
  guessingParam: 0.25,      // Probabilidad de adivinar (25% para 4 opciones)
  
  // Umbrales de confianza
  minQuestions: 10,         // Mínimo de preguntas antes de poder terminar
  maxQuestions: 30,         // Máximo de preguntas
  confidenceThreshold: 0.85, // 85% de confianza para terminar anticipadamente
  
  // Niveles de habilidad (theta)
  initialTheta: 0,          // Nivel inicial (0 = promedio)
  minTheta: -3,             // Nivel mínimo
  maxTheta: 3,              // Nivel máximo
  
  // Ajustes de dificultad
  difficultyMap: {
    'principiante': -1,
    'intermedio': 0,
    'avanzado': 1
  }
};

// ============================================================================
// 2. MODELO IRT - CÁLCULO DE PROBABILIDAD DE RESPUESTA CORRECTA
// ============================================================================

/**
 * Calcula la probabilidad de respuesta correcta usando el modelo 3PL de IRT
 * P(θ) = c + (1-c) / (1 + e^(-a(θ-b)))
 * 
 * @param {number} theta - Nivel de habilidad del estudiante
 * @param {number} difficulty - Dificultad de la pregunta (b)
 * @param {number} discrimination - Discriminación de la pregunta (a)
 * @param {number} guessing - Parámetro de adivinanza (c)
 */
export function calculateProbability(theta, difficulty, discrimination = 1.5, guessing = 0.25) {
  const exponent = -discrimination * (theta - difficulty);
  return guessing + ((1 - guessing) / (1 + Math.exp(exponent)));
}

// ============================================================================
// 3. ESTIMACIÓN DE HABILIDAD - MAXIMUM LIKELIHOOD ESTIMATION (MLE)
// ============================================================================

/**
 * Estima el nivel de habilidad del estudiante basado en sus respuestas
 * Usa el método de Newton-Raphson para encontrar el máximo likelihood
 */
export function estimateAbility(responses, questions) {
  const safeResponses = Array.isArray(responses) ? responses : [];
  const safeQuestions = Array.isArray(questions) ? questions : [];
  let theta = CAT_CONFIG.initialTheta;
  const maxIterations = 20;
  const tolerance = 0.001;
  
  for (let iter = 0; iter < maxIterations; iter++) {
    const currentTheta = theta; // Captura el valor actual para usar en el loop
    let firstDerivative = 0;
    let secondDerivative = 0;
    
    for (let index = 0; index < safeResponses.length; index++) {
      const response = safeResponses[index];
      const question = safeQuestions[index];

      if (!response || !question) continue;
      const difficulty = CAT_CONFIG.difficultyMap[question.nivel] || 0;
      const a = CAT_CONFIG.discriminationParam;
      const c = CAT_CONFIG.guessingParam;
      
      const p = calculateProbability(currentTheta, difficulty, a, c);
      const q = 1 - p;
      const pMinusC = p - c;
      const oneMinusC = 1 - c;
      
      // Primera derivada (información)
      if (response.isCorrect) {
        firstDerivative += (a * oneMinusC * q) / p;
      } else {
        firstDerivative -= (a * oneMinusC * pMinusC) / (c * q);
      }
      
      // Segunda derivativa
      const w = (a * a * oneMinusC * pMinusC * q) / (p * p);
      secondDerivative -= w;
    }
  const safeDenominator = Math.abs(secondDerivative) > 0 ? Math.abs(secondDerivative) : 1;
  // Newton-Raphson update
  const delta = firstDerivative / safeDenominator;
    theta += delta;
    
    // Límites
    theta = Math.max(CAT_CONFIG.minTheta, Math.min(CAT_CONFIG.maxTheta, theta));
    
    // Convergencia
    if (Math.abs(delta) < tolerance) break;
  }
  
  return theta;
}

// ============================================================================
// 4. SELECCIÓN DE SIGUIENTE PREGUNTA - MAXIMUM INFORMATION
// ============================================================================

/**
 * Selecciona la siguiente pregunta que maximiza la información
 * basándose en el nivel de habilidad estimado actual
 */
export function selectNextQuestion(theta, availableQuestions, answeredIds) {
  if (!Array.isArray(availableQuestions) || availableQuestions.length === 0) {
    return null;
  }

  // Filtrar preguntas ya respondidas
  const unanswered = availableQuestions.filter(q => q && !answeredIds.has(q.id));
  
  if (unanswered.length === 0) return null;
  
  // Calcular información de Fisher para cada pregunta
  let maxInfo = -Infinity;
  let bestQuestion = null;
  
  unanswered.forEach(question => {
    if (!question) return;
    const difficulty = CAT_CONFIG.difficultyMap[question.nivel] || 0;
    const a = CAT_CONFIG.discriminationParam;
    const c = CAT_CONFIG.guessingParam;
    
    const p = calculateProbability(theta, difficulty, a, c);
    const q = 1 - p;
    
    // Información de Fisher
    const info = (a * a * q * ((p - c) / (1 - c)) ** 2) / p;
    
    if (info > maxInfo) {
      maxInfo = info;
      bestQuestion = question;
    }
  });
  
  return bestQuestion;
}

// ============================================================================
// 5. CÁLCULO DE ERROR ESTÁNDAR Y CONFIANZA
// ============================================================================

/**
 * Calcula el error estándar de la estimación de habilidad
 */
export function calculateStandardError(responses, questions, theta) {
  let totalInfo = 0;
  const safeResponses = Array.isArray(responses) ? responses : [];
  const safeQuestions = Array.isArray(questions) ? questions : [];
  
  safeResponses.forEach((response, index) => {
    const question = safeQuestions[index];
    if (!response || !question) return;
    const difficulty = CAT_CONFIG.difficultyMap[question.nivel] || 0;
    const a = CAT_CONFIG.discriminationParam;
    const c = CAT_CONFIG.guessingParam;
    
    const p = calculateProbability(theta, difficulty, a, c);
    const q = 1 - p;
    
    // Información acumulada
    if (p > 0) {
      const info = (a * a * q * ((p - c) / (1 - c)) ** 2) / p;
      totalInfo += info;
    }
  });
  
  return totalInfo > 0 ? 1 / Math.sqrt(totalInfo) : Infinity;
}

/**
 * Determina si se puede terminar el test adaptativo
 */
export function canTerminateTest(responses, questions, theta) {
  const numQuestions = responses.length;
  
  // Mínimo de preguntas
  if (numQuestions < CAT_CONFIG.minQuestions) return false;
  
  // Máximo de preguntas alcanzado
  if (numQuestions >= CAT_CONFIG.maxQuestions) return true;
  
  // Calcular confianza
  const se = calculateStandardError(responses, questions, theta);
  const confidence = 1 - (2 * se); // Aproximación simple
  
  return confidence >= CAT_CONFIG.confidenceThreshold;
}

// ============================================================================
// 6. CONVERSIÓN DE THETA A PUNTUACIÓN Y NIVEL
// ============================================================================

/**
 * Convierte el valor theta a una puntuación de 0-100
 */
export function thetaToScore(theta) {
  // Transformación logística: mapear [-3, 3] a [0, 100]
  const normalized = (theta - CAT_CONFIG.minTheta) / (CAT_CONFIG.maxTheta - CAT_CONFIG.minTheta);
  return Math.round(normalized * 100);
}

/**
 * Determina el nivel de competencia basado en theta
 */
export function thetaToLevel(theta) {
  if (theta < -0.5) return 'principiante';
  if (theta < 0.5) return 'intermedio';
  return 'avanzado';
}

/**
 * Proporciona recomendaciones basadas en el nivel estimado
 */
export function getRecommendations(theta, domainPerformance) {
  const level = thetaToLevel(theta);
  const score = thetaToScore(theta);
  const baseError = calculateStandardError([], [], theta);
  const confidence = Number.isFinite(baseError)
    ? Math.max(0, Math.min(1, 1 - baseError))
    : 0;
  
  // Identificar áreas débiles
  const weakDomains = Object.entries(domainPerformance)
    .filter(([_, perf]) => perf.accuracy < 0.6)
    .sort((a, b) => a[1].accuracy - b[1].accuracy)
    .slice(0, 3)
    .map(([domain, _]) => domain);
  
  // Identificar áreas fuertes
  const strongDomains = Object.entries(domainPerformance)
    .filter(([_, perf]) => perf.accuracy >= 0.8)
    .map(([domain, _]) => domain);
  
  return {
    estimatedLevel: level,
    estimatedScore: score,
    confidence,
    weakDomains,
    strongDomains,
    nextSteps: generateNextSteps(level, weakDomains),
    studyPlan: generateStudyPlan(level, weakDomains, strongDomains)
  };
}

function generateNextSteps(level, weakDomains) {
  const steps = [];
  
  if (level === 'principiante') {
    steps.push('Completar módulos de Microsoft Learn para fundamentos de Power BI');
    steps.push('Practicar con datasets de ejemplo para familiarizarte con la interfaz');
  } else if (level === 'intermedio') {
    steps.push('Profundizar en DAX y modelado de datos avanzado');
    steps.push('Realizar proyectos prácticos end-to-end');
  } else {
    steps.push('Prepararte para el examen PL-300 con simuladores oficiales');
    steps.push('Explorar escenarios complejos y optimización de rendimiento');
  }
  
  if (weakDomains.length > 0) {
    steps.push(`Enfocarte especialmente en: ${weakDomains.join(', ')}`);
  }
  
  return steps;
}

function generateStudyPlan(level, weakDomains, strongDomains) {
  return {
    priority: 'high',
    focusAreas: weakDomains,
    reinforceAreas: strongDomains,
    estimatedHours: level === 'principiante' ? 40 : level === 'intermedio' ? 25 : 15,
    resources: [
      'Microsoft Learn PL-300 Learning Path',
      'SQLBI Mastering DAX',
      'Maven Analytics Power BI Projects'
    ]
  };
}

// ============================================================================
// 7. CONTROLADOR PRINCIPAL DE CAT
// ============================================================================

export class AdaptiveTestController {
  constructor(questionBank) {
    this.questionBank = Array.isArray(questionBank) ? questionBank : [];
    this.responses = [];
    this.questions = [];
    this.answeredIds = new Set();
    this.currentTheta = CAT_CONFIG.initialTheta;
    this.domainPerformance = {};
  }
  
  /**
   * Obtiene la siguiente pregunta adaptativa
   */
  getNextQuestion() {
    if (!Array.isArray(this.questionBank) || this.questionBank.length === 0) {
      return null;
    }

    const availableQuestions = this.questionBank.filter((q) => q && !this.answeredIds.has(q.id));

    if (availableQuestions.length === 0) {
      return null;
    }

    // Si no hay respuestas, empezar con nivel medio
    if (this.responses.length === 0) {
      const mediumQuestions = availableQuestions.filter(q => q.nivel === 'intermedio');
      const seedPool = mediumQuestions.length > 0 ? mediumQuestions : availableQuestions;
      const randomIndex = Math.floor(Math.random() * seedPool.length);
      return seedPool[randomIndex] || null;
    }
    
    // Actualizar estimación de habilidad
    this.currentTheta = estimateAbility(this.responses, this.questions);
    
    // Seleccionar siguiente pregunta que maximice información
    return selectNextQuestion(this.currentTheta, availableQuestions, this.answeredIds);
  }
  
  /**
   * Registra una respuesta
   */
  recordResponse(question, selectedAnswer) {
    if (!question) {
      return;
    }
    const isCorrect = selectedAnswer === question.respuestaCorrecta;
    
    this.responses.push({
      questionId: question.id,
      isCorrect,
      timestamp: Date.now()
    });
    
    this.questions.push(question);
    this.answeredIds.add(question.id);
    
    // Actualizar rendimiento por dominio
    if (!this.domainPerformance[question.dominio]) {
      this.domainPerformance[question.dominio] = {
        total: 0,
        correct: 0,
        accuracy: 0
      };
    }
    
    this.domainPerformance[question.dominio].total++;
    if (isCorrect) {
      this.domainPerformance[question.dominio].correct++;
    }
    this.domainPerformance[question.dominio].accuracy = 
      this.domainPerformance[question.dominio].correct / 
      this.domainPerformance[question.dominio].total;
  }
  
  /**
   * Verifica si el test puede terminar
   */
  canFinish() {
    return canTerminateTest(this.responses, this.questions, this.currentTheta);
  }
  
  /**
   * Obtiene resultados finales
   */
  getResults() {
    this.currentTheta = estimateAbility(this.responses, this.questions);
    const se = calculateStandardError(this.responses, this.questions, this.currentTheta);
    
    return {
      theta: this.currentTheta,
      score: thetaToScore(this.currentTheta),
      level: thetaToLevel(this.currentTheta),
      standardError: se,
      confidence: 1 - (2 * se),
      questionsAnswered: this.responses.length,
      domainPerformance: this.domainPerformance,
      recommendations: getRecommendations(this.currentTheta, this.domainPerformance)
    };
  }
  
  /**
   * Obtiene estado actual del test
   */
  getProgress() {
    return {
      questionsAnswered: this.responses.length,
      estimatedTheta: this.currentTheta,
      estimatedLevel: thetaToLevel(this.currentTheta),
      canTerminate: this.canFinish(),
      progressPercentage: Math.min((this.responses.length / CAT_CONFIG.maxQuestions) * 100, 100)
    };
  }
}
