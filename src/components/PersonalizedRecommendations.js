/**
 * 📋 COMPONENTE DE RECOMENDACIONES PERSONALIZADAS
 * Muestra recomendaciones adaptativas basadas en el desempeño del usuario
 */

import React, { useEffect, useState } from 'react';
import { 
  useUserProfile
} from '../contexts/UserProfileContext';
import { 
  AdaptiveRecommendationEngine,
  RECOMMENDATION_TYPE 
} from '../utils/adaptiveRecommendations';
import '../styles/PersonalizedRecommendations.css';

const PersonalizedRecommendations = ({ onActionClick }) => {
  const profile = useUserProfile();
  const [recommendations, setRecommendations] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (profile) {
      const engine = new AdaptiveRecommendationEngine(profile);
      const generated = engine.generateRecommendations();
      
      // Limitar a las 5 más importantes
      const topRecommendations = generated.slice(0, 5);
      setRecommendations(topRecommendations);
    }
  }, [profile]);

  const handleDismiss = (recommendationId) => {
    setRecommendations(prev => prev.filter(rec => rec.id !== recommendationId));
  };

  const handleActionClick = (recommendation) => {
    if (onActionClick && recommendation.action) {
      onActionClick(recommendation.action);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTypeClass = (type) => {
    const typeMap = {
      [RECOMMENDATION_TYPE.HABIT]: 'rec-habit',
      [RECOMMENDATION_TYPE.WEAKNESS]: 'rec-weakness',
      [RECOMMENDATION_TYPE.REVIEW]: 'rec-review',
      [RECOMMENDATION_TYPE.CHALLENGE]: 'rec-challenge',
      [RECOMMENDATION_TYPE.MAINTENANCE]: 'rec-maintenance',
      [RECOMMENDATION_TYPE.DIAGNOSTIC]: 'rec-diagnostic',
      [RECOMMENDATION_TYPE.MOTIVATIONAL]: 'rec-motivational',
      [RECOMMENDATION_TYPE.STRATEGY]: 'rec-strategy'
    };
    return typeMap[type] || 'rec-default';
  };

  const getPriorityBadge = (priority) => {
    if (priority >= 5) return { text: 'Crítico', class: 'priority-critical' };
    if (priority >= 4) return { text: 'Alto', class: 'priority-high' };
    if (priority >= 3) return { text: 'Medio', class: 'priority-medium' };
    return { text: 'Bajo', class: 'priority-low' };
  };

  if (recommendations.length === 0) {
    return (
      <div className="recommendations-empty">
        <div className="empty-icon">🎯</div>
        <h3>¡Todo en orden!</h3>
        <p>Continúa con tu excelente trabajo. Nuevas recomendaciones aparecerán según tu progreso.</p>
      </div>
    );
  }

  return (
    <div className="personalized-recommendations">
      <div className="recommendations-header">
        <h2>📊 Recomendaciones Personalizadas</h2>
        <p className="recommendations-subtitle">
          Basadas en tu desempeño y patrón de aprendizaje
        </p>
      </div>

      <div className="recommendations-list">
        {recommendations.map((rec) => {
          const isExpanded = expandedId === rec.id;
          const typeClass = getTypeClass(rec.type);
          const priorityBadge = getPriorityBadge(rec.priority);

          return (
            <div 
              key={rec.id} 
              className={`recommendation-card ${typeClass} ${isExpanded ? 'expanded' : ''}`}
            >
              {/* Header */}
              <div className="rec-header" onClick={() => toggleExpand(rec.id)}>
                <div className="rec-title-section">
                  <span className="rec-icon">{rec.icon}</span>
                  <div className="rec-title-text">
                    <h3>{rec.title}</h3>
                    <span className={`priority-badge ${priorityBadge.class}`}>
                      {priorityBadge.text}
                    </span>
                  </div>
                </div>
                <button className="expand-btn">
                  {isExpanded ? '▼' : '▶'}
                </button>
              </div>

              {/* Mensaje principal */}
              <div className="rec-message">
                <p>{rec.message}</p>
              </div>

              {/* Contenido expandido */}
              {isExpanded && (
                <div className="rec-details">
                  {/* Insight */}
                  {rec.insight && (
                    <div className="rec-insight">
                      <div className="insight-icon">💡</div>
                      <p>{rec.insight}</p>
                    </div>
                  )}

                  {/* Métricas */}
                  {rec.metrics && (
                    <div className="rec-metrics">
                      {rec.metrics.current !== undefined && rec.metrics.target !== undefined && (
                        <div className="metric-bar">
                          <div className="metric-label">
                            <span>Actual: {rec.metrics.current.toFixed(1)}{rec.metrics.unit}</span>
                            <span>Objetivo: {rec.metrics.target}{rec.metrics.unit}</span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill"
                              style={{ 
                                width: `${Math.min(100, (rec.metrics.current / rec.metrics.target) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {rec.metrics.current !== undefined && !rec.metrics.target && (
                        <div className="metric-simple">
                          <strong>{rec.metrics.current}</strong> {rec.metrics.unit}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Goal */}
                  {rec.goal && (
                    <div className="rec-goal">
                      <div className="goal-progress">
                        <span>Meta: {rec.goal.target} {rec.goal.metric}</span>
                        <span>{rec.goal.current} / {rec.goal.target}</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: `${Math.min(100, (rec.goal.current / rec.goal.target) * 100)}%` 
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Acciones */}
              <div className="rec-actions">
                {rec.action && (
                  <button 
                    className="action-btn primary"
                    onClick={() => handleActionClick(rec)}
                  >
                    {rec.action.label}
                  </button>
                )}
                <button 
                  className="action-btn secondary"
                  onClick={() => handleDismiss(rec.id)}
                >
                  Descartar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resumen de recomendaciones */}
      <div className="recommendations-summary">
        <div className="summary-item">
          <span className="summary-icon">🎯</span>
          <div>
            <strong>{recommendations.filter(r => r.priority >= 4).length}</strong>
            <span>Prioritarias</span>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">📈</span>
          <div>
            <strong>{recommendations.filter(r => r.type === RECOMMENDATION_TYPE.WEAKNESS).length}</strong>
            <span>Áreas de mejora</span>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">🔄</span>
          <div>
            <strong>{recommendations.filter(r => r.type === RECOMMENDATION_TYPE.REVIEW).length}</strong>
            <span>Para revisar</span>
          </div>
        </div>
        <div className="summary-item">
          <span className="summary-icon">⭐</span>
          <div>
            <strong>{recommendations.filter(r => r.type === RECOMMENDATION_TYPE.MOTIVATIONAL).length}</strong>
            <span>Logros</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
