import React, { useState } from 'react';

const ExperienceStep = ({ onComplete, onBack }) => {
  const [selected, setSelected] = useState(null);

  const experienceLevels = [
    {
      id: 'basico',
      title: 'Nunca he usado Power BI',
      subtitle: 'Pero tengo experiencia con Excel u otras herramientas',
      icon: '🌱',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      characteristics: [
        'Conozco tablas dinámicas de Excel',
        'Entiendo conceptos de visualización de datos',
        'Quiero aprender Power BI desde cero',
        'Busco transicionar de Excel a Power BI'
      ],
      estimatedTime: '20-30 minutos',
      recommendedQuestions: 15
    },
    {
      id: 'intermedio',
      title: 'He usado Power BI',
      subtitle: 'Pero no diariamente',
      icon: '📚',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      characteristics: [
        'He creado reportes básicos en Power BI',
        'Conozco DAX elemental (SUM, COUNT, AVERAGE)',
        'He publicado en el servicio de Power BI',
        'Quiero mejorar mis habilidades'
      ],
      estimatedTime: '30-40 minutos',
      recommendedQuestions: 25
    },
    {
      id: 'avanzado',
      title: 'Uso Power BI diariamente',
      subtitle: 'En mi trabajo profesional',
      icon: '⭐',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
      characteristics: [
        'Creo modelos de datos complejos regularmente',
        'Domino DAX avanzado y optimización',
        'Gestiono workspaces y administro seguridad',
        'Me preparo para la certificación PL-300'
      ],
      estimatedTime: '45-60 minutos',
      recommendedQuestions: 40
    }
  ];

  const handleSelect = (level) => {
    setSelected(level);
  };

  const handleContinue = () => {
    if (selected) {
      onComplete({
        experienceLevel: selected.id,
        estimatedTime: selected.estimatedTime,
        recommendedQuestions: selected.recommendedQuestions
      });
    }
  };

  return (
    <div className="onboarding-step experience-step">
      <div className="step-header">
        <h2>¿Cuál es tu nivel de experiencia con Power BI?</h2>
        <p className="step-description">
          Esto nos ayudará a personalizar el contenido y la dificultad de las preguntas
        </p>
      </div>

      <div className="experience-options">
        {experienceLevels.map((level) => (
          <div
            key={level.id}
            className={`experience-card ${selected?.id === level.id ? 'selected' : ''}`}
            onClick={() => handleSelect(level)}
            style={{ '--card-color': level.color, '--card-gradient': level.gradient }}
          >
            <div className="card-select-indicator">
              <div className="radio-button">
                {selected?.id === level.id && <div className="radio-dot" />}
              </div>
            </div>

            <div className="card-icon-large">{level.icon}</div>

            <div className="card-content">
              <h3 className="card-title">{level.title}</h3>
              <p className="card-subtitle">{level.subtitle}</p>

              <ul className="characteristics-list">
                {level.characteristics.map((char, i) => (
                  <li key={i}>
                    <span className="check-icon">✓</span>
                    {char}
                  </li>
                ))}
              </ul>

              <div className="card-footer">
                <div className="info-badge">
                  <span className="badge-icon">⏱️</span>
                  {level.estimatedTime}
                </div>
                <div className="info-badge">
                  <span className="badge-icon">📝</span>
                  ~{level.recommendedQuestions} preguntas
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="step-actions">
        {onBack && (
          <button className="btn-secondary" onClick={onBack}>
            ← Atrás
          </button>
        )}
        <button
          className="btn-primary btn-large"
          onClick={handleContinue}
          disabled={!selected}
        >
          Continuar
          <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default ExperienceStep;
