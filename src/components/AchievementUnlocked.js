import React, { useEffect, useState, useCallback } from 'react';
import '../styles/AchievementUnlocked.css';

/**
 * Componente popup para mostrar logros desbloqueados
 * Incluye animaciones, confeti y auto-dismiss
 */
const AchievementUnlocked = ({ achievement, onClose, autoCloseDelay = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // Animación de entrada
    setTimeout(() => setIsVisible(true), 10);

    // Generar confeti
    const pieces = [];
    const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#ff4757'];
    for (let i = 0; i < 30; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.5
      });
    }
    setConfettiPieces(pieces);

    // Auto-close
    if (autoCloseDelay > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoCloseDelay, handleClose]);

  if (!achievement) return null;

  const getTierColor = (tier) => {
    const colors = {
      bronze: '#cd7f32',
      silver: '#c0c0c0',
      gold: '#ffd700',
      platinum: '#10b981'
    };
    return colors[tier] || '#4b5563';
  };

  const getTierGradient = (tier) => {
    const gradients = {
      bronze: 'linear-gradient(135deg, #8b4513 0%, #cd7f32 100%)',
      silver: 'linear-gradient(135deg, #808080 0%, #c0c0c0 100%)',
      gold: 'linear-gradient(135deg, #b8860b 0%, #ffd700 100%)',
      platinum: 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
    };
    return gradients[tier] || 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)';
  };

  return (
    <div className={`achievement-overlay ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}>
      {/* Confeti */}
      <div className="confetti-container">
        {confettiPieces.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: `${piece.left}%`,
              animationDelay: `${piece.delay}s`,
              backgroundColor: piece.color,
              transform: `rotate(${piece.rotation}deg) scale(${piece.scale})`
            }}
          />
        ))}
      </div>

      {/* Popup Principal */}
      <div className="achievement-popup">
        {/* Botón cerrar */}
        <button className="achievement-close" onClick={handleClose} aria-label="Cerrar">
          ✕
        </button>

        {/* Header con brillo */}
        <div className="achievement-header" style={{ background: getTierGradient(achievement.tier) }}>
          <div className="achievement-stars">✨</div>
          <h2 className="achievement-title-popup">¡Logro Desbloqueado!</h2>
          <div className="achievement-stars">✨</div>
        </div>

        {/* Contenido */}
        <div className="achievement-content-popup">
          {/* Icono grande con animación */}
          <div className="achievement-icon-mega">
            <div className="icon-pulse"></div>
            <span className="icon-emoji">{achievement.icon}</span>
          </div>

          {/* Información del logro */}
          <div className="achievement-info-popup">
            <div 
              className="achievement-tier-label" 
              style={{ background: getTierGradient(achievement.tier) }}
            >
              {achievement.tier.toUpperCase()}
            </div>
            
            <h3 className="achievement-name-popup">{achievement.name}</h3>
            <p className="achievement-description-popup">{achievement.description}</p>
            
            <div className="achievement-category-label">
              <span className="category-icon">
                {achievement.category === 'progreso' && '📈'}
                {achievement.category === 'precision' && '🎯'}
                {achievement.category === 'velocidad' && '⚡'}
                {achievement.category === 'racha' && '🔥'}
                {achievement.category === 'dominio' && '👑'}
                {achievement.category === 'especial' && '⭐'}
                {achievement.category === 'retencion' && '🧠'}
                {achievement.category === 'examen' && '🎓'}
              </span>
              <span className="category-text">{achievement.category}</span>
            </div>

            {/* Puntos ganados */}
            <div 
              className="achievement-points-popup"
              style={{ borderColor: getTierColor(achievement.tier) }}
            >
              <span className="points-label">Puntos Ganados</span>
              <span className="points-value">+{achievement.points}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="achievement-footer">
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ background: getTierGradient(achievement.tier) }}
            ></div>
          </div>
          <p className="achievement-hint">Este popup se cerrará automáticamente</p>
        </div>
      </div>
    </div>
  );
};

export default AchievementUnlocked;
