import React from 'react';
import '../styles/DiagnosticResults.css';

const DiagnosticResults = ({ diagnosticData }) => {
  const {
    puntuacionGlobal,
    analisisPorCategorias,
    rutasDeEstudio,
    badges
  } = diagnosticData;

  const getNivelColor = (nivel) => {
    const colores = {
      'Excelente': '#10b981',
      'Sobresaliente': '#3b82f6',
      'Bueno': '#8b5cf6',
      'Regular': '#f59e0b',
      'Insuficiente': '#ef4444'
    };
    return colores[nivel] || '#6b7280';
  };

  const getBadgeIcon = (tipo) => {
    const iconos = {
      'Maestro PL-300': '🏆',
      'Experto en Análisis': '📊',
      'Especialista en Visualización': '📈',
      'Gurú de DAX': '🧮',
      'Arquitecto de Datos': '🏗️',
      'Perfeccionista': '⭐',
      'Estudiante Dedicado': '📚',
      'Aprendiz Comprometido': '🌱'
    };
    return iconos[tipo] || '🎯';
  };

  return (
    <div className="diagnostic-results">
      {/* Puntuación Global */}
      <div className="global-score-card">
        <div className="score-header">
          <h2>📊 Evaluación Diagnóstica</h2>
          <div 
            className="score-circle"
            style={{ 
              background: `conic-gradient(${getNivelColor(puntuacionGlobal.nivelGeneral)} ${puntuacionGlobal.porcentajeTotal * 3.6}deg, #e5e7eb 0deg)`
            }}
          >
            <div className="score-inner">
              <span className="score-value">{puntuacionGlobal.porcentajeTotal}%</span>
              <span className="score-label">{puntuacionGlobal.nivelGeneral}</span>
            </div>
          </div>
        </div>
        
        <div className="score-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Puntuación Global</span>
            <span className="breakdown-value">{puntuacionGlobal.puntuacionTotal.toFixed(1)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Promedio Ponderado</span>
            <span className="breakdown-value">{puntuacionGlobal.promedioPonderado.toFixed(1)}%</span>
          </div>
        </div>

        {puntuacionGlobal.recomendaciones && (
          <div className="recommendations">
            <h4>💡 Recomendaciones</h4>
            <ul>
              {puntuacionGlobal.recomendaciones.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Análisis por Categorías */}
      <div className="categories-analysis">
        <h3>📚 Análisis por Dominios</h3>
        <div className="categories-grid">
          {Object.entries(analisisPorCategorias).map(([categoria, datos]) => (
            <div key={categoria} className="category-card">
              <div className="category-header">
                <h4>{categoria}</h4>
                <span 
                  className="category-badge"
                  style={{ background: getNivelColor(datos.nivel) }}
                >
                  {datos.nivel}
                </span>
              </div>
              
              <div className="category-stats">
                <div className="stat-row">
                  <span>Precisión</span>
                  <strong>{datos.porcentajeAciertos}%</strong>
                </div>
                <div className="stat-row">
                  <span>Puntuación</span>
                  <strong>{datos.puntuacion.toFixed(1)}</strong>
                </div>
              </div>

              {/* Nivel Bloom */}
              {datos.nivelBloom && (
                <div className="bloom-analysis">
                  <h5>🎯 Taxonomía de Bloom</h5>
                  {Object.entries(datos.nivelBloom).map(([nivel, info]) => (
                    <div key={nivel} className="bloom-item">
                      <div className="bloom-header">
                        <span className="bloom-label">{nivel}</span>
                        <span className="bloom-percentage">{info.porcentaje}%</span>
                      </div>
                      <div className="bloom-bar">
                        <div 
                          className="bloom-fill"
                          style={{ width: `${info.porcentaje}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {datos.areasDebiles && datos.areasDebiles.length > 0 && (
                <div className="weak-areas">
                  <span className="weak-label">⚠️ Áreas a reforzar:</span>
                  <div className="weak-tags">
                    {datos.areasDebiles.map((area, i) => (
                      <span key={i} className="weak-tag">{area}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Badges Obtenidos */}
      {badges && badges.length > 0 && (
        <div className="badges-section">
          <h3>🏆 Logros Obtenidos</h3>
          <div className="badges-grid">
            {badges.map((badge, index) => (
              <div key={index} className="badge-card">
                <div className="badge-icon">{getBadgeIcon(badge.tipo)}</div>
                <h4>{badge.tipo}</h4>
                <p>{badge.descripcion}</p>
                <span className="badge-date">
                  {new Date(badge.fecha).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rutas de Estudio Personalizadas */}
      {rutasDeEstudio && rutasDeEstudio.length > 0 && (
        <div className="learning-paths">
          <h3>🎓 Rutas de Aprendizaje Personalizadas</h3>
          <div className="paths-container">
            {rutasDeEstudio.map((ruta, index) => (
              <div key={index} className="path-card">
                <div className="path-header">
                  <div className="path-priority">
                    <span 
                      className="priority-badge"
                      style={{
                        background: ruta.prioridad === 'Alta' ? '#ef4444' :
                                   ruta.prioridad === 'Media' ? '#f59e0b' : '#10b981'
                      }}
                    >
                      {ruta.prioridad}
                    </span>
                  </div>
                  <h4>{ruta.categoria}</h4>
                  <span className="path-time">⏱️ {ruta.tiempoEstimado}</span>
                </div>

                <p className="path-reason">{ruta.razon}</p>

                {ruta.temasClave && ruta.temasClave.length > 0 && (
                  <div className="key-topics">
                    <h5>📌 Temas Clave</h5>
                    <ul>
                      {ruta.temasClave.map((tema, i) => (
                        <li key={i}>{tema}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {ruta.recursos && ruta.recursos.length > 0 && (
                  <div className="resources">
                    <h5>📚 Recursos Recomendados</h5>
                    <ul>
                      {ruta.recursos.map((recurso, i) => (
                        <li key={i}>
                          <a 
                            href={recurso.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            {recurso.titulo}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {ruta.ejerciciosPracticos && ruta.ejerciciosPracticos.length > 0 && (
                  <div className="exercises">
                    <h5>✏️ Ejercicios Prácticos</h5>
                    <ul>
                      {ruta.ejerciciosPracticos.map((ejercicio, i) => (
                        <li key={i}>{ejercicio}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticResults;
