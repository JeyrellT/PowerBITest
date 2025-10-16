/**
 * 📊 DASHBOARD DE PERFIL AVANZADO
 * Visualización completa de métricas, progreso y recomendaciones
 */

import React, { useMemo } from 'react';
import { 
  useUserProfile 
} from '../contexts/UserProfileContext';
import { useProgressAnalysis, useExamReadiness } from '../hooks/useProfileHooks';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import '../styles/ProfileDashboard.css';

const ProfileDashboard = ({ onNavigate }) => {
  const profile = useUserProfile();
  const analysis = useProgressAnalysis(profile);
  const readiness = useExamReadiness(profile);

  // Calcular nivel actual
  const currentLevelInfo = useMemo(() => {
    const levels = [
      { level: 1, name: 'Novato', xp: 0, icon: '🌱', color: '#95a5a6' },
      { level: 2, name: 'Aprendiz', xp: 500, icon: '📚', color: '#3498db' },
      { level: 3, name: 'Estudiante', xp: 1200, icon: '🎓', color: '#9b59b6' },
      { level: 4, name: 'Competente', xp: 2500, icon: '💼', color: '#16a085' },
      { level: 5, name: 'Profesional', xp: 4500, icon: '⭐', color: '#27ae60' },
      { level: 6, name: 'Experto', xp: 7000, icon: '🏆', color: '#f39c12' },
      { level: 7, name: 'Maestro', xp: 10500, icon: '👑', color: '#e67e22' },
      { level: 8, name: 'Gran Maestro', xp: 12000, icon: '💎', color: '#e74c3c' },
      { level: 9, name: 'Leyenda', xp: 18000, icon: '🌟', color: '#c0392b' },
      { level: 10, name: 'Divinidad', xp: 25000, icon: '✨', color: '#8e44ad' }
    ];
    
    const currentLevel = profile.progress.currentLevel;
    return levels.find(l => l.level === currentLevel) || levels[0];
  }, [profile.progress.currentLevel]);

  const handleRecommendationAction = (action) => {
    if (action.type === 'start-quiz') {
      onNavigate('instructions', { config: action.config });
    } else if (action.type === 'view-guide') {
      onNavigate('exam-guide');
    } else if (action.type === 'review-mode') {
      // Implementar modo de revisión
      onNavigate('quiz', { config: { ...action.config, mode: 'review' } });
    } else if (action.type === 'diagnostic-quiz') {
      onNavigate('instructions', { config: { numberOfQuestions: 20, level: 'all', domain: 'all' } });
    }
  };

  if (!analysis || !readiness) {
    return <div className="loading">Cargando análisis...</div>;
  }

  return (
    <div className="profile-dashboard">
      {/* Header con información general */}
      <div className="dashboard-header">
        <div className="profile-summary">
          <div className="level-badge" style={{ background: currentLevelInfo.color }}>
            <span className="level-icon">{currentLevelInfo.icon}</span>
            <div className="level-info">
              <span className="level-number">Nivel {currentLevelInfo.level}</span>
              <span className="level-name">{currentLevelInfo.name}</span>
            </div>
          </div>
          
          <div className="xp-progress">
            <div className="xp-bar-container">
              <div 
                className="xp-bar-fill"
                style={{ width: `${profile.progress.levelProgress}%` }}
              />
            </div>
            <span className="xp-text">
              {profile.progress.totalXP} XP ({profile.progress.levelProgress.toFixed(0)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">📝</div>
          <div className="metric-content">
            <h3>{analysis.basic.totalQuestions}</h3>
            <p>Preguntas Respondidas</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <h3>{analysis.basic.accuracy.toFixed(1)}%</h3>
            <p>Precisión General</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🔥</div>
          <div className="metric-content">
            <h3>{analysis.streak.current} días</h3>
            <p>Racha Actual</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">{readiness.icon}</div>
          <div className="metric-content">
            <h3>{readiness.overall}%</h3>
            <p>{readiness.level}</p>
          </div>
        </div>
      </div>

      {/* Score de preparación */}
      <div className="readiness-section">
        <h2>📊 Preparación para el Examen</h2>
        <div className="readiness-breakdown">
          <div className="readiness-item">
            <div className="readiness-label">
              <span>Cobertura del Temario</span>
              <strong>{readiness.coverage}%</strong>
            </div>
            <div className="readiness-bar">
              <div 
                className="readiness-bar-fill coverage"
                style={{ width: `${readiness.coverage}%` }}
              />
            </div>
          </div>

          <div className="readiness-item">
            <div className="readiness-label">
              <span>Dominio de Habilidades</span>
              <strong>{readiness.mastery}%</strong>
            </div>
            <div className="readiness-bar">
              <div 
                className="readiness-bar-fill mastery"
                style={{ width: `${readiness.mastery}%` }}
              />
            </div>
          </div>

          <div className="readiness-item">
            <div className="readiness-label">
              <span>Consistencia</span>
              <strong>{readiness.consistency}%</strong>
            </div>
            <div className="readiness-bar">
              <div 
                className="readiness-bar-fill consistency"
                style={{ width: `${readiness.consistency}%` }}
              />
            </div>
          </div>
        </div>

        {readiness.estimatedDaysToReady && (
          <div className="readiness-estimate">
            <p>
              ⏱️ Estimado: <strong>{readiness.estimatedDaysToReady} días</strong> hasta estar completamente preparado
            </p>
          </div>
        )}
      </div>

      {/* Fortalezas y debilidades */}
      <div className="strengths-weaknesses">
        <div className="strength-section">
          <h3>💪 Fortalezas</h3>
          {analysis.domains.strengths.length > 0 ? (
            <ul className="domain-list">
              {analysis.domains.strengths.map((domain, index) => (
                <li key={index} className="domain-item strength">
                  <span className="domain-name">{domain.domain}</span>
                  <span className="domain-accuracy">{domain.accuracy.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">Continúa practicando para identificar tus fortalezas</p>
          )}
        </div>

        <div className="weakness-section">
          <h3>📈 Áreas de Mejora</h3>
          {analysis.domains.weaknesses.length > 0 ? (
            <ul className="domain-list">
              {analysis.domains.weaknesses.map((domain, index) => (
                <li key={index} className="domain-item weakness">
                  <span className="domain-name">{domain.domain}</span>
                  <span className="domain-accuracy">{domain.accuracy.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">¡Excelente! No hay áreas críticas por mejorar</p>
          )}
        </div>
      </div>

      {/* Dominio de habilidades */}
      <div className="skills-section">
        <h2>🎯 Dominio de Habilidades</h2>
        <div className="skills-summary">
          <div className="skills-stat">
            <span className="skills-number">{analysis.skills.masteredCount}</span>
            <span className="skills-label">Dominadas</span>
          </div>
          <div className="skills-stat">
            <span className="skills-number">{analysis.skills.totalCount}</span>
            <span className="skills-label">Total</span>
          </div>
          <div className="skills-stat">
            <span className="skills-number">{analysis.skills.masteryPercentage.toFixed(0)}%</span>
            <span className="skills-label">Progreso</span>
          </div>
        </div>
        
        {analysis.review.count > 0 && (
          <div className="review-alert">
            <span className="review-icon">🔄</span>
            <p>
              Tienes <strong>{analysis.review.count} preguntas</strong> listas para revisión espaciada
            </p>
            <button 
              className="review-btn"
              onClick={() => handleRecommendationAction({ 
                type: 'review-mode', 
                config: { questionIds: analysis.review.questionsReady } 
              })}
            >
              Revisar ahora
            </button>
          </div>
        )}
      </div>

      {/* Recomendaciones personalizadas */}
      <PersonalizedRecommendations onActionClick={handleRecommendationAction} />

      {/* Estadísticas de rendimiento */}
      <div className="performance-stats">
        <h2>⚡ Estadísticas de Rendimiento</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Tiempo promedio por pregunta</span>
            <span className="stat-value">
              {analysis.performance.avgTimePerQuestion.toFixed(0)}s
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Preguntas por día</span>
            <span className="stat-value">
              {analysis.performance.questionsPerDay.toFixed(1)}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Racha más larga</span>
            <span className="stat-value">
              {analysis.streak.longest} días
            </span>
          </div>
          {analysis.performance.improvementRate !== null && (
            <div className="stat-item">
              <span className="stat-label">Tasa de mejora</span>
              <span className="stat-value">
                {analysis.performance.improvementRate > 0 ? '+' : ''}
                {analysis.performance.improvementRate.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
