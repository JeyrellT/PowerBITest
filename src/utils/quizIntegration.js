/**
 * 🎯 INTEGRACIÓN QUIZ - HELPER
 * 
 * Facilita la integración del sistema de tracking y scoring con QuizScreen
 * 
 * ✅ REFACTORIZADO: Este helper ahora funciona con el contexto centralizado.
 * Ya no importa directamente progressManager, questionTracker ni profileImpact.
 * Las funciones necesitan recibir las dependencias del contexto.
 * 
 * Uso:
 * ```js
 * const contextFunctions = useCxCProgress();
 * const quizHelper = new QuizIntegrationHelper(contextFunctions);
 * ```
 */

import { ProfileImpactCalculator } from './profileImpact';

// ============================================================================
// SELECTOR INTELIGENTE DE PREGUNTAS (Extraído de questionTracker)
// ============================================================================

/**
 * Selecciona preguntas para un quiz basado en algoritmo inteligente
 * @param {Array} availableQuestions - Preguntas disponibles
 * @param {number} count - Cantidad de preguntas a seleccionar
 * @param {Object} tracking - Tracking de preguntas desde el contexto
 * @param {Object} config - Configuración de selección
 */
export const selectIntelligentQuestions = (availableQuestions, count, tracking = {}, config = {}) => {
  const {
    prioritizeWeak = true,
    includeNew = true,
    reviewDueQuestions = true,
    maxRetired = 0.1
  } = config;

  const today = new Date();

  // Clasificar preguntas
  const classified = {
    dueForReview: [],
    weak: [],
    learning: [],
    reviewing: [],
    new: [],
    mastered: [],
    retired: []
  };

  availableQuestions.forEach(q => {
    const questionTracking = tracking[q.id] || { status: 'new', confidenceLevel: 0 };
    const questionData = { ...q, tracking: questionTracking };

    // Verificar si necesita revisión
    if (questionTracking.nextReviewDate) {
      const reviewDate = new Date(questionTracking.nextReviewDate);
      if (reviewDate <= today) {
        classified.dueForReview.push(questionData);
        return;
      }
    }

    // Clasificar por estado
    switch (questionTracking.status) {
      case 'new':
        classified.new.push(questionData);
        break;
      case 'learning':
        if (questionTracking.confidenceLevel <= 2) {
          classified.weak.push(questionData);
        } else {
          classified.learning.push(questionData);
        }
        break;
      case 'reviewing':
        classified.reviewing.push(questionData);
        break;
      case 'mastered':
        classified.mastered.push(questionData);
        break;
      case 'retired':
        classified.retired.push(questionData);
        break;
      default:
        classified.new.push(questionData);
    }
  });

  // Construir pool de preguntas con prioridades
  const selected = [];
  const maxRetiredCount = Math.floor(count * maxRetired);

  // 1. Preguntas que necesitan revisión
  if (reviewDueQuestions && classified.dueForReview.length > 0) {
    const reviewCount = Math.min(classified.dueForReview.length, Math.ceil(count * 0.3));
    selected.push(...randomSample(classified.dueForReview, reviewCount));
  }

  // 2. Preguntas débiles
  if (prioritizeWeak && classified.weak.length > 0 && selected.length < count) {
    const weakCount = Math.min(classified.weak.length, Math.ceil(count * 0.3) - selected.length);
    selected.push(...randomSample(classified.weak, weakCount));
  }

  // 3. Preguntas en aprendizaje
  if (classified.learning.length > 0 && selected.length < count) {
    selected.push(...randomSample(classified.learning, count - selected.length));
  }

  // 4. Preguntas nuevas
  if (includeNew && classified.new.length > 0 && selected.length < count) {
    selected.push(...randomSample(classified.new, count - selected.length));
  }

  // 5. Preguntas en revisión
  if (classified.reviewing.length > 0 && selected.length < count) {
    selected.push(...randomSample(classified.reviewing, count - selected.length));
  }

  // 6. Preguntas dominadas
  if (classified.mastered.length > 0 && selected.length < count) {
    selected.push(...randomSample(classified.mastered, count - selected.length));
  }

  // 7. Preguntas retiradas (solo si es necesario)
  if (classified.retired.length > 0 && selected.length < count) {
    const retiredCount = Math.min(classified.retired.length, Math.min(maxRetiredCount, count - selected.length));
    selected.push(...randomSample(classified.retired, retiredCount));
  }

  return shuffle(selected.map(q => ({ ...q, tracking: undefined }))).slice(0, count);
};

const randomSample = (array, count) => {
  const shuffled = shuffle([...array]);
  return shuffled.slice(0, Math.min(count, array.length));
};

const shuffle = (array) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// ============================================================================
// CLASE HELPER DE INTEGRACIÓN (Refactorizada)
// ============================================================================

export class QuizIntegrationHelper {
  /**
   * Constructor con inyección de dependencias
   * @param {Object} contextFunctions - Funciones del CxCProgressContext
   */
  constructor(contextFunctions = {}) {
    // Recibe las funciones del contexto como dependencias
    this.recordQuestionAttempt = contextFunctions.recordQuestionAttempt || (() => {});
    this.getAllQuestionsTracking = contextFunctions.getAllQuestionsTracking || (() => ({}));
    this.getQuestionTracking = contextFunctions.getQuestionTracking || (() => ({ totalAttempts: 0 }));
    this.getQuestionTrackingStats = contextFunctions.getQuestionTrackingStats || (() => ({ total: 0 }));
    this.addPoints = contextFunctions.addPoints || (() => {});
    this.addXP = contextFunctions.addXP || (() => {});
    
    // ✅ Crear instancia de ProfileImpactCalculator con las mismas funciones del contexto
    this.impact = new ProfileImpactCalculator({
      getQuestionTracking: contextFunctions.getQuestionTracking,
      getAllQuestionsTracking: contextFunctions.getAllQuestionsTracking,
      getQuestionTrackingStats: contextFunctions.getQuestionTrackingStats
    });
    
    this.currentQuizSession = null;
  }

  /**
   * 🎬 INICIA UNA NUEVA SESIÓN DE QUIZ
   */
  startQuizSession(config = {}) {
    const {
      questionCount = 10,
      difficulty = null,
      domain = null,
      mode = 'adaptive' // 'adaptive', 'practice', 'exam'
    } = config;

    this.currentQuizSession = {
      startTime: Date.now(),
      mode,
      config: { questionCount, difficulty, domain },
      results: [],
      currentQuestionIndex: 0,
      questionStartTime: null
    };

    return this.currentQuizSession;
  }

  /**
   * 📝 SELECCIONA PREGUNTAS PARA EL QUIZ
   */
  selectQuestionsForQuiz(availableQuestions, count = 10, filters = {}) {
    const { difficulty, domain } = filters;

    // Filtrar por dominio o dificultad si es necesario
    let filteredQuestions = availableQuestions;

    if (domain) {
      filteredQuestions = filteredQuestions.filter(q => q.dominio === domain);
    }

    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.nivel === difficulty);
    }

    // Obtener tracking del contexto
    const tracking = this.getAllQuestionsTracking();

    // Usar el selector inteligente
    const selectedQuestions = selectIntelligentQuestions(filteredQuestions, count, tracking);

    // Guardar en sesión
    if (this.currentQuizSession) {
      this.currentQuizSession.questions = selectedQuestions;
      this.currentQuizSession.totalQuestions = selectedQuestions.length;
    }

    return selectedQuestions;
  }

  /**
   * ▶️ MARCA EL INICIO DE UNA PREGUNTA
   */
  startQuestion(questionIndex) {
    if (!this.currentQuizSession) {
      console.warn('No hay sesión de quiz activa');
      return;
    }

    this.currentQuizSession.currentQuestionIndex = questionIndex;
    this.currentQuizSession.questionStartTime = Date.now();
  }

  /**
   * ✅ PROCESA LA RESPUESTA DEL USUARIO
   */
  processAnswer(question, userAnswer) {
    if (!this.currentQuizSession) {
      console.error('No hay sesión de quiz activa');
      return null;
    }

    // Calcular tiempo transcurrido
    const timeSpent = this.currentQuizSession.questionStartTime
      ? Math.floor((Date.now() - this.currentQuizSession.questionStartTime) / 1000)
      : 60; // Default 60s si no hay tiempo

    const isCorrect = userAnswer === question.respuestaCorrecta;

    // Calcular puntos base
    const basePoints = question.nivel === 'avanzado' ? 30 : question.nivel === 'intermedio' ? 20 : 10;
    const xp = Math.round(basePoints * 1.5);

    // Registrar intento en el contexto
    this.recordQuestionAttempt(
      question.id,
      isCorrect,
      timeSpent,
      {
        domain: question.dominio,
        level: question.nivel,
        subdominio: question.subdominio || 'otros',
        format: question.formato || 'opcion-multiple'
      }
    );

    // Si es correcta, agregar puntos
    if (isCorrect) {
      this.addPoints(basePoints);
      this.addXP(xp);
    }

    // Calcular impacto en perfil
    const impactResult = this.impact.calculateImpact({ isCorrect, basePoints }, question);

    // Crear resultado completo
    const fullResult = {
      question,
      userAnswer,
      correctAnswer: question.respuestaCorrecta,
      isCorrect,
      timeSpent,
      points: basePoints,
      xp,
      impact: impactResult,
      timestamp: new Date().toISOString()
    };

    // Guardar en sesión
    this.currentQuizSession.results.push(fullResult);

    return fullResult;
  }

  /**
   * 📊 FINALIZA EL QUIZ Y GENERA RESUMEN
   */
  endQuizSession() {
    if (!this.currentQuizSession) {
      console.error('No hay sesión de quiz activa');
      return null;
    }

    const session = this.currentQuizSession;
    const endTime = Date.now();
    const duration = Math.floor((endTime - session.startTime) / 1000);

    // Calcular estadísticas de la sesión
    const correctAnswers = session.results.filter(r => r.isCorrect).length;
    const incorrectAnswers = session.results.length - correctAnswers;
    const totalPoints = session.results.reduce((sum, r) => sum + (r.points || 0), 0);
    const totalXP = session.results.reduce((sum, r) => sum + (r.xp || 0), 0);
    const accuracy = session.results.length > 0 ? (correctAnswers / session.results.length) * 100 : 0;

    // Obtener impacto global actualizado
    const globalImpact = this.impact.calculateGlobalCompetencyChange();

    // Obtener preparación para examen
    const examReadiness = this.impact.calculateExamReadiness();

    // Crear resumen completo
    const summary = {
      // Info de sesión
      mode: session.mode,
      duration,
      questionsAnswered: session.results.length,
      totalQuestions: session.totalQuestions,

      // Puntuación
      totalPoints,
      totalXP,
      averagePointsPerQuestion: session.results.length > 0 ? totalPoints / session.results.length : 0,

      // Precisión
      accuracy: Math.round(accuracy * 10) / 10,
      correctAnswers,
      incorrectAnswers,

      // Racha
      bestStreak: this.calculateBestStreak(session.results),

      // Impacto
      globalCompetency: globalImpact,
      examReadiness,

      // Detalles por dominio
      domainBreakdown: this.calculateDomainBreakdown(session.results),

      // Detalles por nivel
      levelBreakdown: this.calculateLevelBreakdown(session.results),

      // Resultados individuales
      results: session.results,

      // Recomendaciones
      recommendations: this.generateSessionRecommendations(session.results, examReadiness)
    };

    // Limpiar sesión
    this.currentQuizSession = null;

    return summary;
  }

  /**
   * 🔥 Calcula la mejor racha de la sesión
   */
  calculateBestStreak(results) {
    let currentStreak = 0;
    let bestStreak = 0;

    results.forEach(result => {
      if (result.isCorrect) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return bestStreak;
  }

  /**
   * 📊 Calcula breakdown por dominio
   */
  calculateDomainBreakdown(results) {
    const breakdown = {};

    results.forEach(result => {
      const domain = result.question.dominio || 'General';
      
      if (!breakdown[domain]) {
        breakdown[domain] = {
          total: 0,
          correct: 0,
          incorrect: 0,
          points: 0,
          averageTime: 0
        };
      }

      breakdown[domain].total++;
      if (result.isCorrect) {
        breakdown[domain].correct++;
      } else {
        breakdown[domain].incorrect++;
      }
      breakdown[domain].points += result.points || 0;
      breakdown[domain].averageTime += result.timeSpent;
    });

    // Calcular promedios
    Object.keys(breakdown).forEach(domain => {
      const data = breakdown[domain];
      data.accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
      data.averageTime = data.total > 0 ? Math.floor(data.averageTime / data.total) : 0;
      data.accuracy = Math.round(data.accuracy * 10) / 10;
    });

    return breakdown;
  }

  /**
   * 📈 Calcula breakdown por nivel
   */
  calculateLevelBreakdown(results) {
    const breakdown = {
      principiante: { total: 0, correct: 0, points: 0 },
      intermedio: { total: 0, correct: 0, points: 0 },
      avanzado: { total: 0, correct: 0, points: 0 }
    };

    results.forEach(result => {
      const level = result.question.nivel || 'intermedio';
      
      if (breakdown[level]) {
        breakdown[level].total++;
        if (result.isCorrect) {
          breakdown[level].correct++;
        }
        breakdown[level].points += result.points || 0;
      }
    });

    // Calcular precisión
    Object.keys(breakdown).forEach(level => {
      const data = breakdown[level];
      data.accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0;
      data.accuracy = Math.round(data.accuracy * 10) / 10;
    });

    return breakdown;
  }

  /**
   * 💡 Genera recomendaciones de sesión
   */
  generateSessionRecommendations(results, examReadiness) {
    const recommendations = [];

    // Analizar dominios débiles
    const domainBreakdown = this.calculateDomainBreakdown(results);
    const weakDomains = Object.entries(domainBreakdown)
      .filter(([_, data]) => data.accuracy < 50)
      .sort((a, b) => a[1].accuracy - b[1].accuracy)
      .slice(0, 2);

    if (weakDomains.length > 0) {
      weakDomains.forEach(([domain, data]) => {
        recommendations.push({
          type: 'warning',
          icon: '⚠️',
          title: `Área de oportunidad: ${domain}`,
          message: `Solo ${data.accuracy}% de precisión. Dedica más tiempo a este dominio.`,
          action: `Estudiar ${domain}`
        });
      });
    }

    // Analizar racha
    const bestStreak = this.calculateBestStreak(results);
    if (bestStreak >= 5) {
      recommendations.push({
        type: 'success',
        icon: '🔥',
        title: `¡Racha de ${bestStreak}!`,
        message: 'Excelente consistencia. Mantén este ritmo.',
        action: null
      });
    }

    // Analizar preparación
    if (!examReadiness.ready) {
      recommendations.push({
        type: 'info',
        icon: '📚',
        title: 'Continúa practicando',
        message: examReadiness.message,
        action: 'Ver plan de estudio'
      });
    } else if (examReadiness.confidence === 'high') {
      recommendations.push({
        type: 'success',
        icon: '🎯',
        title: '¡Estás listo!',
        message: examReadiness.message,
        action: 'Simular examen'
      });
    }

    // Analizar tiempo
    const avgTime = results.reduce((sum, r) => sum + r.timeSpent, 0) / results.length;
    if (avgTime > 90) {
      recommendations.push({
        type: 'tip',
        icon: '⏱️',
        title: 'Mejora tu velocidad',
        message: `Tiempo promedio: ${Math.floor(avgTime)}s. Intenta ser más rápido sin sacrificar precisión.`,
        action: 'Modo práctica rápida'
      });
    }

    return recommendations;
  }

  /**
   * 📈 Obtiene estadísticas generales actuales
   */
  getCurrentStats() {
    return {
      overall: this.tracker.getOverallStats(),
      byDomain: this.tracker.getStatsByDomain(),
      byLevel: this.tracker.getStatsByLevel(),
      globalCompetency: this.impact.calculateGlobalCompetencyChange(),
      examReadiness: this.impact.calculateExamReadiness(),
      strengthsWeaknesses: this.impact.identifyStrengthsWeaknesses()
    };
  }

  /**
   * 🔍 Obtiene recomendaciones de estudio
   */
  getStudyRecommendations() {
    return this.selector.getStudyRecommendations();
  }

  /**
   * 📅 Obtiene preguntas que necesitan revisión HOY
   */
  getDueReviews() {
    const allTracking = this.tracker.getAllQuestionsTracking();
    const now = new Date();

    return Object.values(allTracking).filter(tracking => {
      if (!tracking.nextReviewDate) return false;
      const reviewDate = new Date(tracking.nextReviewDate);
      return reviewDate <= now;
    });
  }
}

// ============================================================================
// EXPORTAR INSTANCIA SINGLETON
// ============================================================================

export const quizIntegration = new QuizIntegrationHelper();

export default quizIntegration;


// ============================================================================
// EJEMPLOS DE USO
// ============================================================================

/*

// ====== EN QuizScreen.js ======

import { quizIntegration } from '../utils/quizIntegration';
import preguntas from '../data/preguntas';

// 1. AL INICIAR QUIZ
const startQuiz = () => {
  // Iniciar sesión
  quizIntegration.startQuizSession({
    questionCount: 10,
    difficulty: selectedDifficulty, // null = todas
    domain: selectedDomain, // null = todos
    mode: 'practice' // 'adaptive', 'practice', 'exam'
  });

  // Seleccionar preguntas
  const questions = quizIntegration.selectQuestionsForQuiz(
    preguntas,
    10,
    { difficulty: selectedDifficulty, domain: selectedDomain }
  );

  setQuestions(questions);
  setCurrentQuestionIndex(0);
  
  // Marcar inicio de primera pregunta
  quizIntegration.startQuestion(0);
};

// 2. AL MOSTRAR PREGUNTA
useEffect(() => {
  if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
    quizIntegration.startQuestion(currentQuestionIndex);
  }
}, [currentQuestionIndex]);

// 3. AL RESPONDER
const handleAnswer = (answerIndex) => {
  const currentQuestion = questions[currentQuestionIndex];
  
  // Procesar respuesta
  const result = quizIntegration.processAnswer(currentQuestion, answerIndex);
  
  // Mostrar feedback inmediato
  setCurrentResult(result);
  setShowFeedback(true);
  
  // Avanzar después de 2 segundos
  setTimeout(() => {
    setShowFeedback(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  }, 2000);
};

// 4. AL FINALIZAR
const finishQuiz = () => {
  const summary = quizIntegration.endQuizSession();
  
  // Navegar a resultados con el resumen
  navigate('/results', { state: { summary } });
};

// 5. OBTENER ESTADÍSTICAS ACTUALES
const stats = quizIntegration.getCurrentStats();

// 6. OBTENER RECOMENDACIONES DE ESTUDIO
const recommendations = quizIntegration.getStudyRecommendations();

// 7. OBTENER PREGUNTAS PARA REVISAR HOY
const dueReviews = quizIntegration.getDueReviews();


// ====== EN ResultsScreen.js ======

import { useLocation } from 'react-router-dom';

const ResultsScreen = () => {
  const location = useLocation();
  const summary = location.state?.summary;

  return (
    <div>
      <h1>Resultados del Quiz</h1>
      
      <div className="score-card">
        <h2>{summary.totalPoints} puntos</h2>
        <p>{summary.totalXP} XP ganados</p>
      </div>

      <div className="accuracy">
        <h3>Precisión: {summary.accuracy}%</h3>
        <p>{summary.correctAnswers} / {summary.questionsAnswered}</p>
      </div>

      <div className="streak">
        <h3>🔥 Mejor racha: {summary.bestStreak}</h3>
      </div>

      <div className="bonuses">
        <h3>Bonuses Ganados</h3>
        {summary.bonusesEarned.map(bonus => (
          <div key={bonus.type}>
            {bonus.description}: {bonus.totalAmount} pts (×{bonus.count})
          </div>
        ))}
      </div>

      <div className="competency">
        <h3>Competencia Global</h3>
        <div style={{ color: summary.globalCompetency.color }}>
          {summary.globalCompetency.label}: {summary.globalCompetency.score}/100
        </div>
      </div>

      <div className="exam-readiness">
        <h3>Preparación para Examen</h3>
        <p>{summary.examReadiness.message}</p>
      </div>

      <div className="recommendations">
        <h3>Recomendaciones</h3>
        {summary.recommendations.map((rec, i) => (
          <div key={i} className={`recommendation ${rec.type}`}>
            <span>{rec.icon}</span>
            <h4>{rec.title}</h4>
            <p>{rec.message}</p>
            {rec.action && <button>{rec.action}</button>}
          </div>
        ))}
      </div>

      <div className="domain-breakdown">
        <h3>Por Dominio</h3>
        {Object.entries(summary.domainBreakdown).map(([domain, data]) => (
          <div key={domain}>
            <h4>{domain}</h4>
            <p>Precisión: {data.accuracy}%</p>
            <p>Puntos: {data.points}</p>
            <p>Tiempo promedio: {data.averageTime}s</p>
          </div>
        ))}
      </div>

      <div className="question-details">
        <h3>Detalles por Pregunta</h3>
        {summary.results.map((result, i) => (
          <div key={i} className="question-result">
            <h4>Pregunta {i + 1}</h4>
            <p>{result.score.feedback}</p>
            <p>Puntos: {result.score.totalPoints}</p>
            <p>Tiempo: {result.timeSpent}s</p>
            {result.score.bonuses.length > 0 && (
              <ul>
                {result.score.bonuses.map((bonus, j) => (
                  <li key={j}>{bonus.description}: +{bonus.amount}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

*/
