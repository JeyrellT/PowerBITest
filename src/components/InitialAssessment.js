import React, { useState, useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/InitialAssessment.css';

// Preguntas de evaluación por nivel (2 por nivel)
const ASSESSMENT_QUESTIONS = {
  principiante: [
    {
      id: 'p1',
      question: '¿Qué es Power BI?',
      options: [
        'Una herramienta de análisis de datos de Microsoft',
        'Un lenguaje de programación',
        'Un sistema operativo',
        'Una base de datos'
      ],
      correct: 0,
      explanation: 'Power BI es una suite de herramientas de análisis empresarial de Microsoft que permite conectar, transformar y visualizar datos.'
    },
    {
      id: 'p2',
      question: '¿Cuál es el primer paso para crear un informe en Power BI Desktop?',
      options: [
        'Crear visuales',
        'Conectar a una fuente de datos',
        'Publicar en el servicio',
        'Crear medidas DAX'
      ],
      correct: 1,
      explanation: 'El primer paso es conectarse a una fuente de datos (Excel, SQL, web, etc.) para importar o conectar los datos que analizarás.'
    }
  ],
  intermedio: [
    {
      id: 'i1',
      question: '¿Qué función de DAX usarías para calcular ventas del año anterior?',
      options: [
        'PREVIOUSYEAR()',
        'CALCULATE() con SAMEPERIODLASTYEAR()',
        'DATEADD()',
        'Todas las anteriores'
      ],
      correct: 3,
      explanation: 'Puedes usar PREVIOUSYEAR(), CALCULATE() con SAMEPERIODLASTYEAR(), o DATEADD() con -1 año. Todas son válidas según el contexto.'
    },
    {
      id: 'i2',
      question: '¿Cuál es la diferencia entre una medida y una columna calculada?',
      options: [
        'No hay diferencia, son lo mismo',
        'Las medidas se calculan en tiempo de consulta, las columnas al cargar datos',
        'Las columnas calculadas son más rápidas',
        'Las medidas ocupan más espacio'
      ],
      correct: 1,
      explanation: 'Las medidas se evalúan en tiempo de consulta según el contexto del filtro, mientras que las columnas calculadas se computan una vez al cargar/refrescar datos.'
    }
  ],
  avanzado: [
    {
      id: 'a1',
      question: '¿Qué técnica usarías para implementar seguridad a nivel de fila (RLS) dinámica?',
      options: [
        'Roles estáticos con filtros fijos',
        'DAX con USERNAME() o USERPRINCIPALNAME() en roles',
        'Ocultar filas en Power Query',
        'Crear múltiples informes'
      ],
      correct: 1,
      explanation: 'RLS dinámico usa funciones como USERNAME() o USERPRINCIPALNAME() en expresiones DAX dentro de roles para filtrar datos según el usuario.'
    },
    {
      id: 'a2',
      question: '¿Cuándo deberías usar DirectQuery en lugar de Import?',
      options: [
        'Siempre, es más rápido',
        'Cuando necesitas datos en tiempo real y el modelo es muy grande',
        'Nunca, Import es superior',
        'Solo para bases de datos pequeñas'
      ],
      correct: 1,
      explanation: 'DirectQuery es útil cuando necesitas datos en tiempo real, el dataset es muy grande para Import, o hay restricciones de seguridad que requieren consultas directas.'
    }
  ]
};

const InitialAssessment = ({ onComplete }) => {
  const { theme, toggleTheme, accentColor, changeAccent } = useContext(ThemeContext);
  const [step, setStep] = useState('welcome'); // welcome, name, theme, level, assessment, results
  const [userName, setUserName] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('intermedio');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);

  const questions = ASSESSMENT_QUESTIONS[selectedLevel];
  const currentQuestion = questions[currentQuestionIndex];

  // Animaciones
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const handleAnswer = (optionIndex) => {
    const isCorrect = optionIndex === currentQuestion.correct;
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: { selected: optionIndex, correct: isCorrect }
    };
    setAnswers(newAnswers);
    setShowExplanation(true);

    // Auto-avanzar después de mostrar explicación
    setTimeout(() => {
      setShowExplanation(false);
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Evaluar resultados
        evaluateResults(newAnswers);
      }
    }, 3000);
  };

  const evaluateResults = (finalAnswers) => {
    const correctCount = Object.values(finalAnswers).filter(a => a.correct).length;
    const totalQuestions = questions.length;
    const percentage = (correctCount / totalQuestions) * 100;

    let recommendedLevel = selectedLevel;
    let recommendation = '';

    // Lógica de recomendación
    if (percentage === 0) {
      // Falló ambas preguntas
      if (selectedLevel === 'avanzado') {
        recommendedLevel = 'intermedio';
        recommendation = 'Te recomendamos empezar con el nivel Intermedio. Practica conceptos de DAX y modelado antes de avanzar.';
      } else if (selectedLevel === 'intermedio') {
        recommendedLevel = 'principiante';
        recommendation = 'Te sugerimos comenzar con el nivel Principiante. Familiarízate con los fundamentos de Power BI primero.';
      } else {
        recommendedLevel = 'principiante';
        recommendation = 'Empieza con pocas preguntas (5-10) en temas específicos como "Preparar Datos". Te recomendamos tomar un curso introductorio de Power BI antes de continuar.';
      }
    } else if (percentage === 50) {
      // Acertó 1 de 2
      recommendation = `Tienes conocimientos básicos del nivel ${selectedLevel}. Te recomendamos practicar con 10-15 preguntas de este nivel para reforzar conceptos.`;
    } else if (percentage === 100) {
      // Acertó ambas
      if (selectedLevel === 'principiante') {
        recommendedLevel = 'intermedio';
        recommendation = '¡Excelente! Dominas los fundamentos. Continúa con el nivel Intermedio para profundizar en DAX y modelado.';
      } else if (selectedLevel === 'intermedio') {
        recommendedLevel = 'avanzado';
        recommendation = '¡Muy bien! Tienes sólidos conocimientos intermedios. Desafíate con el nivel Avanzado: RLS, optimización y escenarios complejos.';
      } else {
        recommendedLevel = 'avanzado';
        recommendation = '¡Impresionante! Dominas Power BI. Practica con simulaciones completas del examen (50-60 preguntas) en modo examen.';
      }
    }

    setAssessmentResults({
      correctCount,
      totalQuestions,
      percentage,
      recommendedLevel,
      recommendation
    });
    setStep('results');
  };

  const handleFinish = () => {
    const profile = {
      name: userName,
      theme: theme,
      accentColor: accentColor,
      initialLevel: selectedLevel,
      recommendedLevel: assessmentResults?.recommendedLevel || selectedLevel,
      assessmentDate: new Date().toISOString()
    };
    
    // Guardar perfil en localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Llamar callback con perfil
    if (onComplete) {
      onComplete(profile);
    }
  };

  // Render de cada paso
  const renderWelcome = () => (
    <motion.div
      className="assessment-step welcome-step"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="step-icon">🎯</div>
      <h1>Bienvenido a PL-300 Quiz Master</h1>
      <p className="subtitle">Sistema de evaluación inteligente que se adapta a tu nivel de experiencia</p>

      <div className="features-grid">
        <div className="feature-card">
          <span className="feature-icon">🎓</span>
          <h3>Personalizado</h3>
          <p>Se adapta a tu experiencia: desde Excel básico hasta Power BI avanzado</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>Diagnóstico Preciso</h3>
          <p>Identifica fortalezas y áreas de mejora usando taxonomía de Bloom</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🚀</span>
          <h3>Rutas de Estudio</h3>
          <p>Plan personalizado basado en tus resultados y objetivos</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🏆</span>
          <h3>Gamificación</h3>
          <p>Badges, puntos y logros para mantener tu motivación</p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <span className="stat-number">46</span>
          <span className="stat-label">Preguntas de práctica</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">4</span>
          <span className="stat-label">Dominios del examen</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">3-5</span>
          <span className="stat-label">Minutos de evaluación</span>
        </div>
      </div>

      <button className="btn-primary" onClick={() => setStep('name')}>
        Comenzar Evaluación →
      </button>

      <p className="info-note">
        <span className="info-icon">ℹ️</span>
        No requiere registro. Tu progreso se guarda localmente.
      </p>
    </motion.div>
  );

  const renderNameStep = () => (
    <motion.div
      className="assessment-step name-step"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="step-icon">👤</div>
      <h2>¿Cómo te llamas?</h2>
      <p className="subtitle">Personalicemos tu experiencia de aprendizaje</p>

      <div className="input-group">
        <input
          type="text"
          className="name-input"
          placeholder="Tu nombre..."
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          maxLength={30}
          autoFocus
        />
        {userName && (
          <p className="name-preview">
            ¡Hola, <strong>{userName}</strong>! 👋
          </p>
        )}
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setStep('welcome')}>
          ← Atrás
        </button>
        <button
          className="btn-primary"
          onClick={() => setStep('theme')}
          disabled={!userName.trim()}
        >
          Continuar →
        </button>
      </div>
    </motion.div>
  );

  const renderThemeStep = () => (
    <motion.div
      className="assessment-step theme-step"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="step-icon">🎨</div>
      <h2>Elige tu tema favorito</h2>
      <p className="subtitle">Selecciona el estilo visual que prefieras</p>

      <div className="theme-selector">
        <button
          className={`theme-option ${theme === 'light' ? 'active' : ''}`}
          onClick={() => theme !== 'light' && toggleTheme()}
        >
          <span className="theme-icon">🌞</span>
          <span className="theme-name">Modo Claro</span>
          <span className="theme-desc">Ideal para ambientes iluminados</span>
        </button>
        <button
          className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
          onClick={() => theme !== 'dark' && toggleTheme()}
        >
          <span className="theme-icon">🌙</span>
          <span className="theme-name">Modo Oscuro</span>
          <span className="theme-desc">Reduce fatiga visual</span>
        </button>
      </div>

      <div className="accent-selector">
        <p className="accent-label">Color de acento:</p>
        <div className="accent-options">
          {['blue', 'purple', 'green', 'pink'].map((color) => (
            <button
              key={color}
              className={`accent-btn ${accentColor === color ? 'active' : ''}`}
              data-accent={color}
              onClick={() => changeAccent(color)}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setStep('name')}>
          ← Atrás
        </button>
        <button className="btn-primary" onClick={() => setStep('level')}>
          Continuar →
        </button>
      </div>
    </motion.div>
  );

  const renderLevelStep = () => (
    <motion.div
      className="assessment-step level-step"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="step-icon">📊</div>
      <h2>¿Cuál es tu nivel de Power BI?</h2>
      <p className="subtitle">Te haremos 2 preguntas para confirmar tu nivel inicial</p>

      <div className="level-selector">
        <button
          className={`level-option ${selectedLevel === 'principiante' ? 'active' : ''}`}
          onClick={() => setSelectedLevel('principiante')}
        >
          <span className="level-icon">🌱</span>
          <h3>Principiante</h3>
          <p>Fundamentos de Power BI, conexión a datos, visuales básicos</p>
          <ul className="level-topics">
            <li>Interfaz de Power BI Desktop</li>
            <li>Importar datos de Excel/CSV</li>
            <li>Crear gráficos básicos</li>
          </ul>
        </button>

        <button
          className={`level-option ${selectedLevel === 'intermedio' ? 'active' : ''}`}
          onClick={() => setSelectedLevel('intermedio')}
        >
          <span className="level-icon">🚀</span>
          <h3>Intermedio</h3>
          <p>DAX, modelado de datos, relaciones, medidas calculadas</p>
          <ul className="level-topics">
            <li>Funciones DAX (CALCULATE, FILTER)</li>
            <li>Modelado estrella</li>
            <li>Inteligencia temporal</li>
          </ul>
        </button>

        <button
          className={`level-option ${selectedLevel === 'avanzado' ? 'active' : ''}`}
          onClick={() => setSelectedLevel('avanzado')}
        >
          <span className="level-icon">🏆</span>
          <h3>Avanzado</h3>
          <p>RLS, optimización, DAX complejo, DirectQuery, escenarios empresariales</p>
          <ul className="level-topics">
            <li>Seguridad a nivel de fila</li>
            <li>Optimización de modelos</li>
            <li>Variables DAX y iteradores</li>
          </ul>
        </button>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => setStep('theme')}>
          ← Atrás
        </button>
        <button className="btn-primary" onClick={() => setStep('assessment')}>
          Comenzar Evaluación →
        </button>
      </div>
    </motion.div>
  );

  const renderAssessment = () => (
    <motion.div
      className="assessment-step question-step"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={currentQuestion.id}
    >
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="question-header">
        <span className="question-number">
          Pregunta {currentQuestionIndex + 1} de {questions.length}
        </span>
        <span className="question-level">{selectedLevel}</span>
      </div>

      <h3 className="question-text">{currentQuestion.question}</h3>

      <div className="options-grid">
        {currentQuestion.options.map((option, index) => {
          const isSelected = answers[currentQuestion.id]?.selected === index;
          const isCorrect = index === currentQuestion.correct;
          const showResult = showExplanation;

          return (
            <button
              key={index}
              className={`option-btn ${isSelected ? 'selected' : ''} ${
                showResult ? (isCorrect ? 'correct' : isSelected ? 'incorrect' : '') : ''
              }`}
              onClick={() => !showExplanation && handleAnswer(index)}
              disabled={showExplanation}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
              {showResult && isCorrect && <span className="option-icon">✓</span>}
              {showResult && isSelected && !isCorrect && <span className="option-icon">✗</span>}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {showExplanation && (
          <motion.div
            className={`explanation ${
              answers[currentQuestion.id]?.correct ? 'correct' : 'incorrect'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="explanation-icon">
              {answers[currentQuestion.id]?.correct ? '✅' : '💡'}
            </div>
            <p className="explanation-text">{currentQuestion.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const renderResults = () => (
    <motion.div
      className="assessment-step results-step"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="results-icon">
        {assessmentResults.percentage === 100 ? '🎉' : assessmentResults.percentage >= 50 ? '👍' : '📚'}
      </div>

      <h2>Evaluación Completada</h2>
      <p className="subtitle">Aquí están tus resultados, {userName}</p>

      <div className="results-card">
        <div className="score-circle">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" className="score-bg" />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="score-fill"
              style={{
                strokeDasharray: `${assessmentResults.percentage * 2.827} 282.7`
              }}
            />
          </svg>
          <div className="score-text">
            <span className="score-number">{assessmentResults.correctCount}/{assessmentResults.totalQuestions}</span>
            <span className="score-label">Correctas</span>
          </div>
        </div>

        <div className="results-info">
          <div className="result-item">
            <span className="result-label">Nivel evaluado:</span>
            <span className="result-value">{selectedLevel}</span>
          </div>
          <div className="result-item">
            <span className="result-label">Nivel recomendado:</span>
            <span className="result-value recommended">{assessmentResults.recommendedLevel}</span>
          </div>
        </div>
      </div>

      <div className="recommendation-box">
        <h3>📋 Recomendación Personalizada</h3>
        <p>{assessmentResults.recommendation}</p>
      </div>

      <div className="next-steps">
        <h3>🚀 Próximos Pasos</h3>
        <ul>
          <li>
            <span className="step-icon">📘</span>
            <span>Lee la <button className="link-btn" onClick={() => window.location.href = '/#/exam-guide'}>Guía Completa del Examen PL-300</button></span>
          </li>
          <li>
            <span className="step-icon">🎯</span>
            <span>Practica con {assessmentResults.recommendedLevel === 'principiante' ? '5-10' : '15-20'} preguntas de tu nivel</span>
          </li>
          <li>
            <span className="step-icon">📊</span>
            <span>Revisa tu perfil y estadísticas regularmente</span>
          </li>
          <li>
            <span className="step-icon">🔥</span>
            <span>Mantén una racha de estudio diaria</span>
          </li>
        </ul>
      </div>

      <div className="step-actions">
        <button className="btn-secondary" onClick={() => window.location.href = '/#/exam-guide'}>
          📘 Ver Guía del Examen
        </button>
        <button className="btn-primary" onClick={handleFinish}>
          Comenzar a Practicar →
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="initial-assessment">
      <div className="assessment-container">
        <AnimatePresence mode="wait">
          {step === 'welcome' && renderWelcome()}
          {step === 'name' && renderNameStep()}
          {step === 'theme' && renderThemeStep()}
          {step === 'level' && renderLevelStep()}
          {step === 'assessment' && renderAssessment()}
          {step === 'results' && renderResults()}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default InitialAssessment;
