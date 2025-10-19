import React, { useContext, useMemo } from 'react';
import { CxCProgressContext } from '../contexts/CxCProgressContext';
import { useQuizStats } from '../hooks/useQuizStats';
import BadgeDisplay from '../components/cxc/BadgeDisplay';
import ProgressRing from '../components/cxc/ProgressRing';
import { MISSIONS } from '../data/cxc/missions';
import { RANKS } from '../services/scoringService';
import '../styles/CxCProfileScreen.css';

/**
 * CxCProfileScreen - Dashboard de perfil y estadísticas
 * Basado en FASE_6 sistema de perfil avanzado
 */
const CxCProfileScreen = ({ onNavigate }) => {
  const navigate = React.useMemo(() => onNavigate || (() => {}), [onNavigate]);
  const { progress } = useContext(CxCProgressContext);
  
  // ✅ Usar hook personalizado para estadísticas de quizzes sin duplicación
  const quizStats = useQuizStats();

  // Calcular estadísticas globales
  const stats = useMemo(() => {
    const totalMissions = Object.keys(MISSIONS).length;
    const completed = progress.completedMissions?.length || 0;
    const percentage = (completed / totalMissions) * 100;

    // Promedio de puntuación
    const scores = Object.values(progress.missionProgress || {})
      .filter(m => m.score !== undefined)
      .map(m => m.score);
    const avgScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 0;

    // Determinar rango actual
    const currentRank = RANKS.find(r => avgScore >= r.min && avgScore <= r.max) || RANKS[0];

    // Ayudas usadas
    const helpsUsed = progress.helpHistory?.length || 0;

    // Tiempo total estimado
    const timeSpent = Object.values(progress.missionProgress || {})
      .reduce((total, m) => total + (m.timeSpent || 0), 0);

    return {
      totalMissions,
      completed,
      percentage: Math.round(percentage),
      avgScore: Math.round(avgScore),
      currentRank,
      helpsUsed,
      timeSpent: Math.round(timeSpent / 60), // en minutos
      totalPoints: progress.totalPoints || 0
    };
  }, [progress]);

  // Desglose por acto
  const actBreakdown = useMemo(() => {
    const breakdown = [0, 1, 2, 3, 4].map(actNumber => {
      const actMissions = Object.values(MISSIONS).filter(m => m.acto === actNumber);
      const completedInAct = actMissions.filter(m =>
        progress.completedMissions?.includes(m.id)
      ).length;

      const scores = actMissions
        .map(m => progress.missionProgress?.[m.id]?.score)
        .filter(s => s !== undefined);
      
      const avgScore = scores.length > 0
        ? scores.reduce((a, b) => a + b, 0) / scores.length
        : 0;

      return {
        actNumber,
        name: actNumber === 0 ? 'Tutorial' : actNumber === 4 ? 'Epílogo' : `Acto ${actNumber}`,
        total: actMissions.length,
        completed: completedInAct,
        percentage: actMissions.length > 0 ? (completedInAct / actMissions.length) * 100 : 0,
        avgScore: Math.round(avgScore)
      };
    });

    return breakdown;
  }, [progress]);

  const handleBackClick = () => {
    navigate('/cxc/menu');
  };

  return (
    <div className="cxc-profile-screen">
      {/* Header */}
      <header className="profile-header">
        <div className="container">
          <button className="back-button" onClick={handleBackClick}>
            <span>←</span> Volver al Menú
          </button>
          <h1>Mi Perfil</h1>
          <p className="profile-subtitle">
            {progress.playerName || 'Estudiante'} • {stats.currentRank.name}
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="profile-main">
        <div className="container">
          {/* Stats overview */}
          <section className="stats-overview">
            <div className="stat-card stat-card--primary">
              <div className="stat-card-icon">🎯</div>
              <div className="stat-card-content">
                <h3 className="stat-card-value">{stats.completed}/{stats.totalMissions}</h3>
                <p className="stat-card-label">Misiones Completadas</p>
              </div>
              <ProgressRing
                percentage={stats.percentage}
                size={80}
                strokeWidth={6}
              />
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">⭐</div>
              <div className="stat-card-content">
                <h3 className="stat-card-value">{stats.totalPoints}</h3>
                <p className="stat-card-label">Puntos Totales</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">📊</div>
              <div className="stat-card-content">
                <h3 className="stat-card-value">{stats.avgScore}</h3>
                <p className="stat-card-label">Promedio de Puntuación</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">⏱️</div>
              <div className="stat-card-content">
                <h3 className="stat-card-value">{stats.timeSpent} min</h3>
                <p className="stat-card-label">Tiempo Invertido</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon">🆘</div>
              <div className="stat-card-content">
                <h3 className="stat-card-value">{stats.helpsUsed}</h3>
                <p className="stat-card-label">Ayudas Utilizadas</p>
              </div>
            </div>
          </section>

          {/* Rank card */}
          <section className="rank-section">
            <div className="rank-card" style={{ borderColor: stats.currentRank.color }}>
              <div className="rank-header">
                <span className="rank-icon">{stats.currentRank.icon}</span>
                <div>
                  <h3 className="rank-title">Rango Actual: {stats.currentRank.name}</h3>
                  <p className="rank-description">{stats.currentRank.description}</p>
                </div>
              </div>
              <div className="rank-progress">
                <div className="rank-bar">
                  <div
                    className="rank-bar-fill"
                    style={{
                      width: `${stats.avgScore}%`,
                      background: stats.currentRank.color
                    }}
                  />
                </div>
                <div className="rank-labels">
                  {RANKS.map(rank => (
                    <div
                      key={rank.name}
                      className={`rank-marker ${stats.currentRank.name === rank.name ? 'rank-marker--active' : ''}`}
                      style={{ left: `${rank.min}%` }}
                    >
                      <span className="rank-marker-icon">{rank.icon}</span>
                      <span className="rank-marker-label">{rank.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Act breakdown */}
          <section className="acts-section">
            <h2 className="section-title">Progreso por Acto</h2>
            <div className="acts-grid">
              {actBreakdown.map(act => (
                <div key={act.actNumber} className="act-card">
                  <div className="act-card-header">
                    <h4>{act.name}</h4>
                    <span className="act-card-badge">{act.completed}/{act.total}</span>
                  </div>
                  <ProgressRing
                    percentage={act.percentage}
                    size={100}
                    label={`${Math.round(act.percentage)}%`}
                  />
                  {act.avgScore > 0 && (
                    <div className="act-card-score">
                      <span className="act-score-label">Promedio:</span>
                      <span className="act-score-value">{act.avgScore} pts</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Badges */}
          <section className="badges-section">
            <h2 className="section-title">Mis Insignias</h2>
            <BadgeDisplay
              badges={progress.badges || []}
              layout="grid"
            />
          </section>

          {/* Recent activity */}
          {progress.helpHistory && progress.helpHistory.length > 0 && (
            <section className="activity-section">
              <h2 className="section-title">Actividad Reciente</h2>
              <div className="activity-list">
                {progress.helpHistory.slice(-5).reverse().map((help, index) => (
                  <div key={index} className="activity-item">
                    <span className="activity-icon">
                      {help.type === 'pista' ? '💡' : help.type === 'guia' ? '📖' : '🎯'}
                    </span>
                    <div className="activity-content">
                      <p className="activity-text">
                        Usaste <strong>{help.type}</strong> en {MISSIONS[help.missionId]?.title}
                      </p>
                      <span className="activity-time">
                        {new Date(help.timestamp).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default CxCProfileScreen;
