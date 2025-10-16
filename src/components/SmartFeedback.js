// Sistema de Feedback Inteligente Multinivel
// Basado en el marco de Hattie & Timperley y hints progresivos

import React, { useState, useEffect } from 'react';
import '../styles/SmartFeedback.css';

// ============================================================================
// GENERADOR DE HINTS PROGRESIVOS
// ============================================================================

/**
 * Genera hints en 4 niveles de especificidad
 */
export function generateProgressiveHints(question, selectedAnswer) {
  const isCorrect = selectedAnswer === question.respuestaCorrecta;
  
  return {
    // Nivel 1: Hint Genérico
    generic: generateGenericHint(question, isCorrect),
    
    // Nivel 2: Guía basada en plantilla
    template: generateTemplateGuide(question, selectedAnswer),
    
    // Nivel 3: Hint específico del problema
    specific: generateSpecificHint(question, selectedAnswer),
    
    // Nivel 4: Bottom-out (respuesta parcial o completa)
    bottomOut: generateBottomOutHint(question)
  };
}

function generateGenericHint(question, isCorrect) {
  if (isCorrect) {
    return {
      type: 'success',
      message: '¡Excelente! Tu razonamiento es correcto.',
      icon: '✅'
    };
  }
  
  const hintsByDomain = {
    'preparar-datos': 'Considera las mejores prácticas de ETL y transformación de datos',
    'diseñar-implementar-modelo': 'Piensa en la estructura star schema y las relaciones entre tablas',
    'crear-calculos-dax': 'Recuerda la diferencia entre row context y filter context',
    'crear-reportes': 'Considera los principios de visualización y UX',
    'optimizar-rendimiento': 'Piensa en cómo reducir la carga de procesamiento',
    'asegurar-gobernar': 'Revisa los conceptos de seguridad RLS y governance'
  };
  
  return {
    type: 'info',
    message: hintsByDomain[question.dominio] || 'Revisa los conceptos fundamentales del tema',
    icon: '💡'
  };
}

function generateTemplateGuide(question, selectedAnswer) {
  const correctOption = question.opciones[question.respuestaCorrecta];
  
  // Identificar palabras clave en la opción correcta
  const keywords = extractKeywords(correctOption);
  
  return {
    type: 'guidance',
    message: `La respuesta correcta involucra conceptos relacionados con: ${keywords.join(', ')}`,
    icon: '🎯'
  };
}

function generateSpecificHint(question, selectedAnswer) {
  const isCorrect = selectedAnswer === question.respuestaCorrecta;
  
  if (isCorrect) {
    // Feedback positivo detallado
    return {
      type: 'success',
      message: question.explicacion?.correcta || 'Tu respuesta es correcta.',
      conceptualDescription: extractConceptualDescription(question),
      icon: '🎓'
    };
  }
  
  // Feedback específico del error
  const incorrectExplanation = question.explicacion?.incorrectas?.[selectedAnswer];
  
  return {
    type: 'warning',
    message: incorrectExplanation || 'Esta opción no es la más adecuada para el escenario.',
    whyWrong: explainWhyWrong(question, selectedAnswer),
    icon: '⚠️'
  };
}

function generateBottomOutHint(question) {
  return {
    type: 'reveal',
    correctAnswer: question.opciones[question.respuestaCorrecta],
    fullExplanation: question.explicacion?.correcta,
    resources: question.referencias || [],
    icon: '📖'
  };
}

function extractKeywords(text) {
  const commonWords = new Set(['el', 'la', 'los', 'las', 'un', 'una', 'de', 'del', 'en', 'con', 'para', 'por', 'que', 'se', 'a', 'es', 'y', 'o']);
  const words = text.toLowerCase().split(/\s+/);
  
  return words
    .filter(w => w.length > 4 && !commonWords.has(w))
    .slice(0, 3);
}

function extractConceptualDescription(question) {
  // Extraer conceptos clave del dominio y subdominio
  const concepts = {
    'preparar-datos': 'transformación y limpieza de datos',
    'diseñar-implementar-modelo': 'modelado dimensional y relaciones',
    'crear-calculos-dax': 'lenguaje DAX y contextos',
    'crear-reportes': 'visualización y diseño de UX',
    'optimizar-rendimiento': 'optimización y mejores prácticas',
    'asegurar-gobernar': 'seguridad y gobierno de datos'
  };
  
  return `Este problema evalúa tu comprensión de ${concepts[question.dominio] || 'los conceptos fundamentales'}.`;
}

function explainWhyWrong(question, selectedAnswer) {
  // Análisis de por qué la opción seleccionada es incorrecta
  const selectedText = question.opciones[selectedAnswer].toLowerCase();
  const correctText = question.opciones[question.respuestaCorrecta].toLowerCase();
  
  // Detectar patrones comunes de error
  if (selectedText.includes('siempre') || selectedText.includes('nunca')) {
    return 'Ten cuidado con afirmaciones absolutas; en Power BI hay excepciones según el contexto.';
  }
  
  if (selectedText.includes('eliminar') && correctText.includes('reemplazar')) {
    return 'Eliminar datos puede causar pérdida de información; considera alternativas más conservadoras.';
  }
  
  return 'Esta opción no cumple con las mejores prácticas recomendadas por Microsoft.';
}

// ============================================================================
// COMPONENTE DE FEEDBACK INTELIGENTE
// ============================================================================

const SmartFeedback = ({ question, selectedAnswer, onNextStep }) => {
  const [currentHintLevel, setCurrentHintLevel] = useState(1);
  const [hints, setHints] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);
  
  useEffect(() => {
    const generatedHints = generateProgressiveHints(question, selectedAnswer);
    setHints(generatedHints);
    setCurrentHintLevel(1);
    
    // Animación de entrada
    setTimeout(() => setShowAnimation(false), 500);
  }, [question, selectedAnswer]);
  
  if (!hints) return null;
  
  const isCorrect = selectedAnswer === question.respuestaCorrecta;
  
  const renderHintLevel = () => {
    switch(currentHintLevel) {
      case 1:
        return <HintLevel1 hint={hints.generic} />;
      case 2:
        return <HintLevel2 hint={hints.template} />;
      case 3:
        return <HintLevel3 hint={hints.specific} />;
      case 4:
        return <HintLevel4 hint={hints.bottomOut} />;
      default:
        return null;
    }
  };
  
  return (
    <div className={`smart-feedback ${showAnimation ? 'fade-in' : ''} ${isCorrect ? 'correct' : 'incorrect'}`}>
      <div className="feedback-header">
        <span className="feedback-status">
          {isCorrect ? '✅ Correcto' : '❌ Incorrecto'}
        </span>
        {!isCorrect && currentHintLevel < 4 && (
          <button 
            className="more-help-btn"
            onClick={() => setCurrentHintLevel(prev => Math.min(prev + 1, 4))}
          >
            Necesito más ayuda 🆘
          </button>
        )}
      </div>
      
      <div className="feedback-content">
        {renderHintLevel()}
      </div>
      
      <div className="feedback-footer">
        <HattieTimperelyFramework 
          question={question}
          isCorrect={isCorrect}
          currentLevel={currentHintLevel}
        />
        
        <button className="next-step-btn" onClick={onNextStep}>
          Continuar ➡️
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// SUB-COMPONENTES PARA CADA NIVEL DE HINT
// ============================================================================

const HintLevel1 = ({ hint }) => (
  <div className="hint-level hint-level-1">
    <div className="hint-icon">{hint.icon}</div>
    <div className="hint-message">{hint.message}</div>
  </div>
);

const HintLevel2 = ({ hint }) => (
  <div className="hint-level hint-level-2">
    <div className="hint-icon">{hint.icon}</div>
    <div className="hint-message">{hint.message}</div>
    <div className="hint-subtext">Piensa en estos conceptos para llegar a la respuesta correcta.</div>
  </div>
);

const HintLevel3 = ({ hint }) => (
  <div className="hint-level hint-level-3">
    <div className="hint-icon">{hint.icon}</div>
    <div className="hint-message">{hint.message}</div>
    {hint.conceptualDescription && (
      <div className="conceptual-box">
        <strong>Concepto clave:</strong> {hint.conceptualDescription}
      </div>
    )}
    {hint.whyWrong && (
      <div className="why-wrong-box">
        <strong>Por qué no es correcto:</strong> {hint.whyWrong}
      </div>
    )}
  </div>
);

const HintLevel4 = ({ hint }) => (
  <div className="hint-level hint-level-4">
    <div className="hint-icon">{hint.icon}</div>
    <div className="reveal-box">
      <h4>Respuesta Correcta:</h4>
      <p className="correct-answer-text">{hint.correctAnswer}</p>
    </div>
    <div className="full-explanation">
      <h4>Explicación Completa:</h4>
      <p>{hint.fullExplanation}</p>
    </div>
    {hint.resources && hint.resources.length > 0 && (
      <div className="resources-box">
        <h4>Recursos de Estudio:</h4>
        <ul>
          {hint.resources.map((resource, idx) => (
            <li key={idx}>
              <a href={resource} target="_blank" rel="noopener noreferrer">
                📚 {resource}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// ============================================================================
// MARCO DE HATTIE & TIMPERLEY
// ============================================================================

const HattieTimperelyFramework = ({ question, isCorrect, currentLevel }) => {
  // ¿A dónde voy? - Metas de aprendizaje
  const learningGoal = `Dominar ${question.dominio.replace(/-/g, ' ')} - Nivel ${question.nivel}`;
  
  // ¿Cómo voy? - Progreso
  const progressStatus = isCorrect 
    ? '✅ Estás en el camino correcto' 
    : '⚠️ Necesitas reforzar este concepto';
  
  // ¿Qué sigue? - Próximos pasos
  const nextSteps = isCorrect
    ? ['Intentar preguntas de nivel superior', 'Explorar variaciones de este escenario']
    : currentLevel < 4
    ? ['Revisar los hints progresivos', 'Estudiar la explicación detallada', 'Consultar recursos oficiales']
    : ['Estudiar los recursos recomendados', 'Practicar más preguntas de este dominio', 'Revisar documentación oficial'];
  
  return (
    <div className="hattie-framework">
      <div className="framework-section">
        <strong>🎯 ¿A dónde voy?</strong>
        <p>{learningGoal}</p>
      </div>
      <div className="framework-section">
        <strong>📊 ¿Cómo voy?</strong>
        <p>{progressStatus}</p>
      </div>
      <div className="framework-section">
        <strong>🚀 ¿Qué sigue?</strong>
        <ul>
          {nextSteps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// FEEDBACK POSITIVO ESPECÍFICO
// ============================================================================

export function generatePositiveFeedback(question, timeTaken, streak) {
  const messages = [];
  
  // Mensaje base
  messages.push('¡Excelente trabajo! 🎉');
  
  // Velocidad
  if (timeTaken < 30) {
    messages.push('Respondiste muy rápido. ⚡');
  }
  
  // Racha
  if (streak >= 5) {
    messages.push(`¡Llevas ${streak} respuestas correctas seguidas! 🔥`);
  }
  
  // Dificultad
  if (question.nivel === 'avanzado') {
    messages.push('Esta era una pregunta avanzada y la dominaste. 💪');
  }
  
  // Característica que hizo la acción correcta
  const correctOption = question.opciones[question.respuestaCorrecta];
  messages.push(`Tu elección de "${correctOption.substring(0, 50)}..." demuestra comprensión profunda.`);
  
  return messages.join(' ');
}

// ============================================================================
// ANÁLISIS DE PATRONES DE ERROR
// ============================================================================

export function analyzeErrorPatterns(quizHistory) {
  const errorPatterns = {
    domainWeakness: {},
    commonMisconceptions: [],
    consistencyIssues: []
  };
  
  // Analizar debilidades por dominio
  quizHistory.forEach(quiz => {
    quiz.questions.forEach((q, idx) => {
      if (quiz.answers[idx] !== q.respuestaCorrecta) {
        if (!errorPatterns.domainWeakness[q.dominio]) {
          errorPatterns.domainWeakness[q.dominio] = 0;
        }
        errorPatterns.domainWeakness[q.dominio]++;
      }
    });
  });
  
  // Identificar áreas que necesitan más atención
  const weakDomains = Object.entries(errorPatterns.domainWeakness)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([domain, count]) => ({
      domain,
      errorCount: count,
      recommendation: getDomainRecommendation(domain)
    }));
  
  return {
    weakDomains,
    overallAccuracy: calculateOverallAccuracy(quizHistory),
    improvementSuggestions: generateImprovementSuggestions(weakDomains)
  };
}

function getDomainRecommendation(domain) {
  const recommendations = {
    'preparar-datos': 'Estudia Power Query y técnicas de ETL',
    'diseñar-implementar-modelo': 'Refuerza star schema y relaciones',
    'crear-calculos-dax': 'Practica DAX en DAX Studio',
    'crear-reportes': 'Revisa principios de visualización',
    'optimizar-rendimiento': 'Estudia Performance Analyzer',
    'asegurar-gobernar': 'Aprende sobre RLS y governance'
  };
  
  return recommendations[domain] || 'Revisa documentación oficial';
}

function calculateOverallAccuracy(quizHistory) {
  let totalCorrect = 0;
  let totalQuestions = 0;
  
  quizHistory.forEach(quiz => {
    quiz.questions.forEach((q, idx) => {
      totalQuestions++;
      if (quiz.answers[idx] === q.respuestaCorrecta) {
        totalCorrect++;
      }
    });
  });
  
  return totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
}

function generateImprovementSuggestions(weakDomains) {
  return weakDomains.map(wd => ({
    area: wd.domain,
    priority: wd.errorCount > 5 ? 'high' : wd.errorCount > 2 ? 'medium' : 'low',
    actions: [
      wd.recommendation,
      'Realizar quiz enfocado en este dominio',
      'Revisar preguntas incorrectas anteriores'
    ]
  }));
}

export default SmartFeedback;
