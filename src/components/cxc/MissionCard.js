import React from 'react';
import './MissionCard.css';

/**
 * Estados posibles de misión
 */
const MISSION_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
};

/**
 * Componente MissionCard
 * Tarjeta de misión con estado y progreso
 */
const MissionCard = ({
  mission,
  status = MISSION_STATUS.LOCKED,
  score,
  grade,
  duration,
  onClick,
  disabled = false
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case MISSION_STATUS.COMPLETED:
        return '✓';
      case MISSION_STATUS.IN_PROGRESS:
        return '▶';
      case MISSION_STATUS.AVAILABLE:
        return '○';
      case MISSION_STATUS.LOCKED:
      default:
        return '🔒';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case MISSION_STATUS.COMPLETED:
        return 'Completada';
      case MISSION_STATUS.IN_PROGRESS:
        return 'En progreso';
      case MISSION_STATUS.AVAILABLE:
        return 'Disponible';
      case MISSION_STATUS.LOCKED:
      default:
        return 'Bloqueada';
    }
  };

  const isClickable = !disabled && (status === MISSION_STATUS.AVAILABLE || status === MISSION_STATUS.IN_PROGRESS);
  const normalizedScore = Number.isFinite(Number(score)) ? Math.max(0, Math.round(Number(score))) : null;
  const resolvedGrade = grade || (normalizedScore !== null && normalizedScore >= 90 ? 'Platino' : 'Bronce');
  const primaryLabel = status === MISSION_STATUS.IN_PROGRESS ? 'Continuar' : 'Iniciar';

  return (
    <div
      className={`mission-card ${status} ${isClickable ? 'clickable' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={isClickable ? onClick : undefined}
    >
      <div className="mission-card-header">
        <div className="mission-icon">{mission.icon || '📋'}</div>
        <div className="mission-info">
          <h3 className="mission-title">{mission.title}</h3>
          <p className="mission-subtitle">{mission.subtitle}</p>
        </div>
        <div className={`mission-status-badge ${status}`}>
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-label">{getStatusLabel()}</span>
        </div>
      </div>

      <div className="mission-card-body">
        <p className="mission-description">{mission.description}</p>

        <div className="mission-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span className="meta-text">{duration || mission.duration || '~60'} min</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">🎯</span>
            <span className="meta-text">{mission.objectives?.length || 2} objetivos</span>
          </div>
          {mission.dataset && (
            <div className="meta-item">
              <span className="meta-icon">📊</span>
              <span className="meta-text">{mission.dataset}</span>
            </div>
          )}
        </div>

        {status === MISSION_STATUS.COMPLETED && normalizedScore !== null && (
          <div className="mission-results">
            <div className="result-score">
              <span className="result-label">Puntuación</span>
              <span className="result-value">{normalizedScore}</span>
            </div>
            <div className="result-grade">
              <span className={`grade-badge ${resolvedGrade}`}>{resolvedGrade}</span>
            </div>
          </div>
        )}

        {status === MISSION_STATUS.LOCKED && mission.prerequisite && (
          <div className="prerequisite-message">
            Completa <span>“{mission.prerequisite}”</span> primero
          </div>
        )}
      </div>

      <div className="mission-card-footer">
        {isClickable && (
          <button type="button" className="mission-action-button primary">
            {primaryLabel} <span aria-hidden="true">→</span>
          </button>
        )}
        {status === MISSION_STATUS.COMPLETED && (
          <button type="button" className="mission-action-button secondary" onClick={onClick}>
            Revisar <span aria-hidden="true">↻</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MissionCard;
export { MISSION_STATUS };
