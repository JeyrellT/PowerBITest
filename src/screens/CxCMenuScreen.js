import React, { useContext, useState, useMemo } from 'react';
import { CxCProgressContext } from '../contexts/CxCProgressContext';
import MissionCard from '../components/cxc/MissionCard';
import ProgressRing from '../components/cxc/ProgressRing';
import { MISSIONS, getMissionsByAct, isMissionUnlocked } from '../data/cxc/missions';
import '../styles/CxCMenuScreen.css';

/**
 * CxCMenuScreen - Menú principal con grid de misiones
 * Basado en FASE_2 wireframes - Pantalla hub central
 * Versión simplificada sin navegación de rutas
 */
const CxCMenuScreen = ({ onNavigate }) => {
  const { progress } = useContext(CxCProgressContext);
  const [selectedAct, setSelectedAct] = useState('all');

  // Calcular progreso global
  const globalProgress = useMemo(() => {
    if (!progress) return { completed: 0, total: 0, percentage: 0 };
    
    const totalMissions = Object.keys(MISSIONS).length;
    const completedMissions = progress.completedMissions?.length || 0;
    const percentage = (completedMissions / totalMissions) * 100;
    
    return {
      completed: completedMissions,
      total: totalMissions,
      percentage: Math.round(percentage)
    };
  }, [progress]);

  // Obtener misiones filtradas
  const filteredMissions = useMemo(() => {
    let missions = Object.values(MISSIONS);
    
    if (selectedAct !== 'all') {
      const actNumber = parseInt(selectedAct);
      missions = getMissionsByAct(actNumber);
    }
    
    return missions.sort((a, b) => {
      if (a.acto !== b.acto) return a.acto - b.acto;
      return a.orden - b.orden;
    });
  }, [selectedAct]);

  // Determinar estado de cada misión
  const getMissionStatus = (missionId) => {
    if (!progress) return 'locked';
    
    if (progress.completedMissions?.includes(missionId)) {
      return 'completed';
    }
    if (progress.currentMission === missionId) {
      return 'in_progress';
    }
    if (isMissionUnlocked(missionId, progress.completedMissions || [])) {
      return 'available';
    }
    return 'locked';
  };

  // Mostrar loading si progress aún no está disponible
  if (!progress) {
    return (
      <div className="cxc-menu-screen">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando progreso...</p>
        </div>
      </div>
    );
  }

  const handleMissionClick = (mission) => {
    const status = getMissionStatus(mission.id);
    
    if (status === 'locked') {
      return; // No hacer nada si está bloqueada
    }
    
    // Emitir evento de misión activa
    window.dispatchEvent(
      new CustomEvent('cxc:mission:active', {
        detail: { missionId: mission.id }
      })
    );
    
    // Navegar usando la función proporcionada
    if (onNavigate) {
      onNavigate(`/cxc/mission/${mission.id}`);
    }
  };

  const handleProfileClick = () => {
    // Navegar a perfil usando la función proporcionada
    if (onNavigate) {
      onNavigate('/cxc/profile');
    }
  };

  // Actos disponibles
  const acts = [
    { id: 'all', label: 'Todas', icon: '🎯' },
    { id: '0', label: 'Tutorial', icon: '🎓' },
    { id: '1', label: 'Acto 1', icon: '📊' },
    { id: '2', label: 'Acto 2', icon: '🚀' },
    { id: '3', label: 'Acto 3', icon: '🌍' },
    { id: '4', label: 'Epílogo', icon: '🎯' }
  ];

  return (
    <div className="cxc-menu-screen">
      {/* Header con progreso global */}
      <header className="cxc-menu-header">
        <div className="container">
          <div className="header-content">
            <div className="header-title">
              <h1>SuperMercado Global</h1>
              <p className="subtitle">Academia de Cuentas por Cobrar</p>
            </div>
            
            <div className="header-stats">
              <ProgressRing
                percentage={globalProgress.percentage}
                size={100}
                label="Progreso"
                color="var(--primary-color)"
              />
              <div className="stats-details">
                <div className="stat-item">
                  <span className="stat-value">{globalProgress.completed}/{globalProgress.total}</span>
                  <span className="stat-label">Misiones</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{progress.totalPoints || 0}</span>
                  <span className="stat-label">Puntos</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{progress.badges?.filter(b => b.unlocked).length || 0}</span>
                  <span className="stat-label">Insignias</span>
                </div>
              </div>
              
              <button className="profile-button" onClick={handleProfileClick}>
                <span className="profile-icon">👤</span>
                <span>Mi Perfil</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filtros por acto */}
      <div className="cxc-menu-filters">
        <div className="container">
          <div className="filter-tabs">
            {acts.map(act => (
              <button
                key={act.id}
                className={`filter-tab ${selectedAct === act.id ? 'filter-tab--active' : ''}`}
                onClick={() => setSelectedAct(act.id)}
              >
                <span className="filter-icon">{act.icon}</span>
                <span className="filter-label">{act.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de misiones */}
      <main className="cxc-menu-main">
        <div className="container">
          {filteredMissions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📭</span>
              <p>No hay misiones en esta sección</p>
            </div>
          ) : (
            <div className="missions-grid">
              {filteredMissions.map(mission => {
                const status = getMissionStatus(mission.id);
                const missionProgress = progress.missionProgress?.[mission.id];
                const score = missionProgress?.score;
                const grade = missionProgress?.grade;
                
                return (
                  <MissionCard
                    key={mission.id}
                    mission={mission}
                    status={status}
                    progress={missionProgress?.percentage || 0}
                    score={score}
                    grade={grade}
                    onClick={() => handleMissionClick(mission)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer con tips */}
      <footer className="cxc-menu-footer">
        <div className="container">
          <div className="tip-box">
            <span className="tip-icon">💡</span>
            <p className="tip-text">
              <strong>Tip:</strong> Completa las misiones en orden para desbloquear nuevos desafíos. 
              ¡Usa las ayudas sabiamente!
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CxCMenuScreen;
