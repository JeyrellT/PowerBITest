import React, { useState } from 'react';
import './BadgeDisplay.css';

/**
 * BadgeDisplay - Muestra insignias desbloqueadas con animaciones
 * Basado en FASE_6 sistema de logros
 */
const BadgeDisplay = ({ badges = [], layout = 'grid', onBadgeClick }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  const handleBadgeClick = (badge) => {
    setSelectedBadge(badge);
    if (onBadgeClick) {
      onBadgeClick(badge);
    }
  };

  const closeModal = () => {
    setSelectedBadge(null);
  };

  return (
    <div className={`badge-display badge-display--${layout}`}>
      {badges.length === 0 ? (
        <div className="badge-empty-state">
          <span className="badge-empty-icon">🏆</span>
          <p className="badge-empty-text">Aún no has desbloqueado insignias</p>
          <p className="badge-empty-hint">Completa misiones para ganar logros</p>
        </div>
      ) : (
        <div className="badge-grid">
          {badges.map((badge, index) => (
            <div
              key={badge.id}
              className={`badge-item ${badge.unlocked ? 'badge-item--unlocked' : 'badge-item--locked'}`}
              onClick={() => badge.unlocked && handleBadgeClick(badge)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="badge-icon-wrapper">
                <span className="badge-icon" role="img" aria-label={badge.name}>
                  {badge.unlocked ? badge.icon : '🔒'}
                </span>
                {badge.unlocked && badge.isNew && (
                  <span className="badge-new-indicator">¡Nuevo!</span>
                )}
              </div>
              <div className="badge-info">
                <h4 className="badge-name">{badge.unlocked ? badge.name : '???'}</h4>
                <p className="badge-description">
                  {badge.unlocked ? badge.description : 'Insignia bloqueada'}
                </p>
                {badge.unlocked && badge.unlockedAt && (
                  <span className="badge-date">
                    {new Date(badge.unlockedAt).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedBadge && (
        <div className="badge-modal-overlay" onClick={closeModal}>
          <div className="badge-modal" onClick={(e) => e.stopPropagation()}>
            <button className="badge-modal-close" onClick={closeModal}>
              ✕
            </button>
            <div className="badge-modal-content">
              <span className="badge-modal-icon">{selectedBadge.icon}</span>
              <h2 className="badge-modal-title">{selectedBadge.name}</h2>
              <p className="badge-modal-description">{selectedBadge.description}</p>
              {selectedBadge.criteria && (
                <div className="badge-modal-criteria">
                  <h4>Criterios cumplidos:</h4>
                  <ul>
                    {Object.entries(selectedBadge.criteria).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {selectedBadge.unlockedAt && (
                <p className="badge-modal-date">
                  Desbloqueada el{' '}
                  {new Date(selectedBadge.unlockedAt).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeDisplay;
