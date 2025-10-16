import React from 'react';
import { useCxCProgress } from '../contexts/CxCProgressContext';

/**
 * 🔍 COMPONENTE DE DIAGNÓSTICO DEL SISTEMA
 * 
 * Muestra información detallada del progreso para debugging
 * Útil para entender por qué los datos no se muestran correctamente
 */
const ProgressDiagnostics = () => {
  const { getStats, progress } = useCxCProgress();
  const [showDetails, setShowDetails] = React.useState(false);
  
  const stats = getStats();
  
  // Validaciones
  const validations = {
    hasProgress: !!progress,
    hasAnsweredQuestions: (progress?.answeredQuestions?.length || 0) > 0,
    hasQuestionTracking: Object.keys(progress?.questionTracking || {}).length > 0,
    hasHistory: (progress?.history?.length || 0) > 0,
    hasDomainStats: Object.keys(progress?.domainStats || {}).length > 0,
    hasPoints: (progress?.totalPoints || 0) > 0,
    hasXP: (progress?.totalXP || 0) > 0,
    hasAchievements: (progress?.achievements?.length || 0) > 0
  };
  
  const allValid = Object.values(validations).every(v => v);
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '10px',
      fontSize: '12px',
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      zIndex: 9999,
      border: `2px solid ${allValid ? '#00ff00' : '#ff0000'}`
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
        <h3 style={{ margin: 0 }}>
          🔍 Diagnóstico del Sistema {allValid ? '✅' : '⚠️'}
        </h3>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? '▼' : '▶'}
        </button>
      </div>
      
      {/* Estado Rápido */}
      <div style={{ marginBottom: '10px' }}>
        <strong>Estado General:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
          <li style={{ color: validations.hasProgress ? '#0f0' : '#f00' }}>
            Progress: {validations.hasProgress ? '✅' : '❌'}
          </li>
          <li style={{ color: validations.hasAnsweredQuestions ? '#0f0' : '#f00' }}>
            Answered Questions: {progress?.answeredQuestions?.length || 0} {validations.hasAnsweredQuestions ? '✅' : '❌'}
          </li>
          <li style={{ color: validations.hasQuestionTracking ? '#0f0' : '#f00' }}>
            Question Tracking: {Object.keys(progress?.questionTracking || {}).length} {validations.hasQuestionTracking ? '✅' : '❌'}
          </li>
          <li style={{ color: validations.hasHistory ? '#0f0' : '#f00' }}>
            History: {progress?.history?.length || 0} {validations.hasHistory ? '✅' : '❌'}
          </li>
          <li style={{ color: validations.hasDomainStats ? '#0f0' : '#f00' }}>
            Domain Stats: {Object.keys(progress?.domainStats || {}).length} {validations.hasDomainStats ? '✅' : '❌'}
          </li>
          <li style={{ color: validations.hasPoints ? '#0f0' : '#f00' }}>
            Points: {progress?.totalPoints || 0} {validations.hasPoints ? '✅' : '❌'}
          </li>
          <li style={{ color: validations.hasXP ? '#0f0' : '#f00' }}>
            XP: {progress?.totalXP || 0} {validations.hasXP ? '✅' : '❌'}
          </li>
        </ul>
      </div>
      
      {showDetails && (
        <>
          {/* Stats Calculados */}
          <div style={{ marginBottom: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            <strong>Stats (getStats):</strong>
            <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify({
                totalPoints: stats?.totalPoints,
                totalXP: stats?.totalXP,
                questionsAnswered: stats?.questionsAnswered,
                quizzesTaken: stats?.quizzesTaken,
                globalAccuracy: stats?.globalAccuracy,
                accuracy: stats?.accuracy,
                streakDays: stats?.streakDays,
                achievementCount: stats?.achievementCount,
                levelInfo: stats?.levelInfo
              }, null, 2)}
            </pre>
          </div>
          
          {/* Progress Raw */}
          <div style={{ marginBottom: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            <strong>Progress (raw):</strong>
            <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '200px' }}>
              {JSON.stringify({
                totalPoints: progress?.totalPoints,
                totalXP: progress?.totalXP,
                answeredQuestions: progress?.answeredQuestions?.length,
                questionTrackingCount: Object.keys(progress?.questionTracking || {}).length,
                historyCount: progress?.history?.length,
                domainStatsCount: Object.keys(progress?.domainStats || {}).length,
                achievementsCount: progress?.achievements?.length,
                quizzesTaken: progress?.quizzesTaken,
                currentLevel: progress?.currentLevel
              }, null, 2)}
            </pre>
          </div>
          
          {/* History Detail */}
          {progress?.history && progress.history.length > 0 && (
            <div style={{ marginBottom: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
              <strong>Last 3 History Entries:</strong>
              <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '150px' }}>
                {JSON.stringify(progress.history.slice(0, 3), null, 2)}
              </pre>
            </div>
          )}
          
          {/* Domain Stats Detail */}
          {progress?.domainStats && Object.keys(progress.domainStats).length > 0 && (
            <div style={{ marginBottom: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
              <strong>Domain Stats:</strong>
              <pre style={{ fontSize: '10px', overflow: 'auto', maxHeight: '150px' }}>
                {JSON.stringify(progress.domainStats, null, 2)}
              </pre>
            </div>
          )}
          
          {/* LocalStorage Check */}
          <div style={{ marginBottom: '10px', borderTop: '1px solid #444', paddingTop: '10px' }}>
            <strong>LocalStorage:</strong>
            <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '10px' }}>
              <li>
                Key exists: {localStorage.getItem('cxc-progress') ? '✅' : '❌'}
              </li>
              <li>
                Size: {localStorage.getItem('cxc-progress')?.length || 0} chars
              </li>
            </ul>
          </div>
          
          {/* Actions */}
          <div style={{ borderTop: '1px solid #444', paddingTop: '10px' }}>
            <button
              onClick={() => {
                console.log('📊 PROGRESS COMPLETO:', progress);
                console.log('📈 STATS CALCULADOS:', stats);
                console.log('💾 LOCALSTORAGE:', localStorage.getItem('cxc-progress'));
              }}
              style={{
                background: '#4CAF50',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '5px'
              }}
            >
              📊 Log to Console
            </button>
            <button
              onClick={() => {
                const data = {
                  progress,
                  stats,
                  localStorage: localStorage.getItem('cxc-progress')
                };
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `progress-debug-${new Date().toISOString()}.json`;
                a.click();
              }}
              style={{
                background: '#2196F3',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              💾 Export Debug
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressDiagnostics;
