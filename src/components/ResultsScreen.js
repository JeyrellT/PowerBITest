import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../styles/ResultsScreen.css';
import { useCxCProgress } from '../contexts/CxCProgressContext';
import { ProfileImpactCalculator } from '../utils/profileImpact';
import AchievementUnlocked from './AchievementUnlocked';

const ResultsScreen = ({ onNavigate, results }) => {
  const [expandedQuestions, setExpandedQuestions] = useState(new Set());
  const [progressUpdate, setProgressUpdate] = useState(null);
  const [newAchievements, setNewAchievements] = useState([]);
  const [achievementQueue, setAchievementQueue] = useState([]);
  const [currentAchievement, setCurrentAchievement] = useState(null);
  
  // ✅ SOLUCIÓN CRÍTICA: Sistema robusto anti-duplicación
  const processedQuizId = useRef(null);
  const isProcessing = useRef(false);
  const resultsProcessed = useRef(new Set());
  const processedTimestamp = useRef(null);

  // ✅ ÚNICA FUENTE DE VERDAD: useCxCProgress
  const {
    recordQuestionAttempt,
    saveAnsweredQuestion,
    updateProgressAfterQuiz,
    checkAchievements,
    getQuestionTrackingStats,
    getQuestionTracking,
    getAllQuestionsTracking,
    getIncorrectQuestions, // 🆕 Para obtener preguntas incorrectas
    getIncorrectQuestionsStats // 🆕 Para estadísticas de incorrectas
  } = useCxCProgress();

  // ✅ Crear instancia de ProfileImpactCalculator con inyección de dependencias
  const profileImpact = useMemo(() => {
    return new ProfileImpactCalculator({
      getQuestionTracking,
      getAllQuestionsTracking,
      getQuestionTrackingStats
    });
  }, [getQuestionTracking, getAllQuestionsTracking, getQuestionTrackingStats]);

  // 🆕 Calcular estadísticas de preguntas incorrectas
  const incorrectStats = useMemo(() => {
    return getIncorrectQuestionsStats();
  }, [getIncorrectQuestionsStats]);

  // 🆕 Handler para comenzar quiz de repaso con solo preguntas incorrectas
  const handleRetryIncorrect = () => {
    const incorrectQuestions = getIncorrectQuestions();
    
    if (incorrectQuestions.length === 0) {
      alert('¡Excelente! No tienes preguntas incorrectas que repasar.');
      return;
    }
    
    // Navegar al quiz con configuración especial para preguntas incorrectas
    onNavigate('quiz', {
      config: {
        domain: 'all',
        level: 'all',
        numberOfQuestions: Math.min(incorrectQuestions.length, 10),
        incorrectOnly: true, // 🆕 Flag especial para filtrar solo incorrectas
        incorrectQuestions // 🆕 Lista explícita de preguntas a incluir
      }
    });
  };

  useEffect(() => {
    // ✅ PREVENIR EJECUCIONES CONCURRENTES/DUPLICADAS
    if (!results || !results.questions || !results.answers) {
      return;
    }

    // ✅ GENERAR ID ÚNICO MÁS ROBUSTO (incluir timestamp de creación del resultado)
    const resultTimestamp = results.timestamp || Date.now();
    const quizSignature = JSON.stringify({
      questionIds: results.questions.map(q => q.id).sort(),
      answers: Object.entries(results.answers).sort(),
      timeElapsed: results.timeElapsed,
      domain: results.config?.domain || 'all'
    });
    const quizId = `${resultTimestamp}_${btoa(quizSignature).substring(0, 10)}`;
    
    // 🆕 VERIFICACIÓN DEFINITIVA: Si ya procesamos ESTE resultado específico, salir
    if (resultsProcessed.current.has(quizId)) {
      console.log('⛔ Resultado ya procesado definitivamente, ignorando:', quizId);
      return;
    }
    
    const currentTime = Date.now();
    
    // ⚠️ VERIFICACIÓN TEMPORAL: < 1000ms desde último procesamiento
    if (processedTimestamp.current && (currentTime - processedTimestamp.current) < 1000) {
      console.log('⏸️ Procesamiento muy reciente (< 1s), ignorando');
      return;
    }
    
    // ⚠️ LOCK CONCURRENTE
    if (isProcessing.current) {
      console.log('⚠️ Procesamiento en curso, abortando duplicado');
      return;
    }
    
    // 🔒 BLOQUEO INMEDIATO Y DEFINITIVO
    isProcessing.current = true;
    processedQuizId.current = quizId;
    resultsProcessed.current.add(quizId);
    processedTimestamp.current = currentTime;
    
    console.log('✅ Quiz ÚNICO bloqueado para procesamiento:', {
      quizId,
      timestamp: resultTimestamp,
      questions: results.questions.length
    });
    
    // ✅ SOLUCIÓN #2: Agregar logs extensivos para rastrear guardado
    console.log('📊 ResultsScreen - Procesando resultados del quiz (ÚNICO):', {
      quizId,
      totalQuestions: results.questions.length,
      totalAnswers: Object.keys(results.answers).length,
      timeElapsed: results.timeElapsed,
      config: results.config
    });
    
    // 🎯 INTEGRACIÓN SIMPLIFICADA - EVITAR DUPLICACIONES
    
    // ✅ SOLUCIÓN CRÍTICA: NO registrar preguntas individualmente aquí
    // updateProgressAfterQuiz ya se encarga de TODO el procesamiento
    // Registrar individualmente causa DUPLICACIÓN de datos
    
    console.log('📋 Preparando datos para updateProgressAfterQuiz (sin duplicar tracking)');

    // 2. Calcular detalles de preguntas para el progreso
    const questionDetails = results.questions.map((question, index) => ({
      id: question.id,
      domain: question.dominio,
      level: question.nivel, // ✅ Incluir nivel para cálculo de puntos
      correct: results.answers[index] === question.respuestaCorrecta,
      timeSpent: results.timeElapsed / results.questions.length
    }));

    // 3. Preparar datos para actualizar progreso
    const quizResultsData = {
      quizId, // ✅ CRÍTICO: Pasar el ID único del quiz para prevenir duplicación
      totalQuestions: results.questions.length,
      correctAnswers: Object.keys(results.answers).filter((index) => 
        results.answers[index] === results.questions[index].respuestaCorrecta
      ).length,
      totalTime: results.timeElapsed,
      domain: results.config?.domain || 'all',
      questionDetails
    };

    // 4. ✅ ÚNICA ACTUALIZACIÓN - updateProgressAfterQuiz maneja TODO
    // (puntos, XP, domainStats, levelStats, history, achievements, racha, etc.)
    console.log('🎯 Llamando updateProgressAfterQuiz con:', quizResultsData);
    const updateInfo = updateProgressAfterQuiz(quizResultsData);
    console.log('✅ Resultado de updateProgressAfterQuiz:', updateInfo);
    setProgressUpdate(updateInfo);
    
    // ✅ SOLUCIÓN #5: Forzar sincronización y notificar cambios
    // Disparar evento personalizado para que otros componentes sepan que hay cambios
    window.dispatchEvent(new CustomEvent('progressUpdated', {
      detail: { updateInfo, questionsProcessed: results.questions.length }
    }));
    
    // 5. ✅ Verificar y desbloquear logros
    setTimeout(() => {
      const unlockedAchievements = checkAchievements();
      if (unlockedAchievements && unlockedAchievements.length > 0) {
        setNewAchievements(unlockedAchievements);
        setAchievementQueue(unlockedAchievements); // Inicializar queue para popups
        console.log('🏆 Logros desbloqueados:', unlockedAchievements);
      }
    }, 500); // Delay para asegurar que el estado se actualizó
    
    console.log('✅ Progreso actualizado correctamente (CONTEXTO CENTRALIZADO):', {
      questionsTracked: results.questions.length,
      trackingStats: getQuestionTrackingStats(),
      profileImpact: profileImpact.calculateGlobalCompetencyChange()
    });
    
    // 🆕 Al finalizar, asegurar que el flag permanece
    // NO resetear hasProcessedResults.current aquí
    
    // Solo liberar el lock de procesamiento concurrente
    setTimeout(() => {
      isProcessing.current = false;
    }, 100);
    
    // ✅ Cleanup: Liberar lock después de un tiempo razonable
    const timeoutId = setTimeout(() => {
      isProcessing.current = false;
    }, 2000); // Liberar lock después de 2 segundos
    
    return () => {
      clearTimeout(timeoutId);
      isProcessing.current = false;
    };
  }, [
    results, 
    recordQuestionAttempt, 
    saveAnsweredQuestion, 
    updateProgressAfterQuiz, 
    checkAchievements, 
    getQuestionTrackingStats,
    profileImpact
  ]); // ✅ Añadidas todas las dependencias necesarias

  // 🎉 Efecto para manejar queue de popups de achievements
  useEffect(() => {
    if (achievementQueue.length > 0 && !currentAchievement) {
      // Mostrar el primer achievement de la queue
      setCurrentAchievement(achievementQueue[0]);
      setAchievementQueue(prev => prev.slice(1)); // Remover de la queue
    }
  }, [achievementQueue, currentAchievement]);

  // Handler para cerrar popup y continuar con siguiente achievement
  const handleAchievementClose = () => {
    setCurrentAchievement(null);
    // El useEffect anterior automáticamente mostrará el siguiente si hay más en la queue
  };

  if (!results) {
    return <div>No hay resultados disponibles</div>;
  }

  const { questions, answers, timeElapsed } = results;

  // Calcular estadísticas
  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(answers).length;
  let correctAnswers = 0;
  let incorrectAnswers = 0;

  questions.forEach((question, index) => {
    if (answers[index] !== undefined) {
      if (answers[index] === question.respuestaCorrecta) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }
    }
  });

  const score = ((correctAnswers / totalQuestions) * 100).toFixed(1);
  const unanswered = totalQuestions - answeredQuestions;

  // Estadísticas por dominio
  const domainStats = {};
  questions.forEach((question, index) => {
    const domain = question.dominio;
    if (!domainStats[domain]) {
      domainStats[domain] = { total: 0, correct: 0 };
    }
    domainStats[domain].total++;
    if (answers[index] === question.respuestaCorrecta) {
      domainStats[domain].correct++;
    }
  });

  // Estadísticas por nivel
  const levelStats = {};
  questions.forEach((question, index) => {
    const level = question.nivel;
    if (!levelStats[level]) {
      levelStats[level] = { total: 0, correct: 0 };
    }
    levelStats[level].total++;
    if (answers[index] === question.respuestaCorrecta) {
      levelStats[level].correct++;
    }
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const toggleQuestion = (index) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedQuestions(newExpanded);
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getPassStatus = () => {
    if (score >= 70) return { text: '¡Aprobado!', icon: '🎉', class: 'pass' };
    return { text: 'No Aprobado', icon: '📚', class: 'fail' };
  };

  const status = getPassStatus();

  return (
    <div className="results-screen">
      <div className="results-container">
        <header className="results-header">
          <h1>Resultados del Quiz</h1>
          <p className="results-subtitle">Revisa tu desempeño y aprende de tus respuestas</p>
        </header>

        {/* Mostrar logros y puntos ganados */}
        {progressUpdate && progressUpdate.pointsEarned > 0 && (
          <div className="achievements-banner">
            <div className="points-earned">
              <span className="points-icon">⭐</span>
              <div className="points-info">
                <span className="points-value">+{progressUpdate.pointsEarned} puntos</span>
                <span className="points-label">¡Ganados en este quiz!</span>
              </div>
            </div>
            
            {/* ✅ CONSOLIDADO: Solo mostrar si HAY logros */}
            {newAchievements && newAchievements.length > 0 && (
              <div className="new-achievements">
                <h3>🏆 ¡Nuevos Logros Desbloqueados!</h3>
                <div className="achievements-list">
                  {/* ✅ Usar Set para eliminar duplicados por ID */}
                  {Array.from(new Set(newAchievements.map(a => a.id)))
                    .map(id => newAchievements.find(a => a.id === id))
                    .map((achievement) => (
                      <div key={achievement.id} className="achievement-unlocked">
                        <span className="achievement-icon-large">{achievement.icon}</span>
                        <div className="achievement-details">
                          <span className="achievement-name">{achievement.name}</span>
                          <span className="achievement-points">+{achievement.points} pts</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {progressUpdate && progressUpdate.levelUp && (
              <div className="level-up-notification">
                <span className="level-up-icon">🎉</span>
                <span className="level-up-text">¡Subiste de nivel!</span>
              </div>
            )}
          </div>
        )}

        <div className="score-section">
          <div className={`score-card main-score ${status.class}`}>
            <div className="score-icon">{status.icon}</div>
            <div className="score-content">
              <div className="score-number" style={{ color: getScoreColor(score) }}>
                {score}%
              </div>
              <div className="score-label">{status.text}</div>
              <div className="score-details">
                {correctAnswers} de {totalQuestions} preguntas correctas
              </div>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon correct">✓</div>
              <div className="stat-content">
                <div className="stat-value">{correctAnswers}</div>
                <div className="stat-label">Correctas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon incorrect">✗</div>
              <div className="stat-content">
                <div className="stat-value">{incorrectAnswers}</div>
                <div className="stat-label">Incorrectas</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon unanswered">?</div>
              <div className="stat-content">
                <div className="stat-value">{unanswered}</div>
                <div className="stat-label">Sin Responder</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon time">⏱️</div>
              <div className="stat-content">
                <div className="stat-value">{formatTime(timeElapsed)}</div>
                <div className="stat-label">Tiempo Total</div>
              </div>
            </div>
          </div>
        </div>

        <div className="breakdown-section">
          <h2>Análisis por Dominio</h2>
          <div className="domain-stats">
            {Object.entries(domainStats).map(([domain, stats]) => {
              const percentage = ((stats.correct / stats.total) * 100).toFixed(0);
              return (
                <div key={domain} className="domain-stat-card">
                  <div className="domain-header">
                    <span className="domain-name">{domain}</span>
                    <span className="domain-score" style={{ color: getScoreColor(percentage) }}>
                      {percentage}%
                    </span>
                  </div>
                  <div className="domain-bar">
                    <div
                      className="domain-bar-fill"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: getScoreColor(percentage)
                      }}
                    ></div>
                  </div>
                  <div className="domain-details">
                    {stats.correct} / {stats.total} correctas
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="breakdown-section">
          <h2>Análisis por Nivel</h2>
          <div className="level-stats">
            {Object.entries(levelStats).map(([level, stats]) => {
              const percentage = ((stats.correct / stats.total) * 100).toFixed(0);
              return (
                <div key={level} className="level-stat-card">
                  <div className="level-icon">
                    {level === 'principiante' && '🌱'}
                    {level === 'intermedio' && '🚀'}
                    {level === 'avanzado' && '🏆'}
                  </div>
                  <div className="level-content">
                    <div className="level-name">{level}</div>
                    <div className="level-score">{percentage}%</div>
                    <div className="level-details">
                      {stats.correct} / {stats.total}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección de Recomendaciones Personalizadas */}
        <div className="recommendations-section">
          <h2>📋 Recomendaciones Personalizadas</h2>
          <div className="recommendations-grid">
            {/* Recomendación basada en score general */}
            {score >= 85 && (
              <div className="recommendation-card excellent">
                <div className="rec-icon">🎯</div>
                <div className="rec-content">
                  <h3>¡Excelente Desempeño!</h3>
                  <p>Tienes un dominio sólido del material. Estás listo para:</p>
                  <ul>
                    <li>✅ Intentar preguntas de nivel avanzado</li>
                    <li>✅ Practicar con exámenes simulados completos</li>
                    <li>✅ Repasar temas específicos donde tuviste errores</li>
                  </ul>
                </div>
              </div>
            )}
            
            {score >= 70 && score < 85 && (
              <div className="recommendation-card good">
                <div className="rec-icon">📈</div>
                <div className="rec-content">
                  <h3>Buen Progreso</h3>
                  <p>Vas por buen camino. Para mejorar tu preparación:</p>
                  <ul>
                    <li>🎯 Enfócate en los dominios con menor porcentaje</li>
                    <li>📚 Revisa las explicaciones de las preguntas incorrectas</li>
                    <li>🔄 Practica más preguntas del nivel intermedio</li>
                  </ul>
                </div>
              </div>
            )}
            
            {score < 70 && (
              <div className="recommendation-card needs-improvement">
                <div className="rec-icon">💪</div>
                <div className="rec-content">
                  <h3>Sigue Practicando</h3>
                  <p>Necesitas reforzar algunos conceptos. Te recomendamos:</p>
                  <ul>
                    <li>📖 Revisar la documentación de Microsoft Learn</li>
                    <li>🌱 Comenzar con preguntas de nivel principiante</li>
                    <li>⏰ Dedicar más tiempo a estudiar cada dominio</li>
                    <li>🔄 Repetir este quiz después de estudiar</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Recomendaciones por dominio con bajo desempeño */}
            {Object.entries(domainStats)
              .filter(([_, stats]) => (stats.correct / stats.total) < 0.6)
              .map(([domain, stats]) => {
                const percentage = ((stats.correct / stats.total) * 100).toFixed(0);
                return (
                  <div key={domain} className="recommendation-card domain-focus">
                    <div className="rec-icon">🎓</div>
                    <div className="rec-content">
                      <h3>Refuerza: {domain}</h3>
                      <p>Obtuviste {percentage}% en este dominio ({stats.correct}/{stats.total} correctas)</p>
                      <ul>
                        <li>📚 Estudia más sobre: {domain}</li>
                        <li>🔍 Repasa las {stats.total - stats.correct} preguntas incorrectas</li>
                        <li>💡 Practica más preguntas de esta categoría</li>
                      </ul>
                    </div>
                  </div>
                );
              })}

            {/* Recomendación de tiempo si fue muy rápido o lento */}
            {timeElapsed / questions.length < 20 && (
              <div className="recommendation-card time-warning">
                <div className="rec-icon">⚡</div>
                <div className="rec-content">
                  <h3>Gestión del Tiempo</h3>
                  <p>Respondiste muy rápido (promedio: {Math.round(timeElapsed / questions.length)}s por pregunta)</p>
                  <ul>
                    <li>📖 Lee cada pregunta con más atención</li>
                    <li>🤔 Analiza todas las opciones antes de responder</li>
                    <li>✅ Verifica tu respuesta antes de confirmar</li>
                  </ul>
                </div>
              </div>
            )}
            
            {timeElapsed / questions.length > 90 && (
              <div className="recommendation-card time-warning">
                <div className="rec-icon">⏱️</div>
                <div className="rec-content">
                  <h3>Gestión del Tiempo</h3>
                  <p>Tomaste bastante tiempo (promedio: {Math.round(timeElapsed / questions.length)}s por pregunta)</p>
                  <ul>
                    <li>⚡ Practica más para ganar velocidad</li>
                    <li>🎯 Identifica rápidamente las palabras clave</li>
                    <li>🧠 Descarta opciones obviamente incorrectas primero</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="questions-review">
          <h2>Revisión de Preguntas</h2>
          {questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.respuestaCorrecta;
            const isAnswered = userAnswer !== undefined;
            const isExpanded = expandedQuestions.has(index);

            return (
              <div
                key={index}
                className={`question-review-card ${
                  isAnswered ? (isCorrect ? 'correct' : 'incorrect') : 'unanswered'
                }`}
              >
                <div className="question-review-header" onClick={() => toggleQuestion(index)}>
                  <div className="question-review-title">
                    <span className="question-review-number">#{index + 1}</span>
                    <span className="question-review-text">{question.pregunta}</span>
                  </div>
                  <div className="question-review-status">
                    {isAnswered ? (
                      isCorrect ? (
                        <span className="status-icon correct">✓</span>
                      ) : (
                        <span className="status-icon incorrect">✗</span>
                      )
                    ) : (
                      <span className="status-icon unanswered">?</span>
                    )}
                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                  </div>
                </div>

                {isExpanded && (
                  <div className="question-review-details">
                    <div className="question-meta">
                      <span className="meta-tag">{question.dominio}</span>
                      <span className="meta-tag">{question.nivel}</span>
                    </div>

                    <div className="answers-review">
                      {question.opciones.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`answer-option ${
                            optIndex === question.respuestaCorrecta ? 'correct-answer' : ''
                          } ${optIndex === userAnswer ? 'user-answer' : ''}`}
                        >
                          <span className="option-letter">
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span className="option-text">{option}</span>
                          {optIndex === question.respuestaCorrecta && (
                            <span className="correct-badge">✓ Correcta</span>
                          )}
                          {optIndex === userAnswer && optIndex !== question.respuestaCorrecta && (
                            <span className="incorrect-badge">Tu respuesta</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="explanation-section">
                      <h4>💡 Explicación</h4>
                      <p className="explanation-text">{question.explicacion.correcta}</p>
                      
                      {question.trampaComun && (
                        <div className="trap-warning">
                          <strong>⚠️ Trampa Común:</strong> {question.trampaComun}
                        </div>
                      )}

                      {question.referencias && question.referencias.length > 0 && (
                        <div className="references">
                          <strong>📚 Referencias:</strong>
                          {question.referencias.map((ref, i) => (
                            <a key={i} href={ref} target="_blank" rel="noopener noreferrer">
                              {ref}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="results-actions">
          <button className="action-button secondary" onClick={() => onNavigate('home')}>
            🏠 Volver al Inicio
          </button>
          
          {/* 🆕 Botón para repasar solo preguntas incorrectas */}
          {incorrectStats && incorrectStats.total > 0 && (
            <button 
              className="action-button warning" 
              onClick={handleRetryIncorrect}
              title={`Tienes ${incorrectStats.total} pregunta(s) que necesitan repaso`}
            >
              🔄 Repasar Incorrectas ({incorrectStats.total})
            </button>
          )}
          
          <button
            className="action-button primary"
            onClick={() => onNavigate('analysis', { results }, 'quiz-complete')}
          >
            📊 Ver Análisis Detallado
          </button>
        </div>
      </div>

      {/* 🎉 Popup de achievement desbloqueado */}
      {currentAchievement && (
        <AchievementUnlocked
          achievement={currentAchievement}
          onClose={handleAchievementClose}
          autoCloseDelay={6000}
        />
      )}
    </div>
  );
};

export default ResultsScreen;
