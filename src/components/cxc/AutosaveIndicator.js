import React, { useState, useEffect } from 'react';
import './AutosaveIndicator.css';

/**
 * AutosaveIndicator - Indicador de guardado automático
 * Basado en FASE_6 sistema de persistencia
 */
const AutosaveIndicator = ({ 
  status = 'idle', // 'idle' | 'saving' | 'saved' | 'error'
  lastSaved = null,
  position = 'top-right',
  compact = false
}) => {
  const [show, setShow] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // Mostrar cuando hay actividad
    if (status !== 'idle') {
      setShow(true);
    }

    // Auto-ocultar después de guardado exitoso
    if (status === 'saved') {
      const timer = setTimeout(() => {
        setShow(false);
      }, 3000);
      return () => clearTimeout(timer);
    }

    // Mantener visible si hay error
    if (status === 'error') {
      setShow(true);
    }
  }, [status]);

  useEffect(() => {
    // Actualizar "hace X minutos"
    if (!lastSaved) return;

    const updateTimeAgo = () => {
      const now = Date.now();
      const diff = now - lastSaved;
      const seconds = Math.floor(diff / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (seconds < 60) {
        setTimeAgo('ahora mismo');
      } else if (minutes < 60) {
        setTimeAgo(`hace ${minutes} min`);
      } else {
        setTimeAgo(`hace ${hours} h`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 30000); // Cada 30s
    return () => clearInterval(interval);
  }, [lastSaved]);

  if (!show && status === 'idle') return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: '⏳',
          text: 'Guardando...',
          className: 'autosave--saving',
          showSpinner: true
        };
      case 'saved':
        return {
          icon: '✓',
          text: compact ? 'Guardado' : `Guardado ${timeAgo}`,
          className: 'autosave--saved',
          showSpinner: false
        };
      case 'error':
        return {
          icon: '⚠',
          text: 'Error al guardar',
          className: 'autosave--error',
          showSpinner: false
        };
      default:
        return {
          icon: '',
          text: '',
          className: '',
          showSpinner: false
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`autosave-indicator autosave--${position} ${config.className}`}>
      <div className="autosave-content">
        {config.showSpinner ? (
          <span className="autosave-spinner"></span>
        ) : (
          <span className="autosave-icon">{config.icon}</span>
        )}
        {!compact && <span className="autosave-text">{config.text}</span>}
      </div>
    </div>
  );
};

export default AutosaveIndicator;
