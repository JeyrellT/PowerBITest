import React, { useState, useEffect, useContext } from 'react';
import { CxCProgressContext } from '../contexts/CxCProgressContext';
import { GameStateContext } from '../contexts/GameStateContext';
import DialogueBox from '../components/cxc/DialogueBox';
import { MISSIONS } from '../data/cxc/missions';
import { CHARACTERS } from '../data/cxc/characters';
import MissionEngine from '../utils/MissionEngine';
import DatasetLoader from '../utils/DatasetLoader';
import QuizActivity from '../components/activities/QuizActivity';
import FormActivity from '../components/activities/FormActivity';
import ValidationActivity from '../components/activities/ValidationActivity';
import DragDropActivity from '../components/activities/DragDropActivity';
import '../styles/MissionScreen.css';

/**
 * MissionScreen - Pantalla de misión individual
 * Basado en FASE_2 wireframes y FASE_3 arquitectura de misiones
 * Adaptado para usar props en lugar de react-router-dom
 */
const MissionScreen = ({ missionId: propMissionId, onNavigate }) => {
  const missionId = propMissionId;
  const navigate = React.useMemo(() => onNavigate || (() => {}), [onNavigate]);
  const { progress, updateMissionProgress, completeMission } = useContext(CxCProgressContext);
  const gameState = useContext(GameStateContext);
  const { getGradeFromScore } = gameState || {};

  const mission = MISSIONS[missionId];
  const [phase, setPhase] = useState('intro'); // 'intro', 'work', 'feedback', 'completed'
  const [workProgress, setWorkProgress] = useState(0);
  const [startTime] = useState(Date.now());
  
  // Mission Engine state
  const [missionEngine] = useState(() => 
    new MissionEngine(missionId, {
      onActivityComplete: handleActivityComplete,
      onProgressUpdate: setWorkProgress
    })
  );
  const [activities, setActivities] = useState([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityResults, setActivityResults] = useState([]);
  const [finalScore, setFinalScore] = useState(null);
  const [finalGrade, setFinalGrade] = useState(null);

  const safeGetGrade = typeof getGradeFromScore === 'function'
    ? getGradeFromScore
    : (() => 'Bronce');

  const activityAccuracy = activityResults.length > 0
    ? Math.round(
        activityResults.reduce((sum, r) => sum + (Number(r.score) || 0), 0) /
          activityResults.length
      )
    : 0;
  const scoreForGrade = Number.isFinite(finalScore) ? finalScore : 0;
  const displayGrade = finalGrade || safeGetGrade(scoreForGrade);

  // Activity handlers
  function handleActivityComplete(result) {
    const newResults = [...activityResults, result];
    setActivityResults(newResults);

    // Update global progress
    const progress = missionEngine.calculateProgress(newResults);
    updateMissionProgress(missionId, { percentage: progress });

    // Move to next activity or finish
    if (currentActivityIndex < activities.length - 1) {
      setCurrentActivityIndex(prev => prev + 1);
    } else {
      // All activities completed
      const timeSpent = (Date.now() - startTime) / 1000;
      const score = missionEngine.calculateFinalScore(newResults, timeSpent);
  const grade = safeGetGrade(score);
      
      setFinalScore(score);
      setFinalGrade(grade);
      
      updateMissionProgress(missionId, {
        percentage: 100,
        score,
        grade,
        timeSpent: Math.round(timeSpent)
      });

      setPhase('feedback');
    }
  }
  
  useEffect(() => {
    if (!mission) {
      navigate('/cxc/menu');
      return;
    }

    // Emitir evento de misión activa
    window.dispatchEvent(
      new CustomEvent('cxc:mission:active', {
        detail: { missionId }
      })
    );

    // Listener para ayudas solicitadas
    const handleHelpRequested = (event) => {
      if (event.detail?.missionId === missionId) {
        // Aquí se manejaría mostrar la ayuda
        console.log('Ayuda solicitada:', event.detail.helpType);
      }
    };

    window.addEventListener('cxc:help:requested', handleHelpRequested);

    return () => {
      window.removeEventListener('cxc:help:requested', handleHelpRequested);
      // Limpiar misión activa
      window.dispatchEvent(
        new CustomEvent('cxc:mission:active', {
          detail: { missionId: null }
        })
      );
    };
  }, [mission, missionId, navigate]);

  const handleIntroComplete = () => {
    // Generate activities when starting work phase
    const generatedActivities = missionEngine.generateActivitiesForMission();
    setActivities(generatedActivities);
    setPhase('work');
    updateMissionProgress(missionId, { percentage: 10 });
  };

  const renderActivity = () => {
    if (!activities || activities.length === 0) {
      return (
        <div className="activity-loading">
          <p>Cargando actividad...</p>
        </div>
      );
    }

    const activity = activities[currentActivityIndex];
    if (!activity) return null;

    const dataset = activity.datasetName 
      ? DatasetLoader.loadDataset(activity.datasetName) 
      : {};

    switch (activity.type) {
      case 'quiz':
        return (
          <QuizActivity
            questions={activity.questions}
            onComplete={(data) => {
              const result = missionEngine.validateActivity(activity.id, data);
              handleActivityComplete(result);
            }}
            onProgress={setWorkProgress}
          />
        );

      case 'form':
        return (
          <FormActivity
            fields={activity.fields}
            initialData={activity.initialData || {}}
            instructions={activity.instructions}
            onComplete={(data) => {
              const result = missionEngine.validateActivity(activity.id, data);
              handleActivityComplete(result);
            }}
            onProgress={setWorkProgress}
          />
        );

      case 'validation':
        return (
          <ValidationActivity
            validationChecks={activity.validationChecks || activity.checks || []}
            dataset={dataset}
            instructions={activity.instructions}
            onComplete={(data) => {
              const result = missionEngine.validateActivity(activity.id, data);
              handleActivityComplete(result);
            }}
            onProgress={setWorkProgress}
          />
        );

      case 'drag_drop':
        return (
          <DragDropActivity
            items={dataset.payments || []}
            targets={dataset.invoices || []}
            correctMatches={dataset.correctMatches || {}}
            instructions={activity.instructions}
            onComplete={(data) => {
              const result = missionEngine.validateActivity(activity.id, data);
              handleActivityComplete(result);
            }}
            onProgress={setWorkProgress}
          />
        );

      case 'problem_solving':
      case 'data_quality':
        return (
          <div className="activity-placeholder">
            <div className="placeholder-message">
              <span className="placeholder-icon">🚧</span>
              <h3>Actividad en Desarrollo</h3>
              <p>Tipo: {activity.type}</p>
              <p>{activity.instructions}</p>
              <button 
                className="btn-primary"
                onClick={() => {
                  handleActivityComplete({ score: 85, valid: true });
                }}
              >
                Completar (demo)
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="activity-error">
            <p>Tipo de actividad no soportado: {activity.type}</p>
          </div>
        );
    }
  };

  const handleCompleteMission = async () => {
    const safeScore = Number.isFinite(finalScore) ? finalScore : 0;
  const grade = displayGrade;
    await completeMission(missionId, safeScore, grade);
    setPhase('completed');
  };

  const handleBackToMenu = () => {
    navigate('/cxc/menu');
  };

  if (!mission) {
    return null;
  }

  return (
    <div className="mission-screen">
      {/* Header */}
      <header className="mission-header">
        <div className="container">
          <div className="mission-header-content">
            <button className="back-button" onClick={handleBackToMenu}>
              <span>←</span>
            </button>
            <div className="mission-title-section">
              <h1 className="mission-title">
                <span className="mission-icon">{mission.icon}</span>
                {mission.title}
              </h1>
              <p className="mission-subtitle">{mission.subtitle}</p>
            </div>
            <div className="mission-meta">
              <span className="mission-duration">⏱️ {mission.duration} min</span>
              <span className="mission-difficulty difficulty-{mission.dificultad}">
                {mission.dificultad === 'tutorial' ? '🎓' : mission.dificultad === 'facil' ? '⭐' : mission.dificultad === 'medio' ? '⭐⭐' : '⭐⭐⭐'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mission-main">
        <div className="container">
          {/* Intro phase */}
          {phase === 'intro' && (
            <div className="mission-phase mission-phase--intro">
              <div className="intro-card">
                <h2>Objetivos de la Misión</h2>
                <ul className="objectives-list">
                  {mission.objectives.map((obj, index) => (
                    <li key={index} className="objective-item">
                      <span className="objective-icon">✓</span>
                      {obj}
                    </li>
                  ))}
                </ul>

                {mission.kpis && (
                  <div className="kpis-section">
                    <h3>Indicadores de Éxito (KPIs)</h3>
                    <div className="kpis-grid">
                      {Object.entries(mission.kpis).map(([key, value]) => (
                        <div key={key} className="kpi-card">
                          <span className="kpi-name">{key}</span>
                          <span className="kpi-value">{value.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <DialogueBox
                  character={CHARACTERS.tess}
                  dialogues={[
                    `¡Hola! Bienvenido a la misión "${mission.title}".`,
                    mission.description,
                    'Cuando estés listo, haz clic en "Comenzar" para empezar. ¡Buena suerte!'
                  ]}
                  onComplete={handleIntroComplete}
                  autoAdvance={false}
                />
              </div>
            </div>
          )}

          {/* Work phase */}
          {phase === 'work' && (
            <div className="mission-phase mission-phase--work">
              <div className="work-area">
                <div className="work-header">
                  <h2>
                    Actividad {currentActivityIndex + 1} de {activities.length}
                  </h2>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${workProgress}%` }}
                    />
                    <span className="progress-label">{Math.round(workProgress)}%</span>
                  </div>
                </div>

                {/* Render current activity */}
                <div className="work-content">
                  {renderActivity()}
                </div>

                <div className="work-sidebar">
                  <div className="sidebar-card">
                    <h4>💡 Consejos</h4>
                    <ul>
                      <li>Lee cada pregunta cuidadosamente</li>
                      <li>Usa las ayudas si te atascas (botón flotante)</li>
                      <li>No hay penalización por tiempo</li>
                    </ul>
                  </div>

                  <div className="sidebar-card">
                    <h4>📊 Tu Progreso</h4>
                    <div className="stat-row">
                      <span>Tiempo:</span>
                      <span>{Math.round((Date.now() - startTime) / 1000 / 60)} min</span>
                    </div>
                    <div className="stat-row">
                      <span>Actividad:</span>
                      <span>{currentActivityIndex + 1} / {activities.length}</span>
                    </div>
                    <div className="stat-row">
                      <span>Avance:</span>
                      <span>{Math.round(workProgress)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feedback phase */}
          {phase === 'feedback' && finalScore !== null && (
            <div className="mission-phase mission-phase--feedback">
              <div className="feedback-card">
                <div className="feedback-header">
                  <span className="feedback-icon">🎉</span>
                  <h2>¡Misión Completada!</h2>
                </div>

                <div className="score-display">
                  <div className="score-circle">
                    <span className="score-value">
                      {Math.round(finalScore)}
                    </span>
                    <span className="score-label">puntos</span>
                  </div>
                  <div className={`grade-badge grade-${displayGrade.replace(/\s+/g, '-')}`}>
                    {displayGrade}
                  </div>
                </div>

                <div className="feedback-stats">
                  <div className="stat-item">
                    <span className="stat-label">Tiempo total</span>
                    <span className="stat-value">
                      {Math.round((Date.now() - startTime) / 1000 / 60)} min
                    </span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Actividades completadas</span>
                    <span className="stat-value">{activities.length}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Precisión</span>
                    <span className="stat-value">
                      {activityAccuracy}%
                    </span>
                  </div>
                </div>

                <DialogueBox
                  character={CHARACTERS.tess}
                  dialogues={missionEngine.getFeedbackDialogues(
                    finalScore,
                    displayGrade
                  )}
                  onComplete={handleCompleteMission}
                  autoAdvance={false}
                />
              </div>
            </div>
          )}

          {/* Completed phase */}
          {phase === 'completed' && (
            <div className="mission-phase mission-phase--completed">
              <div className="completion-card">
                <span className="completion-icon">✅</span>
                <h2>Misión Registrada</h2>
                <p>Tu progreso ha sido guardado exitosamente.</p>
                <div className="completion-actions">
                  <button className="btn-primary" onClick={handleBackToMenu}>
                    Volver al Menú
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MissionScreen;
