import React, { useState, useContext } from 'react';
import { GameStateContext } from '../../contexts/GameStateContext';
import './HelpButton.css';

/**
 * HelpButton - Botón flotante para solicitar ayudas
 * Basado en FASE_5 sistema de ayudas
 */
const HelpButton = ({ 
  missionId,
  onHelpRequested,
  position = 'bottom-right',
  compact = false
}) => {
  const gameState = useContext(GameStateContext);
  const { helpStock = 3, helpCooldown = 0, requestHelp } = gameState || {};
  const [showMenu, setShowMenu] = useState(false);
  const [showCooldownToast, setShowCooldownToast] = useState(false);

  const helpTypes = [
    {
      id: 'pista',
      label: 'Pista',
      icon: '💡',
      description: 'Una pequeña pista orientativa',
      cost: 0,
      cooldown: 5 * 60 * 1000 // 5 min
    },
    {
      id: 'guia',
      label: 'Guía',
      icon: '📖',
      description: 'Guía paso a paso',
      cost: 5,
      cooldown: 5 * 60 * 1000
    },
    {
      id: 'resolucion',
      label: 'Resolución',
      icon: '🎯',
      description: 'Resolución completa',
      cost: 15,
      cooldown: 5 * 60 * 1000
    }
  ];

  const handleHelpClick = async (helpType) => {
    if (!requestHelp) {
      console.warn('requestHelp no está disponible');
      return;
    }

    const helpTypeData = helpTypes.find(h => h.id === helpType);
    const success = await requestHelp(helpType, helpTypeData?.cost || 0);
    
    if (success?.success) {
      setShowMenu(false);
      if (onHelpRequested) {
        onHelpRequested(helpType);
      }
    } else {
      // Mostrar toast de error
      setShowCooldownToast(true);
      setTimeout(() => setShowCooldownToast(false), 3000);
    }
  };

  const getCooldownRemaining = (helpType) => {
    // Simplificado: sin cooldowns por ahora
    return null;
  };

  const isHelpAvailable = (helpType) => {
    // Simplificado: siempre disponible si hay stock
    return helpStock > 0;
  };

  return (
    <>
      <div className={`help-button-container help-button--${position}`}>
        <button
          className={`help-button ${showMenu ? 'help-button--active' : ''}`}
          onClick={() => setShowMenu(!showMenu)}
          title="Solicitar ayuda"
        >
          <span className="help-button-icon">🆘</span>
          {!compact && <span className="help-button-text">Ayuda</span>}
          {helpStock > 0 && (
            <span className="help-button-badge">{helpStock}</span>
          )}
        </button>

        {showMenu && (
          <div className="help-menu">
            <div className="help-menu-header">
              <h4>Ayudas Disponibles</h4>
              <p className="help-stock-info">Stock: {helpStock} ayudas</p>
            </div>

            <div className="help-menu-items">
              {helpTypes.map((help) => {
                const cooldown = getCooldownRemaining(help.id);
                const available = isHelpAvailable(help.id);
                const canAfford = help.cost === 0 || helpStock >= help.cost;

                return (
                  <button
                    key={help.id}
                    className={`help-menu-item ${!available || !canAfford ? 'help-menu-item--disabled' : ''}`}
                    onClick={() => available && canAfford && handleHelpClick(help.id)}
                    disabled={!available || !canAfford}
                  >
                    <div className="help-menu-item-header">
                      <span className="help-menu-item-icon">{help.icon}</span>
                      <span className="help-menu-item-label">{help.label}</span>
                      {help.cost > 0 && (
                        <span className="help-menu-item-cost">-{help.cost}</span>
                      )}
                    </div>
                    <p className="help-menu-item-description">{help.description}</p>
                    {cooldown && (
                      <span className="help-menu-item-cooldown">
                        ⏱ Disponible en {cooldown}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="help-menu-footer">
              <small>Cooldown: 5 minutos por ayuda</small>
            </div>
          </div>
        )}
      </div>

      {/* Cooldown toast */}
      {showCooldownToast && (
        <div className="help-cooldown-toast">
          <span>⏱</span>
          <p>No se pudo solicitar la ayuda. Verifica tu stock disponible.</p>
        </div>
      )}
    </>
  );
};

export default HelpButton;
