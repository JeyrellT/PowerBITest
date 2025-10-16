import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { useCxCProgress } from '../contexts/CxCProgressContext';
import { questionCounter } from '../utils/questionCounter';
import '../styles/HomeScreen.css';

const HomeScreen = ({ onNavigate, userProfile, onResetProfile }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [userStats, setUserStats] = useState(null);
  const [showQuickStats, setShowQuickStats] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);
  
  // ✅ ÚNICA FUENTE DE VERDAD: useCxCProgress
  const { getStats, getAnsweredQuestions, state } = useCxCProgress();
  
  const [selectedDomain, setSelectedDomain] = useState(
    userProfile?.config?.recommendedDomain || 'all'
  );
  const [selectedLevel, setSelectedLevel] = useState(
    userProfile?.config?.startingDifficulty || 'all'
  );
  const [numberOfQuestions, setNumberOfQuestions] = useState(
    userProfile?.config?.questionCount || 20
  );

  useEffect(() => {
    // ✅ Obtener estadísticas desde el contexto centralizado
    const stats = getStats();
    setUserStats(stats);
    console.log('📊 Estadísticas actualizadas en HomeScreen:', stats);
    
    // Mostrar stats después de un momento
    setTimeout(() => setShowQuickStats(true), 300);
  }, [getStats, state.totalPoints, state.totalXP]); // Recargar cuando cambien puntos o XP

  // Actualizar contador cuando cambian los filtros
  useEffect(() => {
    // ✅ Obtener preguntas respondidas del contexto y pasarlas al contador
    const answeredIds = getAnsweredQuestions();
    const count = questionCounter.countAvailable(selectedDomain, selectedLevel, true, answeredIds);
    setAvailableCount(count);
  }, [selectedDomain, selectedLevel, getAnsweredQuestions]);

  const domains = [
    { value: 'all', label: 'Todos los Dominios', icon: '🎯' },
    { value: 'preparar-datos', label: 'Preparar Datos (25-30%)', icon: '📊' },
    { value: 'modelar-datos', label: 'Modelar Datos (30-35%)', icon: '🔗' },
    { value: 'visualizar-analizar', label: 'Visualizar y Analizar (25-30%)', icon: '📈' },
    { value: 'administrar-asegurar', label: 'Administrar y Asegurar (15-20%)', icon: '🔐' }
  ];

  const levels = [
    { value: 'all', label: 'Todos los Niveles', icon: '⭐' },
    { value: 'principiante', label: 'Principiante', icon: '🌱' },
    { value: 'intermedio', label: 'Intermedio', icon: '🚀' },
    { value: 'avanzado', label: 'Avanzado', icon: '🏆' }
  ];

  const startQuiz = () => {
    const config = {
      domain: selectedDomain,
      level: selectedLevel,
      numberOfQuestions: numberOfQuestions
    };
    onNavigate('instructions', { config });
  };
  
  // Calcular recomendación de estudio
  const getStudyRecommendation = () => {
    if (!userStats || !userStats.domainStats) return null;
    const domainEntries = Object.entries(userStats.domainStats);
    if (domainEntries.length === 0) return null;
    
    const weakestDomain = domainEntries.reduce((min, curr) => {
      const currAccuracy = curr[1].total > 0 ? (curr[1].correct / curr[1].total) : 0;
      const minAccuracy = min[1].total > 0 ? (min[1].correct / min[1].total) : 0;
      return currAccuracy < minAccuracy ? curr : min;
    });
    
    const domainNames = {
      'preparar-datos': 'Preparar Datos',
      'modelar-datos': 'Modelar Datos',
      'visualizar-analizar': 'Visualizar y Analizar',
      'administrar-asegurar': 'Administrar y Asegurar'
    };
    
    return domainNames[weakestDomain[0]] || weakestDomain[0];
  };

  return (
    <div className="home-screen">
      {/* Partículas de fondo */}
      <div className="particles-background">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Navegación Superior Siempre Visible */}
      <div className="global-progress">
        {userStats && userStats.quizzesTaken > 0 && userStats.levelInfo && (
          <div className="progress-info">
            <div className="level-badge">
              <span>{userStats.levelInfo.icon}</span>
              <span>{userStats.levelInfo.name}</span>
            </div>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${userStats.levelInfo.progressToNext || 0}%` }}
              />
            </div>
            <span className="progress-text">{userStats.totalPoints || 0} pts</span>
          </div>
        )}
        
        {(!userStats || userStats.quizzesTaken === 0) && (
          <div className="progress-info">
            <div className="brand-header">
              <span className="brand-icon">⚡</span>
              <span className="brand-name">PL-300 Master</span>
            </div>
          </div>
        )}
        
        <div className="minimal-nav">
          <button className="nav-button glass" onClick={() => onNavigate('exam-guide')}>
            <span className="icon">📘</span>
            <span>Guía</span>
          </button>
          <button className="nav-button glass" onClick={() => onNavigate('profile')}>
            <span className="icon">👤</span>
            <span>Perfil</span>
          </button>
          <button className="nav-button glass" onClick={toggleTheme}>
            <span className="icon">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
        </div>
      </div>

      {/* Hero Section Compacto */}
      <div className="hero-compact">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Domina el <br/>PL-300</h1>
            <p>Certificación Microsoft Power BI Data Analyst con práctica inteligente y análisis profundo</p>
            
            <button className="cta-primary" onClick={startQuiz}>
              <span className="rocket-icon">🚀</span>
              <span>Comenzar Ahora</span>
            </button>

            <div className="quick-actions">
              <button className="quick-action-btn" onClick={() => { setSelectedDomain('all'); setSelectedLevel('all'); startQuiz(); }}>
                <span>🎲</span>
                <span>Test Aleatorio</span>
              </button>
              <button className="quick-action-btn" onClick={() => { setSelectedLevel('avanzado'); startQuiz(); }}>
                <span>🎯</span>
                <span>Modo Examen</span>
              </button>
              <button className="quick-action-btn" onClick={() => onNavigate('cxc')}>
                <span>🏢</span>
                <span>Hub CxC</span>
              </button>
              {userStats && userStats.quizzesTaken > 0 && (
                <button className="quick-action-btn" onClick={() => onNavigate('analysis')}>
                  <span>📊</span>
                  <span>Análisis</span>
                </button>
              )}
            </div>
          </div>

          {/* Dashboard 3D */}
          <div className="dashboard-3d">
            <div className="dashboard-card">
              <div className="card-icon">📊</div>
              <h3>Progreso</h3>
              <div className="card-value">{userStats ? userStats.quizzesTaken : 0}</div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">🎯</div>
              <h3>Precisión</h3>
              <div className="card-value">{userStats ? `${(userStats.accuracy || 0).toFixed(0)}%` : '0%'}</div>
            </div>
            <div className="dashboard-card">
              <div className="card-icon">🏆</div>
              <h3>Puntos</h3>
              <div className="card-value">{userStats ? userStats.totalPoints : 0}</div>
            </div>
          </div>
        </div>
      </div>

        {/* Estadísticas Dinámicas con Gráficos Circulares */}
        {userStats && showQuickStats && userStats.levelInfo && (
          <div className="circular-stats">
            <div className="stats-grid">
              {/* Card 1: Precisión */}
              <div className="stat-card-circular">
                <div className="circular-progress">
                  <svg viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7B3FF2" />
                        <stop offset="100%" stopColor="#00D4FF" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="50" className="progress-bg"/>
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50"
                      className="progress-fill"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 50}`,
                        strokeDashoffset: `${2 * Math.PI * 50 * (1 - (userStats.accuracy || 0) / 100)}`
                      }}
                    />
                  </svg>
                  <div className="progress-value">{(userStats.accuracy || 0).toFixed(0)}%</div>
                </div>
                <div className="stat-label">Precisión Total</div>
              </div>

              {/* Card 2: Racha */}
              <div className="stat-card-circular">
                <div className="circular-progress">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" className="progress-bg"/>
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50"
                      className="progress-fill"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 50}`,
                        strokeDashoffset: `${2 * Math.PI * 50 * (1 - Math.min((userStats.streakDays || 0) / 30, 1))}`
                      }}
                    />
                  </svg>
                  <div className="progress-value">{userStats.streakDays || 0}🔥</div>
                </div>
                <div className="stat-label">Racha Diaria</div>
              </div>

              {/* Card 3: Nivel */}
              <div className="stat-card-circular">
                <div className="circular-progress">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" className="progress-bg"/>
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50"
                      className="progress-fill"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 50}`,
                        strokeDashoffset: `${2 * Math.PI * 50 * (1 - (userStats.levelInfo?.progressToNext || 0) / 100)}`
                      }}
                    />
                  </svg>
                  <div className="progress-value">{userStats.levelInfo?.icon || '📚'}</div>
                </div>
                <div className="stat-label">{userStats.levelInfo?.name || 'Novato'}</div>
              </div>

              {/* Card 4: Quizzes */}
              <div className="stat-card-circular">
                <div className="circular-progress">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" className="progress-bg"/>
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="50"
                      className="progress-fill"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 50}`,
                        strokeDashoffset: `${2 * Math.PI * 50 * (1 - (userStats.quizzesTaken || 0) / 10)}`
                      }}
                    />
                  </svg>
                  <div className="progress-value">{userStats.quizzesTaken || 0}</div>
                </div>
                <div className="stat-label">Quizzes Completados</div>
              </div>
            </div>
          </div>
        )}

        {/* Consejo Inteligente */}
        {getStudyRecommendation() && userStats && userStats.quizzesTaken > 0 && (
          <div className="smart-tip">
            <div className="tip-card">
              <div className="tip-icon">💡</div>
              <div className="tip-content">
                <h4>Consejo Inteligente</h4>
                <p>Enfócate en <strong>{getStudyRecommendation()}</strong> para mejorar tu rendimiento.</p>
              </div>
            </div>
          </div>
        )}

        {/* Progreso por Dominio */}
        {userStats && userStats.quizzesTaken > 0 && (
          <div className="domain-progress">
            <h2 className="section-title">📊 Progreso por Dominio</h2>
            <div className="domain-bars">
              {Object.entries(userStats.domainStats).map(([key, data]) => {
                const domainInfo = {
                  'preparar-datos': { name: 'Preparar Datos', icon: '📊', total: 20 },
                  'modelar-datos': { name: 'Modelar Datos', icon: '🔗', total: 12 },
                  'visualizar-analizar': { name: 'Visualizar y Analizar', icon: '📈', total: 12 },
                  'administrar-asegurar': { name: 'Administrar y Asegurar', icon: '🔐', total: 56 }
                };
                const info = domainInfo[key];
                if (!info) return null;
                
                // ✅ PROGRESO = preguntas intentadas / total de preguntas del dominio * 100
                const progress = info.total > 0 ? (data.attempted / info.total) * 100 : 0;
                const accuracy = data.attempted > 0 ? (data.correct / data.attempted) * 100 : 0;
                
                return (
                  <div key={key} className="domain-bar-item">
                    <div className="domain-header">
                      <span className="domain-name">{info.icon} {info.name}</span>
                      <span className="domain-percentage">{Math.min(progress, 100).toFixed(0)}%</span>
                    </div>
                    <div className="domain-bar-bg">
                      <div className="domain-bar-fill" style={{ width: `${Math.min(progress, 100)}%` }}/>
                    </div>
                    <div className="domain-details">
                      <span>{data.attempted || 0}/{info.total} preguntas</span>
                      <span className="accuracy-badge">{accuracy.toFixed(0)}% precisión</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Configuración Moderna - Wizard */}
        <div className="config-section">
          <h2 className="section-title">⚙️ Configura tu Quiz</h2>
          
          {/* Indicador de Pasos */}
          <div className="steps-indicator">
            <div className="step active">
              <div className="step-number">1</div>
              <div className="step-label">Dominio</div>
              <div className="step-line"></div>
            </div>
            <div className="step active">
              <div className="step-number">2</div>
              <div className="step-label">Nivel</div>
              <div className="step-line"></div>
            </div>
            <div className="step active">
              <div className="step-number">3</div>
              <div className="step-label">Preguntas</div>
            </div>
          </div>

          {/* Selección de Dominios */}
          <div className="domains-grid">
            {domains.map(domain => (
              <div
                key={domain.value}
                className={`domain-card ${selectedDomain === domain.value ? 'selected' : ''}`}
                onClick={() => setSelectedDomain(domain.value)}
              >
                <div className="check-indicator">
                  {selectedDomain === domain.value && <span>✓</span>}
                </div>
                <h4>{domain.icon} {domain.label}</h4>
              </div>
            ))}
          </div>

          {/* Nivel de Dificultad */}
          <div className="level-selector">
            <h3 className="section-title">📊 Nivel de Dificultad</h3>
            <div className="level-buttons">
              {levels.map(level => (
                <button
                  key={level.value}
                  className={`level-btn ${selectedLevel === level.value ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(level.value)}
                >
                  <span>{level.icon}</span>
                  <span>{level.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Preguntas */}
          <div className="question-selector">
            <h3 className="section-title">🔢 Número de Preguntas</h3>
            <div className="slider-container">
              <div className="question-count">{numberOfQuestions}</div>
              <input
                type="range"
                min="5"
                max="46"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(parseInt(e.target.value))}
                className="slider"
              />
            </div>
            
            {/* Contador en tiempo real */}
            <div className="questions-availability-inline">
              <div className="availability-badge">
                <span className="badge-icon">
                  {availableCount >= numberOfQuestions ? '✅' : availableCount > 0 ? 'ℹ️' : '⚠️'}
                </span>
                <span className="badge-text">
                  <strong>{availableCount}</strong> preguntas disponibles
                </span>
              </div>
              {availableCount < numberOfQuestions && availableCount > 0 && (
                <p className="availability-note">
                  ⚠️ Solo hay {availableCount} preguntas disponibles. Se usarán todas las disponibles.
                </p>
              )}
              {availableCount === 0 && (
                <p className="availability-note warning">
                  ⛔ No hay preguntas disponibles con esta configuración. Intenta cambiar el dominio o nivel.
                </p>
              )}
            </div>
          </div>

          {/* Botón Comenzar */}
          <div className="start-button-container">
            <button className="start-quiz-btn" onClick={startQuiz}>
              <span>🚀 Iniciar Quiz Personalizado</span>
            </button>
          </div>
        </div>

        {/* Características */}
        <div className="features-section">
          <h2 className="section-title">✨ Características Destacadas</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📖</div>
              <div className="feature-badge">Certificado</div>
              <h3>Contenido Oficial</h3>
              <p>Preguntas alineadas con la guía oficial del examen PL-300</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💡</div>
              <div className="feature-badge">IA</div>
              <h3>Explicaciones Detalladas</h3>
              <p>Cada pregunta incluye explicaciones completas y referencias</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <div className="feature-badge">Analytics</div>
              <h3>Análisis Profundo</h3>
              <p>Obtén estadísticas detalladas y rutas de estudio personalizadas</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modern-footer">
          <p>© 2025 PL-300 Master Platform</p>
          <p>Preparación profesional para Microsoft Power BI Data Analyst</p>
        </div>
    </div>
  );
};

export default HomeScreen;
