import React, { useState } from 'react';

const TechnicalCheckStep = ({ onComplete, onBack, userData }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const questionsByLevel = {
    basico: [
      {
        id: 'q1_basic',
        question: '¿Cuál de estas herramientas es más similar a Power BI?',
        options: [
          { id: 'a', text: 'Microsoft Word', correct: false },
          { id: 'b', text: 'Tablas dinámicas de Excel', correct: true },
          { id: 'c', text: 'PowerPoint', correct: false },
          { id: 'd', text: 'Outlook', correct: false }
        ],
        explanation: 'Power BI es como las tablas dinámicas de Excel pero mucho más potente. Ambas herramientas te permiten analizar y visualizar datos de forma dinámica.',
        points: 1
      },
      {
        id: 'q2_basic',
        question: 'En Excel usas gráficos para mostrar datos. ¿Cómo se llaman en Power BI?',
        options: [
          { id: 'a', text: 'Charts', correct: false },
          { id: 'b', text: 'Gráficos', correct: false },
          { id: 'c', text: 'Visualizaciones o Visuals', correct: true },
          { id: 'd', text: 'Widgets', correct: false }
        ],
        explanation: 'En Power BI se llaman "visualizaciones" o "visuals". Hay muchos tipos: gráficos de barras, líneas, mapas, tablas, KPIs y más.',
        points: 1
      }
    ],
    intermedio: [
      {
        id: 'q1_inter',
        question: '¿Cuál es la diferencia principal entre una columna calculada y una medida?',
        options: [
          { id: 'a', text: 'No hay diferencia', correct: false },
          { id: 'b', text: 'Las columnas se calculan al cargar datos, las medidas al mostrar visualizaciones', correct: true },
          { id: 'c', text: 'Las medidas son siempre más rápidas', correct: false },
          { id: 'd', text: 'Las columnas solo funcionan con texto', correct: false }
        ],
        explanation: 'Diferencia crítica: Columnas calculadas se almacenan en memoria (aumentan tamaño del modelo). Medidas se calculan dinámicamente según el contexto de la visualización.',
        points: 2
      },
      {
        id: 'q2_inter',
        question: 'Tienes una tabla de Ventas y otra de Productos. ¿Qué cardinalidad tiene la relación?',
        options: [
          { id: 'a', text: 'Uno a Uno (1:1)', correct: false },
          { id: 'b', text: 'Uno a Muchos (1:*)', correct: true },
          { id: 'c', text: 'Muchos a Muchos (*:*)', correct: false },
          { id: 'd', text: 'No se pueden relacionar', correct: false }
        ],
        explanation: 'Relación 1:* es la más común: UN producto puede aparecer en MUCHAS ventas. Productos (lado uno) → Ventas (lado muchos).',
        points: 2
      }
    ],
    avanzado: [
      {
        id: 'q1_adv',
        question: 'Una medida con CALCULATE está dentro de un iterador SUMX. ¿Qué ocurre?',
        options: [
          { id: 'a', text: 'Error de sintaxis', correct: false },
          { id: 'b', text: 'Context transition en cada iteración', correct: true },
          { id: 'c', text: 'Se optimiza automáticamente', correct: false },
          { id: 'd', text: 'Solo funciona con tablas pequeñas', correct: false }
        ],
        explanation: 'Context transition ocurre cuando CALCULATE está dentro de un iterador. Esto convierte el row context en filter context, lo cual puede impactar significativamente el performance.',
        points: 3
      },
      {
        id: 'q2_adv',
        question: 'Tu modelo tiene 2GB y tarda mucho en refrescar. ¿Qué revisas PRIMERO?',
        options: [
          { id: 'a', text: 'Comprar más RAM', correct: false },
          { id: 'b', text: 'Columnas con alta cardinalidad y columnas calculadas innecesarias', correct: true },
          { id: 'c', text: 'Cantidad de visualizaciones', correct: false },
          { id: 'd', text: 'Theme del reporte', correct: false }
        ],
        explanation: 'Optimización 101: Columnas con valores únicos (alta cardinalidad) y columnas calculadas consumen mucha memoria. Elimina columnas innecesarias, usa medidas en lugar de columnas calculadas.',
        points: 3
      }
    ]
  };

  const questions = questionsByLevel[userData.experienceLevel] || questionsByLevel.basico;

  const handleSelectAnswer = (optionId) => {
    if (!showExplanation) {
      setSelectedAnswer(optionId);
    }
  };

  const handleConfirm = () => {
    const question = questions[currentQuestion];
    const selectedOption = question.options.find(opt => opt.id === selectedAnswer);
    
    const newAnswers = [
      ...answers,
      {
        questionId: question.id,
        selectedAnswer: selectedAnswer,
        correct: selectedOption.correct,
        points: selectedOption.correct ? question.points : 0
      }
    ];
    
    setAnswers(newAnswers);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const totalPoints = answers.reduce((sum, ans) => sum + ans.points, 0);
      const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
      const accuracy = (totalPoints / maxPoints) * 100;

      onComplete({
        technicalAnswers: answers,
        technicalScore: totalPoints,
        technicalAccuracy: accuracy
      });
    }
  };

  const question = questions[currentQuestion];
  const selectedOption = question.options.find(opt => opt.id === selectedAnswer);

  return (
    <div className="onboarding-step technical-step">
      <div className="step-header">
        <h2>Verificación Técnica Rápida</h2>
        <p className="step-description">
          Solo {questions.length} preguntas para afinar tu perfil
        </p>
      </div>

      <div className="question-counter">
        Pregunta {currentQuestion + 1} de {questions.length}
      </div>

      <div className="technical-question-card">
        <h3 className="question-text">{question.question}</h3>

        <div className="options-list">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.id;
            const showCorrect = showExplanation && option.correct;
            const showIncorrect = showExplanation && isSelected && !option.correct;

            return (
              <button
                key={option.id}
                className={`option-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showIncorrect ? 'incorrect' : ''}`}
                onClick={() => handleSelectAnswer(option.id)}
                disabled={showExplanation}
              >
                <span className="option-letter">{option.id.toUpperCase()}</span>
                <span className="option-text">{option.text}</span>
                {showCorrect && <span className="result-icon">✓</span>}
                {showIncorrect && <span className="result-icon">✗</span>}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`explanation-box ${selectedOption?.correct ? 'correct' : 'incorrect'}`}>
            <div className="explanation-header">
              {selectedOption?.correct ? (
                <>
                  <span className="explanation-icon">✓</span>
                  <strong>¡Correcto!</strong>
                </>
              ) : (
                <>
                  <span className="explanation-icon">ℹ️</span>
                  <strong>Información útil:</strong>
                </>
              )}
            </div>
            <p>{question.explanation}</p>
          </div>
        )}
      </div>

      <div className="step-actions">
        {!showExplanation ? (
          <>
            <button className="btn-secondary" onClick={onBack}>
              ← Atrás
            </button>
            <button
              className="btn-primary"
              onClick={handleConfirm}
              disabled={!selectedAnswer}
            >
              Confirmar Respuesta
            </button>
          </>
        ) : (
          <button className="btn-primary btn-large" onClick={handleNext}>
            {currentQuestion < questions.length - 1 ? 'Siguiente Pregunta' : 'Ver mi Perfil'}
            <span className="btn-arrow">→</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TechnicalCheckStep;
