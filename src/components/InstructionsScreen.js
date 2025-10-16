import React from 'react';
import '../styles/InstructionsScreen.css';
import { questionCounter } from '../utils/questionCounter';

const InstructionsScreen = ({ onNavigate, quizConfig }) => {
  // Obtener estadísticas de preguntas disponibles
  const stats = questionCounter.getDetailedStats(quizConfig.domain, quizConfig.level);
  const statusMessage = questionCounter.getStatusMessage(
    quizConfig.domain, 
    quizConfig.level, 
    quizConfig.numberOfQuestions
  );
  const canStart = questionCounter.canStartQuiz(
    quizConfig.domain,
    quizConfig.level,
    quizConfig.numberOfQuestions
  );

  const getDomainLabel = (domain) => {
    const labels = {
      'all': 'Todos los Dominios',
      'preparar-datos': 'Preparar Datos',
      'modelar-datos': 'Modelar Datos',
      'visualizar-analizar': 'Visualizar y Analizar',
      'administrar-asegurar': 'Administrar y Asegurar'
    };
    return labels[domain] || domain;
  };

  const getLevelLabel = (level) => {
    const labels = {
      'all': 'Todos los Niveles',
      'principiante': 'Principiante',
      'intermedio': 'Intermedio',
      'avanzado': 'Avanzado'
    };
    return labels[level] || level;
  };

  return (
    <div className="instructions-screen">
      <div className="instructions-container">
        <header className="instructions-header">
          <h1>📋 Instrucciones del Quiz</h1>
          <p className="subtitle">Lee cuidadosamente antes de comenzar</p>
        </header>

        <div className="config-summary">
          <h2>Tu Configuración</h2>
          <div className="summary-cards">
            <div className="summary-card">
              <span className="summary-icon">📚</span>
              <div className="summary-content">
                <span className="summary-label">Dominio</span>
                <span className="summary-value">{getDomainLabel(quizConfig.domain)}</span>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">⭐</span>
              <div className="summary-content">
                <span className="summary-label">Nivel</span>
                <span className="summary-value">{getLevelLabel(quizConfig.level)}</span>
              </div>
            </div>
            <div className="summary-card">
              <span className="summary-icon">🔢</span>
              <div className="summary-content">
                <span className="summary-label">Preguntas</span>
                <span className="summary-value">{quizConfig.numberOfQuestions}</span>
              </div>
            </div>
          </div>

          {/* Nuevo: Información de preguntas disponibles */}
          <div className={`questions-availability ${statusMessage.type}`}>
            <div className="availability-header">
              <span className="availability-icon">{statusMessage.icon}</span>
              <div className="availability-text">
                <p className="availability-message">{statusMessage.message}</p>
                <p className="availability-suggestion">{statusMessage.suggestion}</p>
              </div>
            </div>
            
            <div className="availability-stats">
              <div className="stat-item">
                <span className="stat-label">Disponibles</span>
                <span className="stat-value available">{stats.available}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total</span>
                <span className="stat-value total">{stats.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completado</span>
                <span className="stat-value percentage">{stats.percentage}%</span>
              </div>
            </div>

            {!canStart.canStart && (
              <div className="availability-warning">
                <strong>⚠️ Atención:</strong> Solo hay {canStart.available} preguntas disponibles, 
                pero solicitaste {canStart.requested}. El quiz usará las {canStart.available} disponibles.
              </div>
            )}
          </div>
        </div>

        <div className="exam-guide-callout">
          <div className="callout-icon">📘</div>
          <div className="callout-copy">
            <h3>Necesitas el mapa completo del examen?</h3>
            <p>
              Consulta la guia estrategica PL-300 con pesos oficiales, formatos de pregunta,
              trampas frecuentes y recursos recomendados.
            </p>
          </div>
          <button className="callout-button" onClick={() => onNavigate('exam-guide')}>
            Abrir guia →
          </button>
        </div>

        <div className="instructions-content">
          <section className="instruction-section">
            <div className="section-icon">🎯</div>
            <h3>Objetivo del Quiz</h3>
            <p>
              Este quiz está diseñado para evaluar tu conocimiento sobre Microsoft Power BI
              y prepararte para el examen oficial PL-300. Las preguntas están alineadas con
              la guía oficial del examen.
            </p>
          </section>

          <section className="instruction-section">
            <div className="section-icon">⏱️</div>
            <h3>Formato y Tiempo</h3>
            <ul>
              <li>El quiz no tiene límite de tiempo, puedes tomarlo a tu ritmo</li>
              <li>Cada pregunta es de opción múltiple con una sola respuesta correcta</li>
              <li>Puedes navegar entre preguntas usando los botones de navegación</li>
              <li>Tu progreso se guarda automáticamente</li>
            </ul>
          </section>

          <section className="instruction-section">
            <div className="section-icon">✅</div>
            <h3>Cómo Responder</h3>
            <ul>
              <li>Lee cuidadosamente cada pregunta antes de responder</li>
              <li>Selecciona la opción que consideres correcta</li>
              <li>Puedes cambiar tu respuesta antes de finalizar el quiz</li>
              <li>Las preguntas marcadas aparecerán resaltadas en la barra de progreso</li>
            </ul>
          </section>

          <section className="instruction-section">
            <div className="section-icon">📊</div>
            <h3>Resultados y Análisis</h3>
            <ul>
              <li>Al finalizar, verás tu puntuación total y por dominio</li>
              <li>Recibirás explicaciones detalladas para cada pregunta</li>
              <li>Podrás ver un análisis profundo de tu desempeño</li>
              <li>Se identificarán tus áreas fuertes y oportunidades de mejora</li>
            </ul>
          </section>

          <section className="instruction-section highlight">
            <div className="section-icon">💡</div>
            <h3>Consejos para el Examen</h3>
            <ul>
              <li>Lee todas las opciones antes de elegir tu respuesta</li>
              <li>Presta atención a palabras clave como "mejor práctica", "más eficiente"</li>
              <li>Elimina las opciones claramente incorrectas primero</li>
              <li>Si no estás seguro, confía en tu primera impresión</li>
              <li>Revisa las explicaciones después para reforzar tu aprendizaje</li>
            </ul>
          </section>

          <section className="instruction-section warning">
            <div className="section-icon">⚠️</div>
            <h3>Importante</h3>
            <ul>
              <li>Una vez que finalices el quiz, no podrás modificar tus respuestas</li>
              <li>Asegúrate de haber respondido todas las preguntas antes de finalizar</li>
              <li>Este quiz es para práctica y no otorga certificación oficial</li>
            </ul>
          </section>
        </div>

        <div className="instructions-actions">
          <button className="back-button" onClick={() => onNavigate('home')}>
            ← Volver a Configuración
          </button>
          <button className="start-quiz-button" onClick={() => onNavigate('quiz')}>
            Comenzar Quiz →
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionsScreen;
