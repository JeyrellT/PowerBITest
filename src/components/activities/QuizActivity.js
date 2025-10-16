/**
 * QuizActivity.js - Componente de quiz interactivo
 * Basado en FASE_3 - Tipo de actividad: quiz
 */

import React, { useState, useEffect } from 'react';
import './QuizActivity.css';

const QuizActivity = ({ 
  questions = [], 
  onComplete, 
  onProgress 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [autoCompleted, setAutoCompleted] = useState(false);

  const safeQuestions = Array.isArray(questions) ? questions : [];
  const totalQuestions = safeQuestions.length;
  const currentQuestion = totalQuestions > 0 ? safeQuestions[currentQuestionIndex] : null;
  const isLastQuestion = totalQuestions > 0 && currentQuestionIndex === totalQuestions - 1;

  useEffect(() => {
    if (totalQuestions === 0 && !autoCompleted) {
      if (typeof onComplete === 'function') {
        onComplete({ answers: {}, totalQuestions: 0 });
      }
      setAutoCompleted(true);
    }
  }, [totalQuestions, autoCompleted, onComplete]);

  const handleAnswerSelect = (answerId) => {
    if (showFeedback || !currentQuestion) return; // No cambiar respuesta si ya mostró feedback o no hay pregunta

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerId
    }));
  };

  const handleConfirm = () => {
    if (!currentQuestion) return;
    setShowFeedback(true);

    // Notificar progreso
    if (onProgress) {
      const progress = totalQuestions > 0
        ? ((currentQuestionIndex + 1) / totalQuestions) * 100
        : 0;
      onProgress(progress);
    }
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    if (isLastQuestion) {
      // Completar actividad
      if (onComplete) {
        onComplete({
          answers: selectedAnswers,
          totalQuestions
        });
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowFeedback(false);
    }
  };

  const isCorrectAnswer = (answerId) => {
    if (!currentQuestion) return false;
    return answerId === currentQuestion.correctAnswer;
  };

  if (!currentQuestion) {
    return (
      <div className="quiz-activity">
        <div className="quiz-empty">No hay preguntas disponibles</div>
      </div>
    );
  }

  const selectedAnswer = selectedAnswers[currentQuestion.id];
  const isSelectedCorrect = selectedAnswer === currentQuestion.correctAnswer;


  return (
    <div className="quiz-activity">
      {/* Progress bar */}
      <div className="quiz-progress-bar">
        <div className="quiz-progress-track">
          <div 
            className="quiz-progress-fill"
            style={{
              width: totalQuestions > 0
                ? `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`
                : '0%'
            }}
          />
        </div>
        <span className="quiz-progress-text">
          Pregunta {currentQuestionIndex + 1} de {totalQuestions}
        </span>
      </div>

      {/* Question card */}
      <div className="quiz-question-card">
        <div className="quiz-question-header">
          <span className="quiz-question-category">{currentQuestion.category || 'Conocimiento'}</span>
          <span className="quiz-question-difficulty">
            {currentQuestion.difficulty === 'easy' && '⭐'}
            {currentQuestion.difficulty === 'medium' && '⭐⭐'}
            {currentQuestion.difficulty === 'hard' && '⭐⭐⭐'}
          </span>
        </div>

        <h3 className="quiz-question-text">{currentQuestion.question}</h3>

        {currentQuestion.context && (
          <div className="quiz-question-context">
            <strong>Contexto:</strong> {currentQuestion.context}
          </div>
        )}

        {/* Answers */}
        <div className="quiz-answers">
          {(Array.isArray(currentQuestion.answers) ? currentQuestion.answers : []).map((answer) => {
            const isSelected = selectedAnswer === answer.id;
            const isCorrect = isCorrectAnswer(answer.id);
            
            let answerClass = 'quiz-answer';
            if (showFeedback) {
              if (isCorrect) {
                answerClass += ' quiz-answer-correct';
              } else if (isSelected && !isCorrect) {
                answerClass += ' quiz-answer-incorrect';
              }
            } else if (isSelected) {
              answerClass += ' quiz-answer-selected';
            }

            return (
              <button
                key={answer.id}
                className={answerClass}
                onClick={() => handleAnswerSelect(answer.id)}
                disabled={showFeedback}
              >
                <span className="quiz-answer-letter">{answer.id.toUpperCase()}</span>
                <span className="quiz-answer-text">{answer.text}</span>
                {showFeedback && isCorrect && (
                  <span className="quiz-answer-icon">✓</span>
                )}
                {showFeedback && isSelected && !isCorrect && (
                  <span className="quiz-answer-icon">✗</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`quiz-feedback ${isSelectedCorrect ? 'quiz-feedback-correct' : 'quiz-feedback-incorrect'}`}>
            <div className="quiz-feedback-title">
              {isSelectedCorrect ? '¡Correcto! ✓' : 'Incorrecto ✗'}
            </div>
            <div className="quiz-feedback-text">
              {currentQuestion.explanation || (
                isSelectedCorrect 
                  ? 'Has seleccionado la respuesta correcta.'
                  : 'La respuesta correcta es: ' + currentQuestion.answers.find(a => a.id === currentQuestion.correctAnswer)?.text
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="quiz-actions">
          {!showFeedback ? (
            <button
              className="quiz-button quiz-button-primary"
              onClick={handleConfirm}
              disabled={!selectedAnswer}
            >
              Confirmar respuesta
            </button>
          ) : (
            <button
              className="quiz-button quiz-button-primary"
              onClick={handleNext}
            >
              {isLastQuestion ? 'Finalizar Quiz' : 'Siguiente pregunta'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizActivity;
