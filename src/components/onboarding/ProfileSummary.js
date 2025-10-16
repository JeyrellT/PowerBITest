import React from 'react';

const ProfileSummary = ({ userData, onComplete }) => {
  const profileConfig = {
    basico: {
      icon: '🌱',
      title: 'Perfil: Fundamentos',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      message: '¡Perfecto! Comenzaremos con los conceptos fundamentales de Power BI.',
      description: 'Tu experiencia con Excel es una excelente base. Te guiaremos paso a paso para dominar Power BI.',
      recommendations: [
        'Comenzarás con preguntas de nivel principiante',
        'Verás comparaciones con Excel cuando sea relevante',
        'Explicaciones detalladas con ejemplos visuales',
        'Sin límite de tiempo - tómate tu tiempo para aprender'
      ],
      startConfig: {
        difficulty: 'principiante',
        domain: 'preparar-datos',
        questionCount: 15,
        mode: 'study'
      }
    },
    intermedio: {
      icon: '📚',
      title: 'Perfil: Intermedio',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      message: 'Tienes una buena base. ¡Vamos a profundizar en DAX y mejores prácticas!',
      description: 'Nos enfocaremos en mejorar tus habilidades de modelado de datos y DAX.',
      recommendations: [
        'Mix de preguntas intermedias y avanzadas',
        'Énfasis en DAX y optimización',
        'Escenarios del mundo real',
        'Tiempo sugerido: 45 minutos'
      ],
      startConfig: {
        difficulty: 'intermedio',
        domain: 'all',
        questionCount: 25,
        mode: 'practice'
      }
    },
    avanzado: {
      icon: '⭐',
      title: 'Perfil: Avanzado',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      message: '¡Excelente! Simularemos el examen PL-300 con escenarios complejos.',
      description: 'Estás listo para enfrentar preguntas de nivel certificación.',
      recommendations: [
        'Preguntas de nivel avanzado',
        'Casos complejos y troubleshooting',
        'Simulación del examen real (90 min)',
        'Enfoque en dominios según peso del examen'
      ],
      startConfig: {
        difficulty: 'avanzado',
        domain: 'all',
        questionCount: 40,
        mode: 'exam'
      }
    }
  };

  const profile = profileConfig[userData.experienceLevel] || profileConfig.basico;
  const technicalAccuracy = userData.technicalAccuracy || 0;

  const getReadinessMessage = () => {
    if (technicalAccuracy >= 80) {
      return {
        text: '¡Excelente preparación!',
        icon: '🎉',
        color: '#10b981'
      };
    } else if (technicalAccuracy >= 60) {
      return {
        text: 'Buena base, sigue practicando',
        icon: '👍',
        color: '#3b82f6'
      };
    } else {
      return {
        text: 'Enfócate en los fundamentos',
        icon: '💪',
        color: '#f59e0b'
      };
    }
  };

  const readiness = getReadinessMessage();

  const handleStartQuiz = () => {
    onComplete({
      profileSummary: {
        level: userData.experienceLevel,
        ...profile.startConfig
      }
    });
  };

  return (
    <div className="onboarding-step profile-summary">
      <div className="summary-header">
        <div 
          className="profile-icon-large"
          style={{ background: profile.gradient }}
        >
          {profile.icon}
        </div>
        <h2>{profile.title}</h2>
        <p className="profile-message">{profile.message}</p>
      </div>

      <div className="profile-description">
        <p>{profile.description}</p>
      </div>

      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <span className="stat-label">Precisión Técnica</span>
            <span className="stat-value">{technicalAccuracy.toFixed(0)}%</span>
          </div>
        </div>
        <div className="stat-card" style={{ borderColor: readiness.color }}>
          <div className="stat-icon">{readiness.icon}</div>
          <div className="stat-content">
            <span className="stat-label">Preparación</span>
            <span className="stat-value">{readiness.text}</span>
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <h3>Tu plan personalizado:</h3>
        <ul className="recommendations-list">
          {profile.recommendations.map((rec, index) => (
            <li key={index}>
              <span className="rec-icon">✓</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      <div className="start-config-preview">
        <h4>Configuración inicial:</h4>
        <div className="config-badges">
          <span className="config-badge">
            📝 {profile.startConfig.questionCount} preguntas
          </span>
          <span className="config-badge">
            🎯 Nivel {profile.startConfig.difficulty}
          </span>
          <span className="config-badge">
            📚 Modo {profile.startConfig.mode === 'study' ? 'Estudio' : profile.startConfig.mode === 'exam' ? 'Examen' : 'Práctica'}
          </span>
        </div>
      </div>

      <button 
        className="btn-primary btn-large btn-glow"
        onClick={handleStartQuiz}
        style={{ background: profile.gradient }}
      >
        ¡Comenzar Quiz!
        <span className="btn-arrow">→</span>
      </button>

      <p className="note-text">
        Puedes cambiar la configuración más adelante en la pantalla principal
      </p>
    </div>
  );
};

export default ProfileSummary;
