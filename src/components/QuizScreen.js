import React, { useState, useEffect } from 'react';
import '../styles/QuizScreen.css';
import { getFilteredQuestions } from '../data/preguntas';
import { useCxCProgress } from '../contexts/CxCProgressContext';
import { usePaywall } from '../contexts/PaywallContext';

const QuizScreen = ({ onNavigate, quizConfig }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime] = useState(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectAnswer, setIsCorrectAnswer] = useState(false);
  const [streak, setStreak] = useState(0);
  const [xpGained, setXpGained] = useState(0);
  const [animatingXP, setAnimatingXP] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [noQuestionsAvailable, setNoQuestionsAvailable] = useState(false);

  // ✅ ÚNICA FUENTE DE VERDAD: useCxCProgress
  const { getAnsweredQuestions, getAllQuestionsTracking } = useCxCProgress();
  
  // 🔒 Hook del Paywall
  const { incrementAnsweredCount } = usePaywall();

  useEffect(() => {
    // ✅ Obtener preguntas ya respondidas desde el contexto centralizado
    const answeredQuestionIds = getAnsweredQuestions();
    const questionTracking = getAllQuestionsTracking();
    
    console.log('📝 Configuración del quiz:', quizConfig);
    console.log('✅ Preguntas ya respondidas (CONTEXTO CENTRALIZADO):', answeredQuestionIds.length);
    console.log('📊 Questions con tracking:', Object.keys(questionTracking).length);
    
    let filteredQuestions;
    
    // 🆕 Modo especial: Quiz de solo preguntas incorrectas
    if (quizConfig.incorrectOnly && quizConfig.incorrectQuestions) {
      console.log('🔄 Modo REPASO: Cargando solo preguntas incorrectas', quizConfig.incorrectQuestions);
      
      // Filtrar el pool de preguntas para incluir SOLO las incorrectas
      filteredQuestions = getFilteredQuestions(
        quizConfig.domain,
        quizConfig.level,
        quizConfig.numberOfQuestions,
        [], // No excluir ninguna
        {
          questionTracking,
          includeSpecific: quizConfig.incorrectQuestions, // 🆕 Solo estas preguntas
          excludeMasteredOnly: false,
          prioritizeWeak: false
        }
      );
    } else {
      // ✅ Modo normal: Sistema inteligente de filtrado
      // Por defecto, excluir SOLO las preguntas dominadas (no todas las respondidas)
      // Esto permite repetir preguntas que aún necesitan práctica
      filteredQuestions = getFilteredQuestions(
        quizConfig.domain,
        quizConfig.level,
        quizConfig.numberOfQuestions,
        [], // No usar preguntasExcluidas legacy
        {
          questionTracking, // Pasar tracking para decisiones inteligentes
          excludeMasteredOnly: true, // ✅ Solo excluir dominadas, no todas
          prioritizeWeak: true // ✅ Priorizar preguntas débiles
        }
      );
    }
    
    console.log('🎯 Preguntas obtenidas:', filteredQuestions.length);
    
    setQuestions(filteredQuestions);
    setIsLoading(false);
    
    // Si no hay preguntas disponibles después de filtrar
    if (filteredQuestions.length === 0) {
      setNoQuestionsAvailable(true);
    }
  }, [quizConfig, getAnsweredQuestions, getAllQuestionsTracking]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (optionIndex) => {
    // Si ya había respuesta previa, no animar de nuevo NI incrementar contador
    const wasAnswered = answers[currentQuestionIndex] !== undefined;
    
    setAnswers({
      ...answers,
      [currentQuestionIndex]: optionIndex
    });

    // Solo mostrar feedback visual y contar en primera respuesta
    if (!wasAnswered) {
      const currentQuestion = questions[currentQuestionIndex];
      const isCorrect = optionIndex === currentQuestion.respuestaCorrecta;
      
      setShowFeedback(true);
      setIsCorrectAnswer(isCorrect);
      
      // 🔒 Incrementar contador del paywall (sin importar si es correcta o incorrecta)
      incrementAnsweredCount();
      
      if (isCorrect) {
        // Respuesta correcta: dar XP y incrementar racha
        const xp = 10 + (streak * 5);
        setXpGained(xp);
        setAnimatingXP(true);
        setStreak(streak + 1);
      } else {
        // Respuesta incorrecta: resetear racha
        setStreak(0);
        setAnimatingXP(false);
      }

      // Ocultar feedback después de 1.5s
      setTimeout(() => {
        setShowFeedback(false);
        setAnimatingXP(false);
      }, 1500);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setShowFeedback(false);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowFeedback(false);
    }
  };

  const finishQuiz = () => {
    const results = {
      questions,
      answers,
      timeElapsed,
      config: quizConfig,
      timestamp: new Date().toISOString()
    };
    onNavigate('results', { results });
  };

  // Corregir implementación de handleQuizComplete
  const handleQuizComplete = () => {
    const results = {
      questions: questions, // Usar 'questions' en lugar de 'shuffledQuestions'
      answers: answers, // Asumiendo que 'answers' debe ser 'userAnswers'
      timeElapsed: timeElapsed, // Asumiendo que hay una variable 'elapsedTime' para el tiempo
      config: quizConfig, // Usar 'quizConfig' en lugar de 'config'
      timestamp: Date.now(),
      sessionId: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    console.log('📋 Quiz completado con ID único:', results.sessionId);
    onNavigate('results', results);
  };

  // Mensaje de carga
  if (isLoading) {
    return (
      <div className="quiz-screen">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando preguntas...</p>
        </div>
      </div>
    );
  }

  // No hay preguntas disponibles
  if (noQuestionsAvailable || questions.length === 0) {
    return (
      <div className="quiz-screen">
        <div className="quiz-container">
          <div className="no-questions-message">
            <h2>🎉 ¡Excelente Progreso!</h2>
            <p>Ya has dominado todas las preguntas disponibles para esta configuración.</p>
            <div className="suggestions">
              <p><strong>💡 Opciones disponibles:</strong></p>
              <ul>
                <li>✨ Seleccionar un <strong>dominio o nivel diferente</strong></li>
                <li>� <strong>Revisar tus estadísticas</strong> en "Mi Perfil"</li>
                <li>🔄 Las preguntas que aún necesitan práctica <strong>volverán a aparecer automáticamente</strong></li>
                <li>🎯 Las preguntas dominadas (3+ correctas, 80%+ precisión) se excluyen temporalmente</li>
              </ul>
              <div className="info-box">
                <strong>ℹ️ Sistema Inteligente:</strong>
                <p>Nuestro sistema prioriza preguntas que necesitas practicar más y excluye temporalmente las que ya dominas, optimizando tu aprendizaje.</p>
              </div>
            </div>
            <button className="primary-button" onClick={() => onNavigate('home')}>
              ← Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="quiz-screen">
      {/* XP Animation */}
      {animatingXP && (
        <div className="xp-popup">
          <span className="xp-text">+{xpGained} XP</span>
          {streak > 2 && <span className="streak-text">🔥 {streak} racha!</span>}
        </div>
      )}

      {/* Confetti effect solo cuando la respuesta es CORRECTA */}
      {showFeedback && isCorrectAnswer && (
        <div className="confetti-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="confetti" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.3}s`,
              backgroundColor: ['#667eea', '#764ba2', '#10b981', '#FFD700'][Math.floor(Math.random() * 4)]
            }}></div>
          ))}
        </div>
      )}

      {/* Feedback visual negativo para respuesta incorrecta */}
      {showFeedback && !isCorrectAnswer && (
        <div className="incorrect-feedback">
          <div className="shake-icon">❌</div>
        </div>
      )}

      <div className="quiz-container">
        <header className="quiz-header">
          <div className="header-left">
            <h1>PL-300 Quiz</h1>
            <div className="quiz-stats">
              <span className="stat">⏱️ {formatTime(timeElapsed)}</span>
              <span className="stat">📝 {answeredCount}/{questions.length}</span>
              {streak > 0 && <span className="stat streak-badge">🔥 {streak}</span>}
            </div>
          </div>
          <button className="finish-button" onClick={finishQuiz}>
            Finalizar Quiz
          </button>
        </header>

        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            <span className="progress-text">{Math.round(progress)}%</span>
          </div>
        </div>

        <div className="quiz-content">
          <div className="question-sidebar">
            <h3>Navegación</h3>
            <div className="question-grid">
              {questions.map((_, index) => (
                <button
                  key={index}
                  className={`question-nav-button ${
                    index === currentQuestionIndex ? 'current' : ''
                  } ${answers[index] !== undefined ? 'answered' : ''}`}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="sidebar-legend">
              <div className="legend-item">
                <span className="legend-box current"></span>
                <span>Actual</span>
              </div>
              <div className="legend-item">
                <span className="legend-box answered"></span>
                <span>Respondida</span>
              </div>
              <div className="legend-item">
                <span className="legend-box"></span>
                <span>Sin responder</span>
              </div>
            </div>
          </div>

          <div className="question-area">
            <div className="question-header">
              <div className="question-meta">
                <span className="question-number">
                  Pregunta {currentQuestionIndex + 1} de {questions.length}
                </span>
                <div className="question-tags">
                  <span className="tag domain">{currentQuestion.dominio}</span>
                  <span className="tag level">{currentQuestion.nivel}</span>
                  {currentQuestion.bloom && (
                    <span className="tag bloom">📊 {currentQuestion.bloom}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="question-body">
              <h2 className="question-text">{currentQuestion.pregunta}</h2>

              <div className="options-container">
                {currentQuestion.opciones.map((option, index) => (
                  <button
                    key={index}
                    className={`option-button ${
                      answers[currentQuestionIndex] === index ? 'selected' : ''
                    } ${showFeedback && answers[currentQuestionIndex] === index ? 'pulse' : ''}`}
                    onClick={() => handleAnswer(index)}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="option-text">{option}</span>
                    {answers[currentQuestionIndex] === index && (
                      <span className="checkmark">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="question-navigation">
              <button
                className="nav-button"
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                ← Anterior
              </button>
              <span className="nav-info">
                {answeredCount === questions.length
                  ? '✅ Todas las preguntas respondidas'
                  : `${questions.length - answeredCount} preguntas sin responder`}
              </span>
              {currentQuestionIndex < questions.length - 1 ? (
                <button className="nav-button" onClick={nextQuestion}>
                  Siguiente →
                </button>
              ) : (
                <button className="nav-button finish" onClick={finishQuiz}>
                  Finalizar Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
