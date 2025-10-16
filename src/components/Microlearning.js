// Sistema de Microlearning y Evaluaciones Formativas Frecuentes
// Mini-assessments, flashcards con repetición espaciada

import React, { useState, useEffect } from 'react';
import '../styles/Microlearning.css';

// ============================================================================
// ALGORITMO DE REPETICIÓN ESPACIADA (SPACED REPETITION)
// ============================================================================

/**
 * Implementación del algoritmo SuperMemo SM-2
 * Calcula el siguiente intervalo de revisión basado en el desempeño
 */
export class SpacedRepetitionScheduler {
  constructor() {
    // Intervalos iniciales en días
    this.intervals = [1, 3, 7, 14, 30, 60, 120];
  }
  
  /**
   * Calcula el siguiente intervalo de revisión
   * @param {number} currentInterval - Intervalo actual en días
   * @param {number} easeFactor - Factor de facilidad (1.3 - 2.5)
   * @param {number} quality - Calidad de la respuesta (0-5)
   * @returns {object} Nuevo intervalo y factor de facilidad
   */
  calculateNextReview(currentInterval = 0, easeFactor = 2.5, quality) {
    // Actualizar factor de facilidad
    let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(1.3, newEaseFactor); // Mínimo 1.3
    
    let newInterval;
    
    if (quality < 3) {
      // Respuesta incorrecta o difícil - reiniciar
      newInterval = 1;
    } else if (currentInterval === 0) {
      // Primera revisión
      newInterval = 1;
    } else if (currentInterval === 1) {
      // Segunda revisión
      newInterval = 6;
    } else {
      // Revisiones subsiguientes
      newInterval = Math.round(currentInterval * newEaseFactor);
    }
    
    return {
      interval: newInterval,
      easeFactor: newEaseFactor,
      nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000)
    };
  }
  
  /**
   * Determina si una tarjeta debe revisarse hoy
   */
  isDueForReview(lastReviewDate, interval) {
    if (!lastReviewDate) return true;
    
    const daysSinceReview = (Date.now() - new Date(lastReviewDate)) / (24 * 60 * 60 * 1000);
    return daysSinceReview >= interval;
  }
}

// ============================================================================
// COMPONENTE DE FLASHCARD INTERACTIVA
// ============================================================================

const Flashcard = ({ question, onAnswer, showHint = false }) => {
  const [flipped, setFlipped] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [confidence, setConfidence] = useState(3);
  
  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setFlipped(true);
  };
  
  const handleConfidenceSubmit = () => {
    const isCorrect = selectedAnswer === question.respuestaCorrecta;
    
    // Calcular quality para el algoritmo SM-2
    // 0: respuesta totalmente incorrecta
    // 3: respuesta correcta con dificultad
    // 5: respuesta correcta fácilmente recordada
    let quality = isCorrect ? confidence : 0;
    
    onAnswer({
      questionId: question.id,
      isCorrect,
      quality,
      confidence,
      timestamp: Date.now()
    });
  };
  
  return (
    <div className={`flashcard ${flipped ? 'flipped' : ''}`}>
      <div className="flashcard-inner">
        {/* Frente */}
        <div className="flashcard-front">
          <div className="flashcard-header">
            <span className="flashcard-badge">{question.nivel}</span>
            <span className="flashcard-domain">{question.dominio}</span>
          </div>
          
          <div className="flashcard-question">
            <h3>{question.pregunta}</h3>
          </div>
          
          <div className="flashcard-options">
            {question.opciones.map((opcion, idx) => (
              <button
                key={idx}
                className={`option-btn ${selectedAnswer === idx ? 'selected' : ''}`}
                onClick={() => handleAnswer(idx)}
                disabled={flipped}
              >
                {String.fromCharCode(65 + idx)}. {opcion}
              </button>
            ))}
          </div>
          
          {showHint && !flipped && (
            <div className="flashcard-hint">
              💡 Pista: {question.trampaComun || 'Piensa en las mejores prácticas'}
            </div>
          )}
          
          {selectedAnswer !== null && !flipped && (
            <button className="reveal-btn" onClick={() => setFlipped(true)}>
              Ver Respuesta 👁️
            </button>
          )}
        </div>
        
        {/* Reverso */}
        <div className="flashcard-back">
          <div className="answer-feedback">
            {selectedAnswer === question.respuestaCorrecta ? (
              <div className="feedback-correct">
                <span className="feedback-icon">✅</span>
                <h3>¡Correcto!</h3>
              </div>
            ) : (
              <div className="feedback-incorrect">
                <span className="feedback-icon">❌</span>
                <h3>Incorrecto</h3>
                <p className="correct-answer">
                  Respuesta correcta: <strong>{String.fromCharCode(65 + question.respuestaCorrecta)}</strong>
                </p>
              </div>
            )}
          </div>
          
          <div className="explanation-box">
            <h4>Explicación:</h4>
            <p>{question.explicacion?.correcta}</p>
          </div>
          
          {selectedAnswer === question.respuestaCorrecta && (
            <div className="confidence-selector">
              <label>¿Qué tan fácil fue responder?</label>
              <div className="confidence-buttons">
                <button
                  className={confidence === 3 ? 'active' : ''}
                  onClick={() => setConfidence(3)}
                >
                  😓 Difícil
                </button>
                <button
                  className={confidence === 4 ? 'active' : ''}
                  onClick={() => setConfidence(4)}
                >
                  😐 Normal
                </button>
                <button
                  className={confidence === 5 ? 'active' : ''}
                  onClick={() => setConfidence(5)}
                >
                  😊 Fácil
                </button>
              </div>
            </div>
          )}
          
          <button className="next-card-btn" onClick={handleConfidenceSubmit}>
            Siguiente Tarjeta ➡️
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENTE DE MICRO-QUIZ (2-3 preguntas)
// ============================================================================

const MicroQuiz = ({ questions, onComplete, domain }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [startTime] = useState(Date.now());
  
  const handleAnswer = (answerData) => {
    const newAnswers = [...answers, answerData];
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Quiz completado
      const timeElapsed = Date.now() - startTime;
      const correctCount = newAnswers.filter(a => a.isCorrect).length;
      
      onComplete({
        domain,
        questions: questions.length,
        correct: correctCount,
        accuracy: correctCount / questions.length,
        timeElapsed: Math.round(timeElapsed / 1000),
        answers: newAnswers
      });
    }
  };
  
  const progress = ((currentIndex + 1) / questions.length) * 100;
  
  return (
    <div className="micro-quiz">
      <div className="micro-quiz-header">
        <h3>⚡ Micro-Quiz: {domain}</h3>
        <div className="micro-progress">
          <div className="micro-progress-bar" style={{ width: `${progress}%` }}></div>
          <span className="micro-progress-text">{currentIndex + 1} / {questions.length}</span>
        </div>
      </div>
      
      <Flashcard
        question={questions[currentIndex]}
        onAnswer={handleAnswer}
        showHint={true}
      />
    </div>
  );
};

// ============================================================================
// COMPONENTE DE QUICK POLL (1 pregunta)
// ============================================================================

const QuickPoll = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  
  const handleSubmit = () => {
    setRevealed(true);
    const isCorrect = selected === question.respuestaCorrecta;
    
    setTimeout(() => {
      onAnswer({
        questionId: question.id,
        isCorrect,
        quality: isCorrect ? 5 : 0,
        timestamp: Date.now()
      });
    }, 2000);
  };
  
  return (
    <div className="quick-poll">
      <div className="quick-poll-icon">📊</div>
      <h3 className="quick-poll-title">Quick Poll</h3>
      <p className="quick-poll-question">{question.pregunta}</p>
      
      <div className="quick-poll-options">
        {question.opciones.map((opcion, idx) => (
          <button
            key={idx}
            className={`quick-option ${selected === idx ? 'selected' : ''} ${
              revealed 
                ? idx === question.respuestaCorrecta 
                  ? 'correct' 
                  : idx === selected 
                    ? 'incorrect' 
                    : ''
                : ''
            }`}
            onClick={() => !revealed && setSelected(idx)}
            disabled={revealed}
          >
            {opcion}
          </button>
        ))}
      </div>
      
      {selected !== null && !revealed && (
        <button className="submit-poll-btn" onClick={handleSubmit}>
          Enviar Respuesta ✓
        </button>
      )}
      
      {revealed && (
        <div className="poll-result">
          {selected === question.respuestaCorrecta ? (
            <p className="result-correct">✅ ¡Correcto! {question.explicacion?.correcta}</p>
          ) : (
            <p className="result-incorrect">
              ❌ Incorrecto. {question.explicacion?.incorrectas?.[selected]}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL DE MICROLEARNING
// ============================================================================

const MicrolearningHub = ({ questionBank, userProgress, onProgressUpdate }) => {
  const [mode, setMode] = useState('dashboard');
  const [currentActivity, setCurrentActivity] = useState(null);
  const [scheduler] = useState(new SpacedRepetitionScheduler());
  const [dueCards, setDueCards] = useState([]);
  
  useEffect(() => {
    // Calcular tarjetas que necesitan revisión
    const due = questionBank.filter(q => {
      const progress = userProgress?.[q.id];
      if (!progress) return true; // Nueva tarjeta
      
      return scheduler.isDueForReview(
        progress.lastReview,
        progress.interval || 0
      );
    });
    
    setDueCards(due);
  }, [questionBank, userProgress, scheduler]);
  
  const startFlashcards = (domain = null) => {
    const cards = domain 
      ? dueCards.filter(q => q.dominio === domain)
      : dueCards;
    
    if (cards.length > 0) {
      setCurrentActivity({
        type: 'flashcards',
        questions: cards.slice(0, 10), // Máximo 10 tarjetas por sesión
        domain
      });
      setMode('activity');
    }
  };
  
  const startMicroQuiz = (domain) => {
    const questions = questionBank
      .filter(q => q.dominio === domain)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    setCurrentActivity({
      type: 'micro-quiz',
      questions,
      domain
    });
    setMode('activity');
  };
  
  const startQuickPoll = () => {
    const randomQuestion = dueCards[Math.floor(Math.random() * dueCards.length)];
    
    setCurrentActivity({
      type: 'quick-poll',
      question: randomQuestion
    });
    setMode('activity');
  };
  
  const handleActivityComplete = (results) => {
    // Actualizar progreso con repetición espaciada
    if (results.answers) {
      results.answers.forEach(answer => {
        const currentProgress = userProgress?.[answer.questionId] || {
          interval: 0,
          easeFactor: 2.5
        };
        
        const nextReview = scheduler.calculateNextReview(
          currentProgress.interval,
          currentProgress.easeFactor,
          answer.quality
        );
        
        onProgressUpdate(answer.questionId, {
          ...nextReview,
          lastReview: Date.now(),
          totalReviews: (currentProgress.totalReviews || 0) + 1,
          correctReviews: (currentProgress.correctReviews || 0) + (answer.isCorrect ? 1 : 0)
        });
      });
    }
    
    // Volver al dashboard
    setMode('dashboard');
    setCurrentActivity(null);
  };
  
  if (mode === 'activity') {
    if (currentActivity.type === 'flashcards') {
      return (
        <FlashcardSession
          questions={currentActivity.questions}
          onComplete={handleActivityComplete}
        />
      );
    } else if (currentActivity.type === 'micro-quiz') {
      return (
        <MicroQuiz
          questions={currentActivity.questions}
          domain={currentActivity.domain}
          onComplete={handleActivityComplete}
        />
      );
    } else if (currentActivity.type === 'quick-poll') {
      return (
        <QuickPoll
          question={currentActivity.question}
          onAnswer={(answer) => handleActivityComplete({ answers: [answer] })}
        />
      );
    }
  }
  
  return (
    <div className="microlearning-hub">
      <h2>⚡ Centro de Microlearning</h2>
      
      <div className="due-cards-banner">
        <span className="banner-icon">📚</span>
        <span className="banner-text">
          Tienes <strong>{dueCards.length}</strong> tarjetas listas para repasar
        </span>
      </div>
      
      <div className="microlearning-grid">
        <div className="micro-card" onClick={() => startFlashcards()}>
          <div className="micro-card-icon">🃏</div>
          <h3>Flashcards</h3>
          <p>Repaso espaciado inteligente</p>
          <span className="micro-card-count">{dueCards.length} pendientes</span>
        </div>
        
        <div className="micro-card" onClick={startQuickPoll}>
          <div className="micro-card-icon">📊</div>
          <h3>Quick Poll</h3>
          <p>1 pregunta rápida</p>
          <span className="micro-card-time">⏱️ 30 seg</span>
        </div>
        
        <div className="micro-card" onClick={() => startMicroQuiz('crear-calculos-dax')}>
          <div className="micro-card-icon">⚡</div>
          <h3>Micro-Quiz DAX</h3>
          <p>3 preguntas enfocadas</p>
          <span className="micro-card-time">⏱️ 2-3 min</span>
        </div>
        
        <div className="micro-card" onClick={() => startMicroQuiz('diseñar-implementar-modelo')}>
          <div className="micro-card-icon">🗂️</div>
          <h3>Micro-Quiz Modelado</h3>
          <p>3 preguntas enfocadas</p>
          <span className="micro-card-time">⏱️ 2-3 min</span>
        </div>
      </div>
      
      <ReviewSchedule userProgress={userProgress} scheduler={scheduler} />
    </div>
  );
};

// ============================================================================
// SESIÓN DE FLASHCARDS
// ============================================================================

const FlashcardSession = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  const handleAnswer = (answerData) => {
    const newAnswers = [...answers, answerData];
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete({ answers: newAnswers });
    }
  };
  
  return (
    <div className="flashcard-session">
      <div className="session-header">
        <h3>🃏 Sesión de Flashcards</h3>
        <div className="session-progress">
          {currentIndex + 1} / {questions.length}
        </div>
      </div>
      
      <Flashcard
        question={questions[currentIndex]}
        onAnswer={handleAnswer}
        showHint={false}
      />
    </div>
  );
};

// ============================================================================
// CALENDARIO DE REVISIÓN
// ============================================================================

const ReviewSchedule = ({ userProgress, scheduler }) => {
  const getScheduledReviews = () => {
    const today = new Date();
    const schedule = {};
    
    Object.entries(userProgress || {}).forEach(([questionId, progress]) => {
      if (progress.nextReviewDate) {
        const reviewDate = new Date(progress.nextReviewDate);
        const daysUntil = Math.ceil((reviewDate - today) / (24 * 60 * 60 * 1000));
        
        if (daysUntil >= 0 && daysUntil <= 7) {
          if (!schedule[daysUntil]) {
            schedule[daysUntil] = 0;
          }
          schedule[daysUntil]++;
        }
      }
    });
    
    return schedule;
  };
  
  const schedule = getScheduledReviews();
  
  return (
    <div className="review-schedule">
      <h3>📅 Calendario de Revisión (Próximos 7 días)</h3>
      <div className="schedule-timeline">
        {[0, 1, 2, 3, 4, 5, 6, 7].map(day => (
          <div key={day} className="schedule-day">
            <div className="day-label">
              {day === 0 ? 'Hoy' : day === 1 ? 'Mañana' : `+${day}d`}
            </div>
            <div className="day-count">{schedule[day] || 0}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MicrolearningHub;
export { Flashcard, MicroQuiz, QuickPoll };
