// Componente de Visualización Avanzada de Competencias
// Radar Charts, Heatmaps y Dashboards Interactivos

import React, { useState, useMemo } from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, Cell
} from 'recharts';
import '../styles/CompetencyVisualization.css';

// ============================================================================
// CONFIGURACIÓN DE DOMINIOS Y COMPETENCIAS
// ============================================================================

const DOMAIN_CONFIG = {
  'preparar-datos': {
    label: 'Preparar Datos',
    color: '#3b82f6',
    icon: '🔄',
    benchmark: 75
  },
  'diseñar-implementar-modelo': {
    label: 'Modelado',
    color: '#8b5cf6',
    icon: '🗂️',
    benchmark: 80
  },
  'crear-calculos-dax': {
    label: 'DAX',
    color: '#10b981',
    icon: '📊',
    benchmark: 70
  },
  'visualizar-analizar': {
    label: 'Visualización',
    color: '#f59e0b',
    icon: '📈',
    benchmark: 75
  },
  'crear-reportes': {
    label: 'Reportes',
    color: '#ef4444',
    icon: '📄',
    benchmark: 75
  },
  'optimizar-rendimiento': {
    label: 'Rendimiento',
    color: '#ec4899',
    icon: '⚡',
    benchmark: 65
  },
  'asegurar-gobernar': {
    label: 'Seguridad',
    color: '#06b6d4',
    icon: '🔒',
    benchmark: 70
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const CompetencyVisualization = ({ results, historicalData = [], userProfile }) => {
  const [selectedView, setSelectedView] = useState('radar');
  const [comparisonMode, setComparisonMode] = useState(false);
  
  // Procesar datos para visualizaciones
  const competencyData = useMemo(() => 
    processCompetencyData(results, historicalData),
    [results, historicalData]
  );
  
  const heatmapData = useMemo(() => 
    generateHeatmapData(historicalData),
    [historicalData]
  );
  
  const trendData = useMemo(() => 
    generateTrendData(historicalData),
    [historicalData]
  );
  
  return (
    <div className="competency-visualization">
      <div className="visualization-header">
        <h2>📊 Análisis de Competencias</h2>
        <div className="view-selector">
          <button 
            className={selectedView === 'radar' ? 'active' : ''}
            onClick={() => setSelectedView('radar')}
          >
            Radar 🎯
          </button>
          <button 
            className={selectedView === 'heatmap' ? 'active' : ''}
            onClick={() => setSelectedView('heatmap')}
          >
            Mapa de Calor 🔥
          </button>
          <button 
            className={selectedView === 'trends' ? 'active' : ''}
            onClick={() => setSelectedView('trends')}
          >
            Tendencias 📈
          </button>
          <button 
            className={selectedView === 'dashboard' ? 'active' : ''}
            onClick={() => setSelectedView('dashboard')}
          >
            Dashboard 📋
          </button>
        </div>
        <label className="comparison-toggle">
          <input 
            type="checkbox" 
            checked={comparisonMode}
            onChange={(e) => setComparisonMode(e.target.checked)}
          />
          Comparar con benchmark
        </label>
      </div>
      
      <div className="visualization-content">
        {selectedView === 'radar' && (
          <RadarChartView 
            data={competencyData} 
            showBenchmark={comparisonMode}
          />
        )}
        
        {selectedView === 'heatmap' && (
          <HeatmapView data={heatmapData} />
        )}
        
        {selectedView === 'trends' && (
          <TrendsView data={trendData} />
        )}
        
        {selectedView === 'dashboard' && (
          <CompetencyDashboard 
            competencyData={competencyData}
            heatmapData={heatmapData}
            userProfile={userProfile}
          />
        )}
      </div>
      
      <GapAnalysis data={competencyData} />
    </div>
  );
};

// ============================================================================
// VISTA DE RADAR CHART
// ============================================================================

const RadarChartView = ({ data, showBenchmark }) => {
  return (
    <div className="radar-chart-container">
      <ResponsiveContainer width="100%" height={500}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis 
            dataKey="domain" 
            tick={{ fill: '#374151', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 11 }}
          />
          <Radar
            name="Tu Desempeño"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          {showBenchmark && (
            <Radar
              name="Benchmark PL-300"
              dataKey="benchmark"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.3}
            />
          )}
          <Tooltip 
            contentStyle={{ 
              background: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
      
      <div className="radar-insights">
        <h3>Insights del Radar Chart</h3>
        <ul>
          {data.map(item => {
            const gap = showBenchmark ? item.benchmark - item.score : 0;
            if (showBenchmark && gap > 10) {
              return (
                <li key={item.domain} className="insight-item warning">
                  <span className="insight-icon">⚠️</span>
                  <strong>{item.label}</strong>: Brecha de {gap.toFixed(0)}% con el benchmark
                </li>
              );
            } else if (item.score >= 85) {
              return (
                <li key={item.domain} className="insight-item success">
                  <span className="insight-icon">✅</span>
                  <strong>{item.label}</strong>: Excelente dominio ({item.score}%)
                </li>
              );
            }
            return null;
          }).filter(Boolean)}
        </ul>
      </div>
    </div>
  );
};

// ============================================================================
// VISTA DE HEATMAP
// ============================================================================

const HeatmapView = ({ data }) => {
  const getHeatColor = (value) => {
    if (value >= 80) return '#10b981'; // Verde
    if (value >= 60) return '#f59e0b'; // Amarillo
    if (value >= 40) return '#f97316'; // Naranja
    return '#ef4444'; // Rojo
  };
  
  return (
    <div className="heatmap-container">
      <h3>Rendimiento por Dominio a lo Largo del Tiempo</h3>
      <div className="heatmap-grid">
        <div className="heatmap-header">
          <div className="cell header-cell">Dominio</div>
          {data.sessions.map((session, idx) => (
            <div key={idx} className="cell header-cell">
              Quiz {idx + 1}
            </div>
          ))}
        </div>
        {data.domains.map(domain => (
          <div key={domain.key} className="heatmap-row">
            <div className="cell label-cell">
              <span className="domain-icon">{DOMAIN_CONFIG[domain.key]?.icon}</span>
              {domain.label}
            </div>
            {domain.scores.map((score, idx) => (
              <div 
                key={idx} 
                className="cell data-cell"
                style={{ 
                  backgroundColor: getHeatColor(score),
                  color: score >= 60 ? 'white' : '#1f2937'
                }}
              >
                {score !== null ? `${score}%` : '-'}
              </div>
            ))}
          </div>
        ))}
      </div>
      
      <div className="heatmap-legend">
        <span>Frío (Bajo)</span>
        <div className="legend-gradient"></div>
        <span>Caliente (Alto)</span>
      </div>
    </div>
  );
};

// ============================================================================
// VISTA DE TENDENCIAS
// ============================================================================

const TrendsView = ({ data }) => {
  return (
    <div className="trends-container">
      <h3>Evolución del Desempeño</h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="session" 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            label={{ value: 'Precisión (%)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            contentStyle={{ 
              background: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="overall" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Promedio General"
            dot={{ r: 5 }}
          />
          <Line 
            type="monotone" 
            dataKey="dax" 
            stroke="#10b981" 
            strokeWidth={2}
            name="DAX"
            dot={{ r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="modelado" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            name="Modelado"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="trend-summary">
        <TrendIndicator data={data} metric="overall" label="General" />
        <TrendIndicator data={data} metric="dax" label="DAX" />
        <TrendIndicator data={data} metric="modelado" label="Modelado" />
      </div>
    </div>
  );
};

const TrendIndicator = ({ data, metric, label }) => {
  const validData = data.filter(d => d[metric] !== null);
  if (validData.length < 2) return null;
  
  const firstValue = validData[0][metric];
  const lastValue = validData[validData.length - 1][metric];
  const change = lastValue - firstValue;
  const trend = change > 0 ? 'up' : change < 0 ? 'down' : 'stable';
  
  return (
    <div className={`trend-indicator trend-${trend}`}>
      <strong>{label}</strong>
      <span className="trend-arrow">
        {trend === 'up' ? '📈' : trend === 'down' ? '📉' : '➡️'}
      </span>
      <span className="trend-value">
        {change > 0 ? '+' : ''}{change.toFixed(1)}%
      </span>
    </div>
  );
};

// ============================================================================
// DASHBOARD DE COMPETENCIAS
// ============================================================================

const CompetencyDashboard = ({ competencyData, heatmapData, userProfile }) => {
  const strongAreas = competencyData.filter(d => d.score >= 80);
  const weakAreas = competencyData.filter(d => d.score < 60);
  const needsImprovement = competencyData.filter(d => d.score >= 60 && d.score < 80);
  
  return (
    <div className="competency-dashboard">
      <div className="dashboard-grid">
        {/* Resumen de Estado */}
        <div className="dashboard-card status-card">
          <h3>Estado General</h3>
          <div className="status-indicator">
            <div className="status-circle">
              {competencyData.reduce((sum, d) => sum + d.score, 0) / competencyData.length || 0}%
            </div>
            <p>Competencia Promedio</p>
          </div>
          {userProfile && (
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-label">Rango</span>
                <span className="stat-value">{userProfile.rank?.name || 'N/A'}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Total XP</span>
                <span className="stat-value">{userProfile.totalXP || 0}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Fortalezas */}
        <div className="dashboard-card strengths-card">
          <h3>💪 Fortalezas ({strongAreas.length})</h3>
          <ul className="competency-list">
            {strongAreas.map(area => (
              <li key={area.domain}>
                <span className="competency-icon">{DOMAIN_CONFIG[area.domain]?.icon}</span>
                <span className="competency-name">{area.label}</span>
                <span className="competency-score success">{area.score}%</span>
              </li>
            ))}
            {strongAreas.length === 0 && (
              <li className="empty-state">Sigue practicando para desarrollar fortalezas</li>
            )}
          </ul>
        </div>
        
        {/* Áreas de Mejora */}
        <div className="dashboard-card improvement-card">
          <h3>📚 Necesita Mejorar ({needsImprovement.length})</h3>
          <ul className="competency-list">
            {needsImprovement.map(area => (
              <li key={area.domain}>
                <span className="competency-icon">{DOMAIN_CONFIG[area.domain]?.icon}</span>
                <span className="competency-name">{area.label}</span>
                <span className="competency-score warning">{area.score}%</span>
              </li>
            ))}
            {needsImprovement.length === 0 && (
              <li className="empty-state">¡Excelente trabajo en todas las áreas!</li>
            )}
          </ul>
        </div>
        
        {/* Áreas Débiles */}
        <div className="dashboard-card weak-card">
          <h3>⚠️ Áreas Débiles ({weakAreas.length})</h3>
          <ul className="competency-list">
            {weakAreas.map(area => (
              <li key={area.domain}>
                <span className="competency-icon">{DOMAIN_CONFIG[area.domain]?.icon}</span>
                <span className="competency-name">{area.label}</span>
                <span className="competency-score danger">{area.score}%</span>
              </li>
            ))}
            {weakAreas.length === 0 && (
              <li className="empty-state">No hay áreas débiles identificadas</li>
            )}
          </ul>
        </div>
        
        {/* Recomendaciones Prioritarias */}
        <div className="dashboard-card recommendations-card">
          <h3>🎯 Recomendaciones Prioritarias</h3>
          <div className="recommendations-list">
            {weakAreas.slice(0, 3).map((area, idx) => (
              <div key={area.domain} className="recommendation-item">
                <span className="priority-badge">Prioridad {idx + 1}</span>
                <h4>{area.label}</h4>
                <p>Brecha de {(100 - area.score).toFixed(0)}% hacia el dominio completo</p>
                <button className="study-btn">
                  Estudiar {area.label} 📖
                </button>
              </div>
            ))}
            {weakAreas.length === 0 && needsImprovement.length > 0 && (
              needsImprovement.slice(0, 2).map((area, idx) => (
                <div key={area.domain} className="recommendation-item">
                  <span className="priority-badge">Optimizar {idx + 1}</span>
                  <h4>{area.label}</h4>
                  <p>Alcanzado {area.score}%, falta {(100 - area.score).toFixed(0)}% para maestría</p>
                  <button className="study-btn">
                    Reforzar {area.label} 📖
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Distribución de Competencias */}
        <div className="dashboard-card distribution-card">
          <h3>Distribución de Competencias</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={competencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="label" 
                tick={{ fill: '#6b7280', fontSize: 10 }}
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {competencyData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={DOMAIN_CONFIG[entry.domain]?.color || '#3b82f6'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ANÁLISIS DE GAPS
// ============================================================================

const GapAnalysis = ({ data }) => {
  const gaps = data.map(item => ({
    ...item,
    gap: item.benchmark - item.score,
    gapPercentage: ((item.benchmark - item.score) / item.benchmark) * 100
  })).sort((a, b) => b.gap - a.gap);
  
  const criticalGaps = gaps.filter(g => g.gap > 15);
  
  return (
    <div className="gap-analysis">
      <h3>📊 Análisis de Brechas vs Benchmark PL-300</h3>
      <div className="gap-grid">
        {gaps.map(item => (
          <div 
            key={item.domain} 
            className={`gap-item ${item.gap > 15 ? 'critical' : item.gap > 5 ? 'moderate' : 'minimal'}`}
          >
            <div className="gap-header">
              <span className="gap-icon">{DOMAIN_CONFIG[item.domain]?.icon}</span>
              <strong>{item.label}</strong>
            </div>
            <div className="gap-bars">
              <div className="bar-container">
                <div className="bar your-bar" style={{ width: `${item.score}%` }}>
                  {item.score}%
                </div>
              </div>
              <div className="bar-container">
                <div className="bar benchmark-bar" style={{ width: `${item.benchmark}%` }}>
                  Benchmark: {item.benchmark}%
                </div>
              </div>
            </div>
            <div className="gap-value">
              Brecha: <strong>{item.gap > 0 ? `${item.gap.toFixed(0)}%` : 'Superado ✅'}</strong>
            </div>
          </div>
        ))}
      </div>
      
      {criticalGaps.length > 0 && (
        <div className="critical-gaps-alert">
          <h4>⚠️ Brechas Críticas Detectadas</h4>
          <p>
            Se encontraron {criticalGaps.length} área(s) con brechas significativas (&gt;15%) respecto al benchmark.
            Enfócate en: <strong>{criticalGaps.map(g => g.label).join(', ')}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// FUNCIONES DE PROCESAMIENTO DE DATOS
// ============================================================================

function processCompetencyData(results, historicalData) {
  const domainStats = {};
  
  // Procesar resultados actuales
  if (results && results.questions) {
    results.questions.forEach((q, idx) => {
      const domain = q.dominio;
      if (!domainStats[domain]) {
        domainStats[domain] = { total: 0, correct: 0 };
      }
      domainStats[domain].total++;
      if (results.answers[idx] === q.respuestaCorrecta) {
        domainStats[domain].correct++;
      }
    });
  }
  
  // Convertir a formato de radar chart
  return Object.entries(DOMAIN_CONFIG).map(([key, config]) => {
    const stats = domainStats[key] || { total: 0, correct: 0 };
    const score = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    
    return {
      domain: key,
      label: config.label,
      score: parseFloat(score.toFixed(1)),
      benchmark: config.benchmark,
      total: stats.total,
      correct: stats.correct
    };
  });
}

function generateHeatmapData(historicalData) {
  const domains = Object.keys(DOMAIN_CONFIG).map(key => ({
    key,
    label: DOMAIN_CONFIG[key].label,
    scores: []
  }));
  
  const sessions = historicalData.slice(-10); // Últimas 10 sesiones
  
  domains.forEach(domain => {
    sessions.forEach(session => {
      const domainQuestions = session.questions?.filter(q => q.dominio === domain.key) || [];
      if (domainQuestions.length > 0) {
        const correct = domainQuestions.filter((q, idx) => 
          session.answers[idx] === q.respuestaCorrecta
        ).length;
        domain.scores.push(Math.round((correct / domainQuestions.length) * 100));
      } else {
        domain.scores.push(null);
      }
    });
  });
  
  return { domains, sessions };
}

function generateTrendData(historicalData) {
  return historicalData.slice(-10).map((session, idx) => {
    const overall = session.questions?.length > 0 
      ? (Object.keys(session.answers).filter(i => 
          session.answers[i] === session.questions[i]?.respuestaCorrecta
        ).length / session.questions.length) * 100 
      : null;
    
    const daxQuestions = session.questions?.filter(q => q.dominio === 'crear-calculos-dax') || [];
    const dax = daxQuestions.length > 0
      ? (daxQuestions.filter((q, i) => 
          session.answers[session.questions.indexOf(q)] === q.respuestaCorrecta
        ).length / daxQuestions.length) * 100
      : null;
    
    const modelQuestions = session.questions?.filter(q => q.dominio === 'diseñar-implementar-modelo') || [];
    const modelado = modelQuestions.length > 0
      ? (modelQuestions.filter((q, i) => 
          session.answers[session.questions.indexOf(q)] === q.respuestaCorrecta
        ).length / modelQuestions.length) * 100
      : null;
    
    return {
      session: `Q${idx + 1}`,
      overall: overall !== null ? parseFloat(overall.toFixed(1)) : null,
      dax: dax !== null ? parseFloat(dax.toFixed(1)) : null,
      modelado: modelado !== null ? parseFloat(modelado.toFixed(1)) : null
    };
  });
}

export default CompetencyVisualization;
