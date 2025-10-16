import React, { useMemo } from 'react';
import '../styles/AnalysisScreen.css';
import DiagnosticResults from './DiagnosticResults';
import {
  calcularPuntuacionGlobal,
  analizarPorCategorias,
  generarRutasDeEstudio,
  otorgarBadges
} from '../utils/calificacionDiagnostica';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

const AnalysisScreen = ({ results, onNavigate, onRestart }) => {
  const { questions, answers } = results || {};

  const analysis = useMemo(() => {
    if (!results || !questions) {
      return null;
    }

    const totalQuestions = questions.length;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unanswered = 0;

    const domainStats = {};
    const levelStats = {};
    const subdomainStats = {};

    questions.forEach((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.respuestaCorrecta;

      // Contadores generales
      if (userAnswer === undefined) {
        unanswered++;
      } else if (isCorrect) {
        correctAnswers++;
      } else {
        incorrectAnswers++;
      }

      // Estadísticas por dominio
      if (!domainStats[question.dominio]) {
        domainStats[question.dominio] = { total: 0, correct: 0, incorrect: 0 };
      }
      domainStats[question.dominio].total++;
      if (isCorrect) domainStats[question.dominio].correct++;
      else if (userAnswer !== undefined) domainStats[question.dominio].incorrect++;

      // Estadísticas por nivel
      if (!levelStats[question.nivel]) {
        levelStats[question.nivel] = { total: 0, correct: 0, incorrect: 0 };
      }
      levelStats[question.nivel].total++;
      if (isCorrect) levelStats[question.nivel].correct++;
      else if (userAnswer !== undefined) levelStats[question.nivel].incorrect++;

      // Estadísticas por subdominio
      if (question.subdominio) {
        if (!subdomainStats[question.subdominio]) {
          subdomainStats[question.subdominio] = { total: 0, correct: 0, incorrect: 0 };
        }
        subdomainStats[question.subdominio].total++;
        if (isCorrect) subdomainStats[question.subdominio].correct++;
        else if (userAnswer !== undefined) subdomainStats[question.subdominio].incorrect++;
      }
    });

    const score = ((correctAnswers / totalQuestions) * 100).toFixed(1);

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      unanswered,
      score,
      domainStats,
      levelStats,
      subdomainStats
    };
  }, [results, questions, answers]);

  // Calculate diagnostic data using the advanced system
  const diagnosticData = useMemo(() => {
    if (!results || !questions) {
      return null;
    }

    try {
      const puntuacionGlobal = calcularPuntuacionGlobal(questions, answers);
      const analisisPorCategorias = analizarPorCategorias(questions, answers);
      const rutasDeEstudio = generarRutasDeEstudio(analisisPorCategorias);
      const badges = otorgarBadges(puntuacionGlobal, analisisPorCategorias);

      return {
        puntuacionGlobal,
        analisisPorCategorias,
        rutasDeEstudio,
        badges
      };
    } catch (error) {
      console.error('Error calculating diagnostic data:', error);
      return null;
    }
  }, [results, questions, answers]);

  if (!results || !analysis) {
    return (
      <div className="analysis-screen">
        <div className="analysis-container">
          <div style={{ padding: '3rem', textAlign: 'center', color: '#333' }}>
            <h2>No hay resultados disponibles para análisis</h2>
            <button 
              className="action-button primary" 
              onClick={() => onNavigate('home')}
              style={{ marginTop: '2rem' }}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Datos para gráficos
  const pieData = [
    { name: 'Correctas', value: analysis.correctAnswers, color: '#10b981' },
    { name: 'Incorrectas', value: analysis.incorrectAnswers, color: '#ef4444' },
    { name: 'Sin Responder', value: analysis.unanswered, color: '#94a3b8' }
  ];

  const domainChartData = Object.entries(analysis.domainStats).map(([domain, stats]) => ({
    name: domain,
    Correctas: stats.correct,
    Incorrectas: stats.incorrect,
    Total: stats.total
  }));

  const radarData = Object.entries(analysis.domainStats).map(([domain, stats]) => ({
    subject: domain.substring(0, 15),
    percentage: ((stats.correct / stats.total) * 100).toFixed(0),
    fullMark: 100
  }));

  const getRecommendations = () => {
    const recommendations = [];
    const weakDomains = [];
    const strongDomains = [];

    Object.entries(analysis.domainStats).forEach(([domain, stats]) => {
      const percentage = (stats.correct / stats.total) * 100;
      if (percentage < 60) {
        weakDomains.push({ domain, percentage: percentage.toFixed(0) });
      } else if (percentage >= 80) {
        strongDomains.push({ domain, percentage: percentage.toFixed(0) });
      }
    });

    if (analysis.score >= 80) {
      recommendations.push({
        type: 'success',
        icon: '🎉',
        title: 'Excelente Desempeño',
        message: `Tu puntuación de ${analysis.score}% indica que estás bien preparado para el examen PL-300.`
      });
    } else if (analysis.score >= 70) {
      recommendations.push({
        type: 'warning',
        icon: '⚠️',
        title: 'Buen Progreso',
        message: `Tu puntuación de ${analysis.score}% está cerca del objetivo. Refuerza las áreas débiles para asegurar tu éxito.`
      });
    } else {
      recommendations.push({
        type: 'danger',
        icon: '📚',
        title: 'Necesitas Más Preparación',
        message: `Tu puntuación de ${analysis.score}% indica que debes estudiar más antes de presentar el examen.`
      });
    }

    if (weakDomains.length > 0) {
      recommendations.push({
        type: 'info',
        icon: '🎯',
        title: 'Áreas de Mejora',
        message: `Enfócate en: ${weakDomains.map(d => d.domain).join(', ')}. Estos dominios tienen menos del 60% de respuestas correctas.`
      });
    }

    if (strongDomains.length > 0) {
      recommendations.push({
        type: 'success',
        icon: '💪',
        title: 'Fortalezas Identificadas',
        message: `Excelente dominio en: ${strongDomains.map(d => d.domain).join(', ')}. Mantén este nivel de conocimiento.`
      });
    }

    if (analysis.unanswered > 0) {
      recommendations.push({
        type: 'warning',
        icon: '❓',
        title: 'Preguntas Sin Responder',
        message: `Dejaste ${analysis.unanswered} preguntas sin responder. En el examen real, es mejor adivinar que dejar en blanco.`
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  const getStudyPlan = () => {
    const plan = [];
    
    Object.entries(analysis.domainStats).forEach(([domain, stats]) => {
      const percentage = (stats.correct / stats.total) * 100;
      let priority = 'low';
      let hoursRecommended = 2;
      
      if (percentage < 50) {
        priority = 'high';
        hoursRecommended = 8;
      } else if (percentage < 70) {
        priority = 'medium';
        hoursRecommended = 5;
      }

      plan.push({
        domain,
        percentage: percentage.toFixed(0),
        priority,
        hoursRecommended,
        stats
      });
    });

    return plan.sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage));
  };

  const studyPlan = getStudyPlan();

  return (
    <div className="analysis-screen">
      <div className="analysis-container">
        <header className="analysis-header">
          <h1>📊 Análisis Profundo</h1>
          <p className="analysis-subtitle">Insights detallados sobre tu desempeño</p>
        </header>

        {/* Diagnostic Results Component */}
        {diagnosticData && (
          <DiagnosticResults diagnosticData={diagnosticData} />
        )}

        <div className="recommendations-section">
          <h2>🎯 Recomendaciones Personalizadas</h2>
          <div className="recommendations-grid">
            {recommendations.map((rec, index) => (
              <div key={index} className={`recommendation-card ${rec.type}`}>
                <div className="rec-icon">{rec.icon}</div>
                <div className="rec-content">
                  <h3>{rec.title}</h3>
                  <p>{rec.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="charts-section">
          <h2>📈 Visualización de Resultados</h2>
          
          <div className="charts-grid">
            <div className="chart-card">
              <h3>Distribución de Respuestas</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Desempeño por Dominio</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={domainChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Correctas" fill="#10b981" />
                  <Bar dataKey="Incorrectas" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card full-width">
              <h3>Radar de Competencias</h3>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} />
                  <Radar
                    name="Porcentaje Correcto"
                    dataKey="percentage"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="study-plan-section">
          <h2>📚 Plan de Estudio Recomendado</h2>
          <p className="section-description">
            Basado en tu desempeño, te recomendamos el siguiente plan de estudio:
          </p>
          <div className="study-plan-cards">
            {studyPlan.map((item, index) => (
              <div key={index} className={`study-plan-card priority-${item.priority}`}>
                <div className="plan-header">
                  <h3>{item.domain}</h3>
                  <span className={`priority-badge ${item.priority}`}>
                    {item.priority === 'high' && '🔴 Alta Prioridad'}
                    {item.priority === 'medium' && '🟡 Prioridad Media'}
                    {item.priority === 'low' && '🟢 Mantener'}
                  </span>
                </div>
                <div className="plan-stats">
                  <div className="plan-stat">
                    <span className="stat-label">Rendimiento Actual</span>
                    <span className="stat-value">{item.percentage}%</span>
                  </div>
                  <div className="plan-stat">
                    <span className="stat-label">Preguntas Correctas</span>
                    <span className="stat-value">
                      {item.stats.correct}/{item.stats.total}
                    </span>
                  </div>
                  <div className="plan-stat">
                    <span className="stat-label">Horas Recomendadas</span>
                    <span className="stat-value">{item.hoursRecommended}h</span>
                  </div>
                </div>
                <div className="plan-progress">
                  <div
                    className="plan-progress-bar"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="detailed-stats-section">
          <h2>📋 Estadísticas Detalladas</h2>
          <div className="detailed-stats-grid">
            <div className="stat-detail-card">
              <h3>Por Nivel de Dificultad</h3>
              <div className="stat-table">
                {Object.entries(analysis.levelStats).map(([level, stats]) => {
                  const percentage = ((stats.correct / stats.total) * 100).toFixed(0);
                  return (
                    <div key={level} className="stat-row">
                      <span className="stat-name">
                        {level === 'principiante' && '🌱 Principiante'}
                        {level === 'intermedio' && '🚀 Intermedio'}
                        {level === 'avanzado' && '🏆 Avanzado'}
                      </span>
                      <span className="stat-value">
                        {stats.correct}/{stats.total} ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="stat-detail-card">
              <h3>Top Subdominios Débiles</h3>
              <div className="stat-table">
                {Object.entries(analysis.subdomainStats)
                  .sort((a, b) => {
                    const percA = (a[1].correct / a[1].total) * 100;
                    const percB = (b[1].correct / b[1].total) * 100;
                    return percA - percB;
                  })
                  .slice(0, 5)
                  .map(([subdomain, stats]) => {
                    const percentage = ((stats.correct / stats.total) * 100).toFixed(0);
                    return (
                      <div key={subdomain} className="stat-row">
                        <span className="stat-name">{subdomain}</span>
                        <span className="stat-value">
                          {stats.correct}/{stats.total} ({percentage}%)
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>

        <div className="next-steps-section">
          <h2>🚀 Próximos Pasos</h2>
          <div className="next-steps-cards">
            <div className="next-step-card">
              <div className="step-icon">📖</div>
              <h3>Estudiar Áreas Débiles</h3>
              <p>Revisa la documentación oficial de Microsoft Learn para los dominios con menor puntuación.</p>
            </div>
            <div className="next-step-card">
              <div className="step-icon">🔄</div>
              <h3>Repetir Quiz</h3>
              <p>Practica nuevamente enfocándote en los dominios y niveles donde necesitas mejorar.</p>
            </div>
            <div className="next-step-card">
              <div className="step-icon">💼</div>
              <h3>Práctica Hands-on</h3>
              <p>Trabaja con Power BI Desktop y el servicio para reforzar conceptos teóricos.</p>
            </div>
          </div>
        </div>

        <div className="analysis-actions">
          <button className="action-button secondary" onClick={() => onNavigate('results')}>
            ← Ver Resultados
          </button>
          <button className="action-button primary" onClick={onRestart}>
            🔄 Nuevo Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisScreen;
