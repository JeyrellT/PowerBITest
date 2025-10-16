# 📊 ProfileScreen - Métricas Disponibles Post-Fase 1

## 🎯 Vista Rápida: Qué Verás Ahora

Después de implementar Fase 1, estas son **TODAS** las métricas disponibles en el sistema que ProfileScreen puede mostrar:

---

## 📈 ESTADÍSTICAS BÁSICAS

```javascript
const stats = getStats();

stats.totalPoints        // 750
stats.totalXP            // 450
stats.currentLevel       // "Aprendiz"
stats.levelInfo          // { level: 1, name: "Aprendiz", min: 100, max: 300, ... }
```

**Uso en ProfileScreen**:
```jsx
<div className="stat-card">
  <h3>Nivel Actual</h3>
  <div className="level-name">{stats.currentLevel}</div>
  <div className="points">{stats.totalPoints} puntos</div>
  <div className="xp">{stats.totalXP} XP</div>
  <ProgressBar 
    current={stats.levelInfo.progressToNext} 
    max={100} 
  />
</div>
```

---

## 📚 PREGUNTAS Y QUIZZES

```javascript
stats.questionsAnswered  // 15 ← Total preguntas únicas respondidas
stats.correctAnswers     // 27 ← Total respuestas correctas (puede ser > questionsAnswered)
stats.quizzesTaken       // 2 ← Total de quizzes completados
stats.globalAccuracy     // 75.5 ← Precisión global % (correctAnswers/totalAttempts)
```

**Uso en ProfileScreen**:
```jsx
<div className="quiz-stats">
  <StatItem 
    icon="📝" 
    label="Preguntas Respondidas" 
    value={stats.questionsAnswered} 
    total={100}
    unit="preguntas"
  />
  <StatItem 
    icon="✅" 
    label="Respuestas Correctas" 
    value={stats.correctAnswers} 
  />
  <StatItem 
    icon="🎯" 
    label="Quizzes Completados" 
    value={stats.quizzesTaken} 
  />
  <StatItem 
    icon="📊" 
    label="Precisión Global" 
    value={`${stats.globalAccuracy}%`} 
    color={stats.globalAccuracy >= 80 ? 'green' : stats.globalAccuracy >= 60 ? 'yellow' : 'red'}
  />
</div>
```

---

## 🔥 RACHA Y ACTIVIDAD

```javascript
stats.streakDays         // 3 ← Días consecutivos activos
stats.maxStreak          // 7 ← Récord de racha
stats.lastActivity       // "2024-01-15T10:30:00Z" ← Última actividad
```

**Uso en ProfileScreen**:
```jsx
<div className="streak-section">
  <div className="streak-current">
    <div className="streak-icon">🔥</div>
    <div className="streak-value">{stats.streakDays}</div>
    <div className="streak-label">días seguidos</div>
  </div>
  
  <div className="streak-record">
    <span className="label">Récord:</span>
    <span className="value">{stats.maxStreak} días</span>
    <span className="icon">🏆</span>
  </div>
  
  <div className="last-active">
    <span className="label">Última actividad:</span>
    <span className="value">{formatRelativeTime(stats.lastActivity)}</span>
  </div>
</div>
```

**Ejemplo Visual**:
```
┌─────────────────────────┐
│    🔥 RACHA ACTIVA      │
│                         │
│         🔥              │
│         3               │
│    días seguidos        │
│                         │
│  Récord: 7 días 🏆      │
│  Última: hace 2 horas   │
└─────────────────────────┘
```

---

## ⏱️ TIEMPO Y VELOCIDAD

```javascript
stats.totalTimeSpent     // 3600000 ← Tiempo total en ms (3600s = 1h)
stats.avgTimePerQuestion // 240000 ← Promedio por pregunta en ms (240s = 4min)
stats.bestScore          // 95 ← Mejor puntuación en un quiz
stats.fastestQuiz        // 300000 ← Quiz más rápido en ms (300s = 5min)
```

**Uso en ProfileScreen**:
```jsx
<div className="time-stats">
  <StatItem 
    icon="⏱️" 
    label="Tiempo Total" 
    value={formatTime(stats.totalTimeSpent)} // "1h 0m"
  />
  <StatItem 
    icon="⚡" 
    label="Promedio por Pregunta" 
    value={formatTime(stats.avgTimePerQuestion)} // "4m 0s"
  />
  <StatItem 
    icon="🏆" 
    label="Mejor Puntuación" 
    value={`${stats.bestScore}%`} 
  />
  <StatItem 
    icon="🚀" 
    label="Quiz Más Rápido" 
    value={formatTime(stats.fastestQuiz)} // "5m 0s"
  />
</div>
```

---

## 🧠 RETENCIÓN FSRS

```javascript
stats.avgRetention       // 78 ← Retención promedio % (FSRS)
stats.avgStability       // 12 ← Estabilidad promedio en días (FSRS)
stats.dueReviews         // 8 ← Preguntas que necesitan revisión HOY
stats.mastered           // 5 ← Preguntas completamente dominadas
```

**Uso en ProfileScreen**:
```jsx
<div className="fsrs-section">
  <h3>📊 Sistema de Retención (FSRS)</h3>
  
  <div className="retention-meter">
    <CircularProgress 
      value={stats.avgRetention} 
      max={100}
      color={stats.avgRetention >= 80 ? 'green' : 'yellow'}
    />
    <div className="label">Retención Promedio</div>
    <div className="value">{stats.avgRetention}%</div>
  </div>
  
  <div className="fsrs-details">
    <StatItem 
      icon="💪" 
      label="Estabilidad" 
      value={`${stats.avgStability} días`} 
      tooltip="Días promedio de retención"
    />
    <StatItem 
      icon="📌" 
      label="Revisiones Pendientes" 
      value={stats.dueReviews} 
      color={stats.dueReviews > 10 ? 'red' : 'green'}
    />
    <StatItem 
      icon="⭐" 
      label="Preguntas Dominadas" 
      value={stats.mastered} 
    />
  </div>
</div>
```

**Interpretación**:
- `avgRetention ≥ 80%` → 🟢 Excelente memoria
- `avgRetention 60-79%` → 🟡 Buena retención
- `avgRetention < 60%` → 🔴 Necesita repasar más

- `avgStability ≥ 14 días` → 🟢 Conocimiento sólido
- `avgStability 7-13 días` → 🟡 Consolidando
- `avgStability < 7 días` → 🔴 Conocimiento frágil

---

## 🎯 ZONA DE DESARROLLO PRÓXIMO (ZPD)

```javascript
stats.comfortZone        // 20 ← % preguntas con >90% accuracy (muy fáciles)
stats.zpd                // 60 ← % preguntas con 60-90% accuracy (óptimo)
stats.challenging        // 20 ← % preguntas con <60% accuracy (muy difíciles)
```

**Uso en ProfileScreen**:
```jsx
<div className="zpd-section">
  <h3>🎓 Zona de Aprendizaje (Vygotsky)</h3>
  
  <div className="zpd-chart">
    <div className="zone zone-comfort" style={{ width: `${stats.comfortZone}%` }}>
      <span className="label">Confort</span>
      <span className="value">{stats.comfortZone}%</span>
    </div>
    <div className="zone zone-zpd" style={{ width: `${stats.zpd}%` }}>
      <span className="label">ZPD (Óptimo)</span>
      <span className="value">{stats.zpd}%</span>
    </div>
    <div className="zone zone-challenging" style={{ width: `${stats.challenging}%` }}>
      <span className="label">Desafiante</span>
      <span className="value">{stats.challenging}%</span>
    </div>
  </div>
  
  <div className="zpd-recommendation">
    {stats.zpd >= 50 && (
      <div className="recommendation good">
        ✅ Estás en la zona óptima de aprendizaje. Sigue así!
      </div>
    )}
    {stats.comfortZone > 50 && (
      <div className="recommendation warning">
        ⚠️ Muchas preguntas fáciles. Intenta niveles más avanzados.
      </div>
    )}
    {stats.challenging > 40 && (
      <div className="recommendation warning">
        ⚠️ Muchas preguntas difíciles. Repasa fundamentos.
      </div>
    )}
  </div>
</div>
```

**Ejemplo Visual**:
```
┌────────────────────────────────────────┐
│  🎓 Zona de Aprendizaje (Vygotsky)    │
├────────────────────────────────────────┤
│  ┌──────┬──────────────────┬────────┐ │
│  │ 20%  │       60%        │  20%   │ │
│  │🟢 Fácil│  🔵 Óptimo (ZPD)│🔴 Difícil│ │
│  └──────┴──────────────────┴────────┘ │
│                                        │
│  ✅ Estás en zona óptima de           │
│     aprendizaje. Sigue así!           │
└────────────────────────────────────────┘
```

---

## 📚 DOMINIOS

```javascript
stats.domainStats        // { "Preparar los datos": { correct: 10, attempted: 15, accuracy: 66.7 }, ... }
stats.strongDomains      // ["Modelar los datos"] ← Dominios con ≥75% y ≥5 intentos
stats.weakDomains        // ["DAX"] ← Dominios con <60% y ≥5 intentos
```

**Uso en ProfileScreen**:
```jsx
<div className="domains-section">
  <h3>📚 Estadísticas por Dominio</h3>
  
  <div className="strong-domains">
    <h4>💪 Dominios Fuertes (≥75% precisión)</h4>
    {stats.strongDomains.map(domain => (
      <DomainBadge 
        key={domain} 
        name={domain} 
        stats={stats.domainStats[domain]}
        color="green"
      />
    ))}
  </div>
  
  <div className="weak-domains">
    <h4>📖 Dominios a Mejorar (<60% precisión)</h4>
    {stats.weakDomains.map(domain => (
      <DomainBadge 
        key={domain} 
        name={domain} 
        stats={stats.domainStats[domain]}
        color="red"
      />
    ))}
  </div>
  
  <div className="all-domains">
    <h4>Todos los Dominios</h4>
    {Object.entries(stats.domainStats).map(([domain, data]) => (
      <div key={domain} className="domain-row">
        <span className="domain-name">{domain}</span>
        <ProgressBar 
          current={data.correct} 
          max={data.attempted} 
          label={`${data.accuracy.toFixed(1)}%`}
        />
        <span className="domain-count">{data.correct}/{data.attempted}</span>
      </div>
    ))}
  </div>
</div>
```

---

## 🏆 LOGROS

```javascript
stats.achievements       // [{ id: 'first_quiz', ... }, { id: 'perfectionist', ... }]
stats.achievementCount   // 8 ← Total desbloqueados
stats.badges             // [{ id: 'bronze_medal', ... }]
```

**Uso en ProfileScreen**:
```jsx
<div className="achievements-section">
  <h3>🏆 Logros Desbloqueados ({stats.achievementCount})</h3>
  
  <div className="achievement-grid">
    {stats.achievements.map(achievement => (
      <AchievementCard 
        key={achievement.id}
        icon={achievement.icon}
        name={achievement.name}
        description={achievement.description}
        unlockedAt={achievement.unlockedAt}
        tier={achievement.tier}
      />
    ))}
  </div>
  
  <div className="badges-section">
    <h4>🎖️ Insignias</h4>
    {stats.badges.map(badge => (
      <Badge 
        key={badge.id}
        {...badge}
      />
    ))}
  </div>
</div>
```

---

## 🎓 PREPARACIÓN PARA EXAMEN PL-300

```javascript
stats.examReadiness      // 65 ← % preparación (0-100)
stats.daysToReady        // 12 ← Días estimados hasta estar listo
stats.confidence         // { level: 'Buena', icon: '✨', color: 'blue' }
```

**Uso en ProfileScreen**:
```jsx
<div className="exam-readiness-section">
  <h3>🎓 Preparación para Examen PL-300</h3>
  
  <div className="readiness-meter">
    <CircularProgress 
      value={stats.examReadiness} 
      max={100}
      color={getReadinessColor(stats.examReadiness)}
      size="large"
    />
    <div className="readiness-label">
      <div className="percentage">{stats.examReadiness}%</div>
      <div className="label">Preparación</div>
    </div>
  </div>
  
  <div className="confidence-level">
    <span className="icon">{stats.confidence.icon}</span>
    <span className="level">{stats.confidence.level}</span>
  </div>
  
  <div className="days-to-ready">
    <span className="icon">📅</span>
    <span className="label">Días estimados:</span>
    <span className="value">{stats.daysToReady} días</span>
  </div>
  
  <div className="readiness-breakdown">
    <h4>Desglose</h4>
    <div className="breakdown-item">
      <span className="label">Cobertura (60%)</span>
      <ProgressBar 
        current={stats.questionsAnswered} 
        max={100} 
        label={`${stats.questionsAnswered}/100`}
      />
    </div>
    <div className="breakdown-item">
      <span className="label">Precisión (40%)</span>
      <ProgressBar 
        current={stats.globalAccuracy} 
        max={100} 
        label={`${stats.globalAccuracy}%`}
      />
    </div>
  </div>
  
  <div className="readiness-recommendation">
    {getReadinessRecommendation(stats)}
  </div>
</div>

// Helper function
function getReadinessRecommendation(stats) {
  if (stats.examReadiness >= 85) {
    return (
      <div className="recommendation excellent">
        🌟 ¡Estás listo para el examen! Practica con simulacros finales.
      </div>
    );
  } else if (stats.examReadiness >= 70) {
    return (
      <div className="recommendation good">
        ✨ Muy buen progreso. Sigue practicando dominios débiles.
      </div>
    );
  } else if (stats.examReadiness >= 50) {
    return (
      <div className="recommendation developing">
        📈 En desarrollo. Responde {100 - stats.questionsAnswered} preguntas más.
      </div>
    );
  } else {
    return (
      <div className="recommendation starting">
        🌱 Iniciando. Enfócate en cubrir todos los dominios.
      </div>
    );
  }
}
```

**Ejemplo Visual**:
```
┌────────────────────────────────────────┐
│  🎓 Preparación para Examen PL-300    │
├────────────────────────────────────────┤
│           ┌─────────┐                  │
│           │   65%   │    ✨ Buena      │
│           │  ━━━━   │                  │
│           └─────────┘                  │
│                                        │
│  📅 Días estimados: 12 días            │
│                                        │
│  Desglose:                             │
│  • Cobertura: ███████░░░ 70/100 (60%)│
│  • Precisión: ████████░░ 80% (40%)   │
│                                        │
│  ✨ Muy buen progreso.                │
│     Sigue practicando dominios débiles.│
└────────────────────────────────────────┘
```

---

## 📈 INSIGHTS Y TENDENCIAS

```javascript
stats.recentAvgAccuracy  // 82.5 ← Precisión promedio últimos 5 quizzes
stats.improving          // true ← Si último quiz > primer quiz reciente
```

**Uso en ProfileScreen**:
```jsx
<div className="insights-section">
  <h3>📈 Tendencias Recientes</h3>
  
  <div className="recent-performance">
    <StatItem 
      icon="📊" 
      label="Precisión Reciente (últimos 5 quizzes)" 
      value={`${stats.recentAvgAccuracy.toFixed(1)}%`} 
    />
    
    <div className="trend-indicator">
      {stats.improving ? (
        <div className="trend-up">
          <span className="icon">📈</span>
          <span className="label">Mejorando</span>
          <span className="emoji">🔥</span>
        </div>
      ) : (
        <div className="trend-stable">
          <span className="icon">📊</span>
          <span className="label">Estable</span>
        </div>
      )}
    </div>
  </div>
</div>
```

---

## 🎯 EJEMPLO COMPLETO: ProfileScreen Mejorado

```jsx
import React, { useEffect, useState } from 'react';
import { useCxCProgress } from '../contexts/CxCProgressContext';

const ProfileScreen = ({ onNavigate }) => {
  const { getStats, state } = useCxCProgress();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const currentStats = getStats();
    setStats(currentStats);
  }, [state.totalPoints, state.totalXP, state.currentLevel, getStats]);

  if (!stats) return <div>Cargando...</div>;

  return (
    <div className="profile-screen">
      {/* HEADER */}
      <div className="profile-header">
        <div className="avatar">👤</div>
        <h1>{stats.currentLevel}</h1>
        <div className="level-badge">{stats.levelInfo.name}</div>
      </div>

      {/* PUNTOS Y XP */}
      <div className="stats-overview">
        <StatCard icon="💰" label="Puntos" value={stats.totalPoints} />
        <StatCard icon="⚡" label="XP" value={stats.totalXP} />
        <StatCard icon="🎯" label="Nivel" value={stats.levelInfo.level} />
      </div>

      {/* RACHA */}
      <StreakSection 
        current={stats.streakDays} 
        max={stats.maxStreak} 
        lastActivity={stats.lastActivity}
      />

      {/* PROGRESO GENERAL */}
      <QuizStatsSection 
        questionsAnswered={stats.questionsAnswered}
        quizzesTaken={stats.quizzesTaken}
        correctAnswers={stats.correctAnswers}
        globalAccuracy={stats.globalAccuracy}
      />

      {/* FSRS */}
      <FSRSSection 
        retention={stats.avgRetention}
        stability={stats.avgStability}
        dueReviews={stats.dueReviews}
        mastered={stats.mastered}
      />

      {/* ZPD */}
      <ZPDSection 
        comfort={stats.comfortZone}
        zpd={stats.zpd}
        challenging={stats.challenging}
      />

      {/* PREPARACIÓN EXAMEN */}
      <ExamReadinessSection 
        readiness={stats.examReadiness}
        daysToReady={stats.daysToReady}
        confidence={stats.confidence}
        questionsAnswered={stats.questionsAnswered}
        globalAccuracy={stats.globalAccuracy}
      />

      {/* DOMINIOS */}
      <DomainsSection 
        domainStats={stats.domainStats}
        strongDomains={stats.strongDomains}
        weakDomains={stats.weakDomains}
      />

      {/* LOGROS */}
      <AchievementsSection 
        achievements={stats.achievements}
        achievementCount={stats.achievementCount}
        badges={stats.badges}
      />

      {/* INSIGHTS */}
      <InsightsSection 
        recentAvgAccuracy={stats.recentAvgAccuracy}
        improving={stats.improving}
      />
    </div>
  );
};

export default ProfileScreen;
```

---

## ✅ Resumen: Métricas por Categoría

| Categoría | Métricas Disponibles | Total |
|-----------|---------------------|-------|
| **Básicas** | totalPoints, totalXP, currentLevel, levelInfo | 4 |
| **Preguntas/Quizzes** | questionsAnswered, correctAnswers, quizzesTaken, globalAccuracy | 4 |
| **Racha** | streakDays, maxStreak, lastActivity | 3 |
| **Tiempo** | totalTimeSpent, avgTimePerQuestion, bestScore, fastestQuiz | 4 |
| **FSRS** | avgRetention, avgStability, dueReviews, mastered | 4 |
| **ZPD** | comfortZone, zpd, challenging | 3 |
| **Dominios** | domainStats, strongDomains, weakDomains | 3 |
| **Logros** | achievements, achievementCount, badges | 3 |
| **Examen** | examReadiness, daysToReady, confidence | 3 |
| **Insights** | recentAvgAccuracy, improving | 2 |
| **TOTAL** | | **33 métricas** |

---

## 🎨 Recomendaciones de UI

### Prioridad Alta (Mostrar Prominentemente):
1. **Racha de días** 🔥 - Motivación principal
2. **Preparación para examen** 🎓 - Objetivo principal
3. **Nivel y puntos** 💰 - Gamificación
4. **Precisión global** 🎯 - Indicador de progreso

### Prioridad Media (Sección dedicada):
5. **ZPD** 🎓 - Pedagogía avanzada
6. **FSRS Retención** 🧠 - Ciencia de aprendizaje
7. **Dominios fuertes/débiles** 📚 - Guía de estudio

### Prioridad Baja (Detalles/Expandibles):
8. **Logros** 🏆 - Gamificación secundaria
9. **Insights/Tendencias** 📈 - Analítica avanzada
10. **Tiempo/Velocidad** ⏱️ - Estadísticas complementarias

---

**Fecha**: ${new Date().toLocaleDateString()}
**Sistema**: ProfileScreen Metrics Guide
**Fase**: 1 Implementación Completa ✅
