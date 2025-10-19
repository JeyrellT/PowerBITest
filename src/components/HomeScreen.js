import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { useCxCProgress } from '../contexts/CxCProgressContext';
import { useQuizStats, useQuizDuplicateDetection } from '../hooks/useQuizStats';
import { questionCounter } from '../utils/questionCounter';
import '../styles/HomeScreen.css';

const CIRCLE_RADIUS = 55;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const MAX_STREAK_DAYS = 30;
const MAX_QUIZZES_TRACKED = 20;
const numberFormatter = new Intl.NumberFormat('es-ES');

const clampValue = (value, min, max) => Math.min(Math.max(value, min), max);
const toSafeNumber = (value, fallback = 0) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback;
  }
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};
const formatPercent = (value) => `${Math.round(value)}%`;
const formatNumber = (value) => numberFormatter.format(Math.round(toSafeNumber(value, 0)));

const HomeScreen = ({ onNavigate, userProfile, onResetProfile }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [showQuickStats, setShowQuickStats] = useState(false);
  const [availableCount, setAvailableCount] = useState(0);
  const [showConfigMenu, setShowConfigMenu] = useState(false);
  
  // ✅ ÚNICA FUENTE DE VERDAD: useCxCProgress
  const { getAnsweredQuestions, state } = useCxCProgress();
  
  // ✅ NUEVO: Usar hook personalizado para estadísticas sin duplicación
  const userStats = useQuizStats();
  const duplicateReport = useQuizDuplicateDetection();
  
  const [selectedDomain, setSelectedDomain] = useState(
    userProfile?.config?.recommendedDomain || 'all'
  );
  const [selectedLevel, setSelectedLevel] = useState(
    userProfile?.config?.startingDifficulty || 'all'
  );
  const [numberOfQuestions, setNumberOfQuestions] = useState(
    userProfile?.config?.questionCount || 20
  );

  // ✅ Efecto para reportar duplicados si se detectan
  useEffect(() => {
    if (duplicateReport && duplicateReport.count > 0) {
      console.warn(`⚠️ DUPLICADOS DETECTADOS: ${duplicateReport.count} quizzes duplicados en el historial`);
    }
  }, [duplicateReport]);

  useEffect(() => {
    // Mostrar stats después de un momento
    setTimeout(() => setShowQuickStats(true), 300);
  }, [state.totalPoints, state.totalXP]); // Recargar cuando cambien puntos o XP

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showConfigMenu && !event.target.closest('.config-dropdown-wrapper')) {
        setShowConfigMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showConfigMenu]);

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

  const statCards = React.useMemo(() => {
    if (!userStats) return [];

    const totalCorrect = toSafeNumber(
      userStats.totalCorrect ?? userStats.correctAnswers ?? userStats.totalCorrectAnswers,
      0
    );
    const totalAnswered = toSafeNumber(
      userStats.totalAnswered ??
      userStats.totalQuestions ??
      userStats.totalAttempts ??
      userStats.totalResponses,
      0
    );
    const accuracyPercent = clampValue(toSafeNumber(userStats.accuracy, 0), 0, 100);

    const streakDaysRaw = Math.max(0, toSafeNumber(userStats.streakDays, 0));
    const streakDays = Math.round(streakDaysRaw);
    const streakProgress = clampValue(streakDaysRaw / MAX_STREAK_DAYS, 0, 1);
    const streakDetail = streakDays >= MAX_STREAK_DAYS
      ? '🔥 Leyenda de la racha'
      : streakDays >= 7
        ? '🏆 ¡Excelente racha!'
        : streakDays > 0
          ? '💪 Sigue así'
          : '🔥 Empieza hoy';

    const levelName = userStats.levelInfo?.name || 'Novato';
    const levelIcon = userStats.levelInfo?.icon || '📚';
    const levelProgressPercent = clampValue(toSafeNumber(userStats.levelInfo?.progressToNext, 0), 0, 100);

    const quizzesTakenRaw = Math.max(0, toSafeNumber(userStats.quizzesTaken, 0));
    const quizzesProgress = clampValue(quizzesTakenRaw / MAX_QUIZZES_TRACKED, 0, 1);
    const xpTotal = Math.max(0, toSafeNumber(userStats.totalXP, 0));

    return [
      {
        key: 'accuracy',
        className: 'accuracy-card',
        emoji: '🎯',
        title: 'Precisión Total',
        progress: accuracyPercent / 100,
        value: formatPercent(accuracyPercent),
        valueClass: '',
        subtext: 'precisión',
        detail: totalAnswered > 0
          ? `${formatNumber(totalCorrect)} correctas de ${formatNumber(totalAnswered)}`
          : 'Aún sin respuestas registradas',
        tooltip: totalAnswered > 0
          ? `Tasa de acierto: ${formatPercent(accuracyPercent)}`
          : 'Completa tu primer quiz para ver tu precisión',
        isEmpty: accuracyPercent === 0,
        gradientStops: [
          { offset: '0%', color: '#7B3FF2' },
          { offset: '50%', color: '#A855F7' },
          { offset: '100%', color: '#00D4FF' }
        ],
        glowColor: 'rgba(125, 83, 255, 0.6)',
        accent: 'rgba(123, 63, 242, 0.85)',
        accentSoft: 'rgba(123, 63, 242, 0.32)',
        gradientString: 'linear-gradient(135deg, #7B3FF2 0%, #A855F7 50%, #00D4FF 100%)'
      },
      {
        key: 'streak',
        className: `streak-card${streakDays > 0 ? ' active' : ''}`,
        emoji: '🔥',
        title: 'Racha Diaria',
        progress: streakProgress,
        value: formatNumber(streakDays),
        valueClass: '',
        subtext: 'días',
        detail: streakDetail,
        tooltip: streakDays > 0
          ? `¡${streakDays} días consecutivos! Sigue así`
          : 'Completa un quiz hoy para iniciar tu racha',
        isEmpty: streakDays === 0,
        gradientStops: [
          { offset: '0%', color: '#FF6B6B' },
          { offset: '50%', color: '#FF8E53' },
          { offset: '100%', color: '#FFA500' }
        ],
        glowColor: 'rgba(255, 138, 83, 0.65)',
        accent: 'rgba(255, 107, 107, 0.85)',
        accentSoft: 'rgba(255, 107, 107, 0.32)',
        gradientString: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 45%, #FFA500 100%)'
      },
      {
        key: 'level',
        className: `level-card${levelProgressPercent > 80 ? ' near-levelup' : ''}`,
        emoji: '⭐',
        title: 'Nivel Actual',
        progress: levelProgressPercent / 100,
        value: levelIcon,
        valueClass: 'progress-emoji',
        subtext: levelName,
        detail: `${formatPercent(levelProgressPercent)} al siguiente nivel`,
        tooltip: levelProgressPercent > 80
          ? `¡Casi subes de nivel! Solo ${100 - Math.round(levelProgressPercent)}% más`
          : `${levelName} - ${formatPercent(levelProgressPercent)} completado`,
        isEmpty: levelProgressPercent === 0,
        gradientStops: [
          { offset: '0%', color: '#00D4FF' },
          { offset: '50%', color: '#4AE290' },
          { offset: '100%', color: '#00FF88' }
        ],
        glowColor: 'rgba(64, 220, 200, 0.6)',
        accent: 'rgba(0, 212, 255, 0.85)',
        accentSoft: 'rgba(0, 212, 255, 0.32)',
        gradientString: 'linear-gradient(135deg, #00D4FF 0%, #4AE290 55%, #00FF88 100%)'
      },
      {
        key: 'quizzes',
        className: 'quizzes-card',
        emoji: '📝',
        title: 'Quizzes',
        progress: quizzesProgress,
        value: formatNumber(quizzesTakenRaw),
        valueClass: '',
        subtext: 'completados',
        detail: `${formatNumber(xpTotal)} XP ganados`,
        tooltip: quizzesTakenRaw > 0
          ? `${formatNumber(quizzesTakenRaw)} quizzes completados - ${formatNumber(xpTotal)} XP acumulados`
          : 'Completa tu primer quiz para ganar XP',
        isEmpty: quizzesTakenRaw === 0,
        gradientStops: [
          { offset: '0%', color: '#A855F7' },
          { offset: '50%', color: '#C084FC' },
          { offset: '100%', color: '#E879F9' }
        ],
        glowColor: 'rgba(192, 132, 252, 0.65)',
        accent: 'rgba(192, 132, 252, 0.85)',
        accentSoft: 'rgba(192, 132, 252, 0.32)',
        gradientString: 'linear-gradient(135deg, #A855F7 0%, #C084FC 45%, #E879F9 100%)'
      }
    ];
  }, [userStats]);

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
          <div className="config-dropdown-wrapper">
            <button 
              className="nav-button glass config-btn" 
              onClick={() => setShowConfigMenu(!showConfigMenu)}
            >
              <span className="icon">⚙️</span>
              <span>Configuración</span>
            </button>
            {showConfigMenu && (
              <div className="config-dropdown-menu">
                <button 
                  className="config-menu-item"
                  onClick={() => {
                    setShowConfigMenu(false);
                    onNavigate('cxc');
                  }}
                >
                  <span className="icon">🏢</span>
                  <span className="item-text">
                    <strong>CxC Hub</strong>
                    <small>Centro de Conocimiento y Competencias</small>
                  </span>
                </button>
                <button 
                  className="config-menu-item"
                  onClick={() => {
                    setShowConfigMenu(false);
                    toggleTheme();
                  }}
                >
                  <span className="icon">{theme === 'light' ? '🌙' : '☀️'}</span>
                  <span className="item-text">
                    <strong>Cambiar Tema</strong>
                    <small>{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</small>
                  </span>
                </button>
                {onResetProfile && (
                  <button 
                    className="config-menu-item"
                    onClick={() => {
                      setShowConfigMenu(false);
                      if (window.confirm('¿Estás seguro de que quieres reiniciar tu perfil?')) {
                        onResetProfile();
                      }
                    }}
                  >
                    <span className="icon">🔄</span>
                    <span className="item-text">
                      <strong>Reiniciar Perfil</strong>
                      <small>Volver al onboarding inicial</small>
                    </span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Section Compacto */}
      <div className="hero-compact">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <span className="badge-pulse">⚡</span>
              <span>Preparación Profesional PL-300</span>
            </div>
            <h1>Domina el <br/>PL-300</h1>
            <p>Certificación Microsoft Power BI Data Analyst con práctica inteligente, análisis profundo y misiones especializadas</p>
            
            <button className="cta-primary" onClick={startQuiz}>
              <span className="rocket-icon">🚀</span>
              <span>Comenzar Ahora</span>
            </button>

            <div className="quick-actions">
              <button 
                className="quick-action-btn primary-gradient" 
                onClick={() => { setSelectedDomain('all'); setSelectedLevel('all'); startQuiz(); }}
              >
                <span className="btn-icon">🎲</span>
                <span className="btn-content">
                  <strong>Test Aleatorio</strong>
                  <small>Todas las categorías</small>
                </span>
              </button>
              <button 
                className="quick-action-btn exam-mode" 
                onClick={() => { setSelectedLevel('avanzado'); startQuiz(); }}
              >
                <span className="btn-icon">🎯</span>
                <span className="btn-content">
                  <strong>Modo Examen</strong>
                  <small>Nivel avanzado</small>
                </span>
              </button>
              {userStats && userStats.quizzesTaken > 0 && (
                <button 
                  className="quick-action-btn analytics" 
                  onClick={() => onNavigate('analysis')}
                >
                  <span className="btn-icon">📊</span>
                  <span className="btn-content">
                    <strong>Análisis</strong>
                    <small>Ver estadísticas</small>
                  </span>
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
        {userStats && showQuickStats && statCards.length > 0 && (
          <div className="circular-stats">
            <div className="stats-header">
              <h2 className="section-title">📊 Tus Estadísticas</h2>
              <p className="stats-subtitle">Resumen de tu progreso y rendimiento</p>
            </div>

            <div className="stats-grid">
              {statCards.map((card) => {
                const circleProgress = clampValue(card.progress, 0, 1);
                const progressOffset = CIRCLE_CIRCUMFERENCE * (1 - circleProgress);
                const gradientId = `gradient-${card.key}`;
                const filterId = `glow-${card.key}`;

                return (
                  <article
                    key={card.key}
                    className={`stat-card-circular ${card.className}`}
                    style={{
                      '--stat-accent': card.accent,
                      '--stat-accent-soft': card.accentSoft,
                      '--stat-gradient': card.gradientString,
                      '--stat-glow': card.glowColor
                    }}
                    aria-label={`${card.title}: ${card.value} ${card.subtext}`}
                  >
                    {card.tooltip && (
                      <div className="tooltip" role="tooltip">
                        {card.tooltip}
                      </div>
                    )}
                    <header className="card-header">
                      <span className="card-emoji" aria-hidden="true">{card.emoji}</span>
                      <span className="card-title">{card.title}</span>
                    </header>

                    <div className={`circular-progress${card.isEmpty ? ' empty' : ''}`}>
                      <div className="progress-orb" aria-hidden="true" />
                      <svg viewBox="0 0 140 140" className="progress-ring" role="img" aria-hidden="true">
                        <defs>
                          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            {card.gradientStops.map((stop) => (
                              <stop
                                key={`${card.key}-${stop.offset}`}
                                offset={stop.offset}
                                stopColor={stop.color}
                              />
                            ))}
                          </linearGradient>
                          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={card.glowColor} floodOpacity="0.7" />
                          </filter>
                        </defs>
                        <circle cx="70" cy="70" r={CIRCLE_RADIUS} className="progress-bg" />
                        <circle
                          cx="70"
                          cy="70"
                          r={CIRCLE_RADIUS}
                          className="progress-fill"
                          stroke={`url(#${gradientId})`}
                          filter={`url(#${filterId})`}
                          style={{
                            '--progress-total': CIRCLE_CIRCUMFERENCE,
                            '--progress-offset': progressOffset,
                            strokeDasharray: CIRCLE_CIRCUMFERENCE,
                            strokeDashoffset: CIRCLE_CIRCUMFERENCE,
                            transform: 'rotate(-90deg)',
                            transformOrigin: 'center'
                          }}
                        />
                      </svg>
                      <div className="progress-center">
                        <div className={`progress-value ${card.valueClass || ''}`}>{card.value}</div>
                        <div className="progress-subtext">{card.subtext}</div>
                      </div>
                    </div>

                    <footer className="stat-footer">
                      <span className="stat-detail">{card.detail}</span>
                    </footer>
                  </article>
                );
              })}
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

        {/* Banner CxC Hub para nuevos usuarios */}
        {(!userStats || userStats.quizzesTaken === 0) && (
          <div className="cxc-banner">
            <div className="cxc-banner-content">
              <div className="cxc-banner-icon">🏢</div>
              <div className="cxc-banner-text">
                <h3>¿Nuevo aquí? Explora el CxC Hub</h3>
                <p>Centro de Conocimiento y Competencias con misiones especializadas, aprendizaje gamificado y seguimiento de progreso avanzado</p>
                <button 
                  className="cxc-banner-btn"
                  onClick={() => onNavigate('cxc')}
                >
                  <span>Explorar CxC Hub</span>
                  <span className="arrow">→</span>
                </button>
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
                
                // ✅ VALIDACIÓN ROBUSTA: Asegurar que todos los valores sean numéricos válidos
                const attempted = toSafeNumber(data.attempted, 0);
                const correct = toSafeNumber(data.correct, 0);
                const domainTotal = toSafeNumber(info.total, 1); // Evitar división por 0
                
                // ✅ PROGRESO = preguntas correctas (dominadas) / total de preguntas del dominio * 100
                const rawProgress = domainTotal > 0 ? (correct / domainTotal) * 100 : 0;
                const progress = clampValue(rawProgress, 0, 100);
                
                // ✅ PRECISIÓN = respuestas correctas / intentadas * 100
                const rawAccuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
                const accuracy = clampValue(rawAccuracy, 0, 100);
                
                return (
                  <div key={key} className="domain-bar-item">
                    <div className="domain-header">
                      <span className="domain-name">{info.icon} {info.name}</span>
                      <span className="domain-percentage">{Math.round(progress)}%</span>
                    </div>
                    <div className="domain-bar-bg">
                      <div className="domain-bar-fill" style={{ width: `${progress}%` }}/>
                    </div>
                    <div className="domain-details">
                      <span>{Math.round(correct)}/{info.total} preguntas dominadas</span>
                      <span className="accuracy-badge">{Math.round(accuracy)}% precisión</span>
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
            <div className="feature-card feature-card-highlight">
              <div className="feature-icon">🏢</div>
              <div className="feature-badge premium">Premium</div>
              <h3>CxC Hub</h3>
              <p>Centro de Conocimiento y Competencias con misiones especializadas</p>
              <button 
                className="feature-cta"
                onClick={() => onNavigate('cxc')}
              >
                Explorar CxC Hub →
              </button>
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
