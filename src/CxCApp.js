import React from 'react';
import { CxCProgressProvider } from './contexts/CxCProgressContext';
import { GameStateProvider } from './contexts/GameStateContext';
import CxCMenuScreen from './screens/CxCMenuScreen';
import MissionScreen from './screens/MissionScreen';
import CxCProfileScreen from './screens/CxCProfileScreen';
import AutosaveIndicator from './components/cxc/AutosaveIndicator';
import HelpButton from './components/cxc/HelpButton';
import './styles/CxCApp.css';

/**
 * CxCApp - Aplicación principal del módulo CxC
 * Wrapper que provee todos los contextos necesarios
 * Basado en FASE_1 y FASE_2 arquitectura
 * 
 * Nota: Sin router externo, usa navegación interna por estado
 */
const CxCApp = ({ onExit }) => {
  const [autosaveStatus, setAutosaveStatus] = React.useState('idle');
  const [lastSaved, setLastSaved] = React.useState(null);
  const [currentMissionId, setCurrentMissionId] = React.useState(null);
  const [currentScreen, setCurrentScreen] = React.useState('menu'); // 'menu', 'mission', 'profile'
  const [missionId, setMissionId] = React.useState(null);

  // Función de navegación interna
  const navigate = React.useCallback((path) => {
    if (path.startsWith('/cxc/mission/')) {
      const id = path.replace('/cxc/mission/', '');
      setMissionId(id);
      setCurrentScreen('mission');
    } else if (path === '/cxc/profile') {
      setCurrentScreen('profile');
    } else if (path === '/cxc/menu') {
      setCurrentScreen('menu');
      setMissionId(null);
    }
  }, []);

  // Listener para eventos de guardado
  React.useEffect(() => {
    const handleSaveStart = () => setAutosaveStatus('saving');
    const handleSaveSuccess = () => {
      setAutosaveStatus('saved');
      setLastSaved(Date.now());
    };
    const handleSaveError = () => setAutosaveStatus('error');

    window.addEventListener('cxc:save:start', handleSaveStart);
    window.addEventListener('cxc:save:success', handleSaveSuccess);
    window.addEventListener('cxc:save:error', handleSaveError);

    return () => {
      window.removeEventListener('cxc:save:start', handleSaveStart);
      window.removeEventListener('cxc:save:success', handleSaveSuccess);
      window.removeEventListener('cxc:save:error', handleSaveError);
    };
  }, []);

  // Listener para detectar misión activa
  React.useEffect(() => {
    const handleMissionChange = (event) => {
      setCurrentMissionId(event.detail?.missionId || null);
    };

    window.addEventListener('cxc:mission:active', handleMissionChange);
    return () => {
      window.removeEventListener('cxc:mission:active', handleMissionChange);
    };
  }, []);

  // Renderizar pantalla actual
  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return <CxCMenuScreen onNavigate={navigate} />;
      case 'mission':
        return <MissionScreen missionId={missionId} onNavigate={navigate} />;
      case 'profile':
        return <CxCProfileScreen onNavigate={navigate} />;
      default:
        return <CxCMenuScreen onNavigate={navigate} />;
    }
  };

  return (
    <CxCProgressProvider>
      <GameStateProvider>
        <div className="cxc-app">
          {onExit && (
            <button
              type="button"
              className="cxc-exit-button"
              onClick={onExit}
            >
              Regresar al home
            </button>
          )}

          {/* Renderizar pantalla actual */}
          {renderScreen()}

          {/* UI global: Autosave indicator */}
          <AutosaveIndicator
            status={autosaveStatus}
            lastSaved={lastSaved}
            position="top-right"
          />

          {/* UI global: Help button (solo si hay misión activa) */}
          {currentMissionId && (
            <HelpButton
              missionId={currentMissionId}
              position="bottom-right"
              onHelpRequested={(helpType) => {
                // Emitir evento para que la misión lo maneje
                window.dispatchEvent(
                  new CustomEvent('cxc:help:requested', {
                    detail: { missionId: currentMissionId, helpType }
                  })
                );
              }}
            />
          )}
        </div>
      </GameStateProvider>
    </CxCProgressProvider>
  );
};

export default CxCApp;
