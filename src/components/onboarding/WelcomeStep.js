import React from 'react';

const WelcomeStep = ({ onComplete }) => {
  return (
    <div className="onboarding-step welcome-step">
      <div className="welcome-content">
        <div className="welcome-icon-large">🎯</div>
        <h1 className="welcome-title">Bienvenido a PL-300 Quiz Master</h1>
        <p className="welcome-subtitle">
          Sistema de evaluación inteligente que se adapta a tu nivel de experiencia
        </p>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Personalizado</h3>
            <p>Se adapta a tu experiencia: desde Excel básico hasta Power BI avanzado</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Diagnóstico Preciso</h3>
            <p>Identifica fortalezas y áreas de mejora usando taxonomía de Bloom</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚀</div>
            <h3>Rutas de Estudio</h3>
            <p>Plan personalizado basado en tus resultados y objetivos</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3>Gamificación</h3>
            <p>Badges, puntos y logros para mantener tu motivación</p>
          </div>
        </div>

        <div className="welcome-stats">
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

        <button className="btn-primary btn-large btn-glow" onClick={() => onComplete({})}>
          Comenzar Evaluación
          <span className="btn-arrow">→</span>
        </button>

        <p className="welcome-note">
          <span className="note-icon">ℹ️</span>
          No requiere registro. Tu progreso se guarda localmente.
        </p>
      </div>
    </div>
  );
};

export default WelcomeStep;
