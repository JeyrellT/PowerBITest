# 🎯 PLAN DE ACCIÓN: Sistema de Perfil y Engagement

## 📊 RESUMEN EJECUTIVO

### Situación Actual
- ✅ Sistema de puntuación balanceado (100 preguntas = 5,000 pts)
- ✅ 10 niveles progresivos (Novato → Divinidad)
- ⚠️ **PROBLEMA**: Datos no se calculan correctamente
  - `streakDays`, `quizzesTaken`, `questionsAnswered` = 0
  - ProfileScreen muestra 0s
  - Logros no se desbloquean
  - FSRS no se integra

### Objetivo
Crear un sistema de perfil completo, atractivo y funcional que:
1. ✅ **Calcule** todas las métricas correctamente
2. ✅ **Muestre** datos en tiempo real
3. ✅ **Motive** al usuario con logros y feedback
4. ✅ **Guíe** hacia la certificación PL-300

---

## 🚀 IMPLEMENTACIÓN POR FASES

### **FASE 1: FUNDAMENTOS** (Prioridad Alta) 🔴

#### 1.1 Agregar Función `recordQuizCompletion()`
**Ubicación:** `src/contexts/CxCProgressContext.js`

**Qué hace:**
- Registra cada quiz completado en `history`
- Actualiza `quizzesTaken`, `lastActivity`
- Calcula `streakDays` automáticamente
- Emite evento de telemetría

**Código:**
```javascript
const recordQuizCompletion = useCallback((quizData) => {
  applyProgressUpdate((prev) => {
    const newHistory = [
      ...(prev.history || []),
      {
        id: `quiz_${Date.now()}`,
        completedAt: new Date().toISOString(),
        score: quizData.score,
        questionsTotal: quizData.total,
        questionsCorrect: quizData.correct,
        timeSpent: quizData.timeSpent,
        domain: quizData.domain,
        level: quizData.level,
      }
    ];
    
    const newLastActivity = new Date().toISOString();
    const newStreak = calculateStreak(newHistory, newLastActivity);
    
    return {
      ...prev,
      history: newHistory,
      quizzesTaken: newHistory.length,
      lastActivity: newLastActivity,
      streakDays: newStreak,
      maxStreak: Math.max(prev.maxStreak || 0, newStreak),
      questionsAnswered: prev.answeredQuestions?.length || 0,
      correctAnswers: calculateCorrectAnswers(prev.questionTracking),
    };
  });
  
  telemetryService.emit('quiz_completed', { ...quizData, userId });
}, [applyProgressUpdate, userId]);
```

**Exportar:**
```javascript
// En value object
recordQuizCompletion,
```

**Usar en ResultsScreen:**
```javascript
// src/components/ResultsScreen.js
const { recordQuizCompletion } = useCxCProgress();

useEffect(() => {
  // Después de calcular resultados
  recordQuizCompletion({
    score: finalScore,
    total: results.length,
    correct: correctCount,
    timeSpent: totalTime,
    domain: config.domain,
    level: config.level,
  });
}, []);
```

---

#### 1.2 Implementar Funciones de Cálculo
**Ubicación:** `src/contexts/CxCProgressContext.js`

**Agregar dentro del Provider (antes de value):**

```javascript
// ═══════════════════════════════════════════════════════════════
// FUNCIONES HELPER DE CÁLCULO
// ═══════════════════════════════════════════════════════════════

const calculateStreak = (history, lastActivity) => {
  if (!history || history.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = lastActivity ? new Date(lastActivity) : null;
  if (!lastActive) return 0;
  
  lastActive.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1) return 0;
  
  let streak = 0;
  let currentDate = new Date(today);
  const activityByDay = {};
  
  history.forEach(entry => {
    const date = new Date(entry.completedAt);
    date.setHours(0, 0, 0, 0);
    activityByDay[date.toISOString().split('T')[0]] = true;
  });
  
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (!activityByDay[dateStr]) break;
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

const calculateCorrectAnswers = (questionTracking) => {
  if (!questionTracking) return 0;
  return Object.values(questionTracking).reduce((sum, q) => 
    sum + (q.correctAttempts || 0), 0
  );
};

const calculateAccuracy = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const total = Object.values(questionTracking).reduce((sum, q) => 
    sum + (q.totalAttempts || 0), 0
  );
  const correct = calculateCorrectAnswers(questionTracking);
  
  return total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;
};
```

---

#### 1.3 Mejorar `getStats()` con Métricas Completas
**Ubicación:** `src/contexts/CxCProgressContext.js`

**Reemplazar `getStats()` actual con:**

```javascript
const getStats = useCallback(() => {
  if (!progress) return null;
  
  const totalPoints = progress.totalPoints || 0;
  const levelInfo = calculateLevel(totalPoints);
  const accuracy = calculateAccuracy(progress.questionTracking);
  const questionsAnswered = progress.answeredQuestions?.length || 0;
  const correctAnswers = calculateCorrectAnswers(progress.questionTracking);
  
  return {
    // Básicas
    totalPoints,
    totalXP: progress.totalXP || 0,
    currentLevel: progress.currentLevel || 1,
    levelInfo,
    accuracy,
    
    // Preguntas
    questionsAnswered,
    correctAnswers,
    quizzesTaken: progress.history?.length || 0,
    perfectQuizzes: progress.history?.filter(q => q.score === 100).length || 0,
    
    // Racha
    streakDays: progress.streakDays || 0,
    maxStreak: progress.maxStreak || 0,
    lastActivity: progress.lastActivity,
    
    // Tiempo
    totalTimeSpent: Object.values(progress.questionTracking || {}).reduce(
      (sum, q) => sum + (q.totalTimeSpent || 0), 0
    ),
    avgTimePerQuestion: questionsAnswered > 0 
      ? Math.round(
          Object.values(progress.questionTracking || {}).reduce(
            (sum, q) => sum + (q.totalTimeSpent || 0), 0
          ) / questionsAnswered
        )
      : 0,
    
    // Dominios
    domainStats: progress.domainStats || {},
    levelStats: progress.levelStats || {},
    
    // Logros
    achievements: progress.achievements || [],
    
    // Historia
    history: progress.history || [],
    
    // FSRS
    retention: {
      average: calculateAvgRetention(progress.questionTracking),
      stability: calculateAvgStability(progress.questionTracking),
      dueForReview: countDueReviews(progress.questionTracking),
      masteredQuestions: countMastered(progress.questionTracking),
    },
    
    // Zona de Aprendizaje
    learningZone: {
      comfort: calculateComfortZone(progress.questionTracking),
      zpd: calculateZPD(progress.questionTracking),
      challenging: calculateChallenging(progress.questionTracking),
    },
    
    // Preparación para Examen
    examReadiness: {
      percentage: calculateExamReadiness(progress),
      questionsRemaining: 100 - questionsAnswered,
      estimatedDays: estimateDaysToReady(progress),
      confidence: determineConfidence(progress),
    },
  };
}, [progress]);
```

---

#### 1.4 Agregar Funciones FSRS
**Ubicación:** `src/contexts/CxCProgressContext.js`

```javascript
const calculateAvgRetention = (questionTracking) => {
  if (!questionTracking) return 0;
  const questions = Object.values(questionTracking);
  if (questions.length === 0) return 0;
  
  const totalRetention = questions.reduce((sum, q) => {
    const successRate = q.totalAttempts > 0 
      ? q.correctAttempts / q.totalAttempts 
      : 0;
    const stability = q.stability || 7;
    const daysSince = q.lastAttemptDate 
      ? Math.floor((Date.now() - new Date(q.lastAttemptDate)) / (1000 * 60 * 60 * 24))
      : 999;
    
    return sum + (successRate * Math.exp(-daysSince / stability));
  }, 0);
  
  return Math.round((totalRetention / questions.length) * 100);
};

const calculateAvgStability = (questionTracking) => {
  if (!questionTracking) return 0;
  const questions = Object.values(questionTracking);
  if (questions.length === 0) return 0;
  
  const total = questions.reduce((sum, q) => sum + (q.stability || 0), 0);
  return Math.round(total / questions.length);
};

const countDueReviews = (questionTracking) => {
  if (!questionTracking) return 0;
  const now = new Date();
  
  return Object.values(questionTracking).filter(q => {
    if (!q.nextReviewDate) return false;
    return new Date(q.nextReviewDate) <= now;
  }).length;
};

const countMastered = (questionTracking) => {
  if (!questionTracking) return 0;
  return Object.values(questionTracking).filter(q => 
    q.status === 'mastered' || q.confidenceLevel >= 4
  ).length;
};
```

---

#### 1.5 Agregar Funciones de ZPD
**Ubicación:** `src/contexts/CxCProgressContext.js`

```javascript
const calculateComfortZone = (questionTracking) => {
  if (!questionTracking) return 0;
  const total = Object.keys(questionTracking).length;
  if (total === 0) return 0;
  
  const comfortable = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    return (q.correctAttempts / q.totalAttempts) >= 0.9;
  }).length;
  
  return Math.round((comfortable / total) * 100);
};

const calculateZPD = (questionTracking) => {
  if (!questionTracking) return 0;
  const total = Object.keys(questionTracking).length;
  if (total === 0) return 0;
  
  const zpd = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    const accuracy = q.correctAttempts / q.totalAttempts;
    return accuracy >= 0.6 && accuracy < 0.9;
  }).length;
  
  return Math.round((zpd / total) * 100);
};

const calculateChallenging = (questionTracking) => {
  if (!questionTracking) return 0;
  const total = Object.keys(questionTracking).length;
  if (total === 0) return 0;
  
  const challenging = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    return (q.correctAttempts / q.totalAttempts) < 0.6;
  }).length;
  
  return Math.round((challenging / total) * 100);
};
```

---

#### 1.6 Agregar Funciones de Exam Readiness
**Ubicación:** `src/contexts/CxCProgressContext.js`

```javascript
const calculateExamReadiness = (progress) => {
  const questionsAnswered = progress.answeredQuestions?.length || 0;
  const accuracy = calculateAccuracy(progress.questionTracking);
  
  // Fórmula: 60% preguntas + 40% precisión
  const readiness = (
    (questionsAnswered / 100 * 0.6) +
    (accuracy / 100 * 0.4)
  ) * 100;
  
  return Math.min(100, Math.round(readiness));
};

const estimateDaysToReady = (progress) => {
  const questionsRemaining = 100 - (progress.answeredQuestions?.length || 0);
  const daysActive = progress.history?.length || 1;
  const totalQuestions = progress.answeredQuestions?.length || 0;
  const avgPerDay = totalQuestions / daysActive;
  
  if (avgPerDay === 0) return Math.ceil(questionsRemaining / 10);
  return Math.ceil(questionsRemaining / avgPerDay);
};

const determineConfidence = (progress) => {
  const readiness = calculateExamReadiness(progress);
  
  if (readiness >= 85) return { level: 'Alta', icon: '🌟', color: 'green' };
  if (readiness >= 70) return { level: 'Buena', icon: '✨', color: 'blue' };
  if (readiness >= 50) return { level: 'En desarrollo', icon: '📈', color: 'yellow' };
  return { level: 'Iniciando', icon: '🌱', color: 'gray' };
};
```

---

### **FASE 2: LOGROS EXPANDIDOS** (Prioridad Media) 🟡

#### 2.1 Expandir ACHIEVEMENT_TYPES
**Ubicación:** `src/contexts/CxCProgressContext.js`

**Reemplazar con:**
```javascript
export const ACHIEVEMENT_TYPES = {
  // Progreso (7)
  FIRST_QUIZ: { id: 'first_quiz', name: 'Primer Paso', icon: '🎯', points: 50, tier: 'bronze' },
  QUIZ_10: { id: 'quiz_10', name: 'Dedicado', icon: '💪', points: 100, tier: 'bronze' },
  QUIZ_25: { id: 'quiz_25', name: 'Comprometido', icon: '🎖️', points: 200, tier: 'silver' },
  QUIZ_50: { id: 'quiz_50', name: 'Veterano', icon: '⚔️', points: 400, tier: 'gold' },
  
  // Preguntas (3)
  QUESTIONS_50: { id: '50_questions', name: 'Medio Camino', icon: '🎓', points: 250, tier: 'silver' },
  HUNDRED_QUESTIONS: { id: '100_questions', name: 'Completista', icon: '💯', points: 500, tier: 'gold' },
  
  // Precisión (5)
  PERFECT_QUIZ: { id: 'perfect_quiz', name: 'Perfecto', icon: '💯', points: 200, tier: 'gold' },
  ACCURACY_75: { id: 'accuracy_75', name: 'Buena Puntería', icon: '🎯', points: 150, tier: 'bronze' },
  ACCURACY_85: { id: 'accuracy_85', name: 'Maestro Precisión', icon: '🎖️', points: 300, tier: 'silver' },
  ACCURACY_95: { id: 'accuracy_95', name: 'Elite', icon: '👑', points: 600, tier: 'gold' },
  
  // Velocidad (3)
  SPEED_DEMON: { id: 'speed_demon', name: 'Velocista', icon: '🚀', points: 150, tier: 'bronze' },
  DAILY_50: { id: 'daily_50', name: 'Maratón Diario', icon: '🏃', points: 400, tier: 'gold' },
  
  // Racha (4)
  STREAK_3: { id: 'streak_3', name: 'Inicio', icon: '🔥', points: 50, tier: 'bronze' },
  STREAK_7: { id: 'streak_7', name: 'Semana Perfecta', icon: '📅', points: 150, tier: 'silver' },
  STREAK_30: { id: 'streak_30', name: 'Mes de Dedicación', icon: '🗓️', points: 500, tier: 'gold' },
  
  // Dominio (2)
  MASTER_DOMAIN: { id: 'master_domain', name: 'Maestro del Dominio', icon: '👑', points: 300, tier: 'gold' },
  BALANCED: { id: 'balanced', name: 'Balanceado', icon: '⚖️', points: 400, tier: 'gold' },
};
```

---

#### 2.2 Mejorar `checkAchievements()`
**Ubicación:** `src/contexts/CxCProgressContext.js`

**Agregar más checks:**
```javascript
const checkAchievements = useCallback((updatedProgress) => {
  const newAchievements = [];
  const achievements = updatedProgress.achievements || [];
  
  // Progreso
  if (updatedProgress.quizzesTaken >= 1 && !achievements.includes('first_quiz')) {
    newAchievements.push(ACHIEVEMENT_TYPES.FIRST_QUIZ);
  }
  if (updatedProgress.quizzesTaken >= 10 && !achievements.includes('quiz_10')) {
    newAchievements.push(ACHIEVEMENT_TYPES.QUIZ_10);
  }
  if (updatedProgress.quizzesTaken >= 25 && !achievements.includes('quiz_25')) {
    newAchievements.push(ACHIEVEMENT_TYPES.QUIZ_25);
  }
  
  // Preguntas
  const questionsCount = updatedProgress.answeredQuestions?.length || 0;
  if (questionsCount >= 50 && !achievements.includes('50_questions')) {
    newAchievements.push(ACHIEVEMENT_TYPES.QUESTIONS_50);
  }
  if (questionsCount >= 100 && !achievements.includes('100_questions')) {
    newAchievements.push(ACHIEVEMENT_TYPES.HUNDRED_QUESTIONS);
  }
  
  // Precisión
  const accuracy = calculateAccuracy(updatedProgress.questionTracking);
  if (accuracy >= 75 && !achievements.includes('accuracy_75')) {
    newAchievements.push(ACHIEVEMENT_TYPES.ACCURACY_75);
  }
  if (accuracy >= 85 && !achievements.includes('accuracy_85')) {
    newAchievements.push(ACHIEVEMENT_TYPES.ACCURACY_85);
  }
  
  // Racha
  if (updatedProgress.streakDays >= 3 && !achievements.includes('streak_3')) {
    newAchievements.push(ACHIEVEMENT_TYPES.STREAK_3);
  }
  if (updatedProgress.streakDays >= 7 && !achievements.includes('streak_7')) {
    newAchievements.push(ACHIEVEMENT_TYPES.STREAK_7);
  }
  
  return newAchievements;
}, []);
```

---

### **FASE 3: UI/UX MEJORADO** (Prioridad Baja) 🟢

#### 3.1 Componente de Logro Desbloqueado
**Nuevo archivo:** `src/components/AchievementUnlocked.js`

```javascript
import React, { useEffect, useState } from 'react';
import './AchievementUnlocked.css';

const AchievementUnlocked = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className={`achievement-popup ${visible ? 'show' : ''}`}>
      <div className="achievement-content">
        <div className="achievement-icon">{achievement.icon}</div>
        <div className="achievement-title">¡Logro Desbloqueado!</div>
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-points">+{achievement.points} puntos</div>
      </div>
    </div>
  );
};

export default AchievementUnlocked;
```

#### 3.2 CSS para Logros
**Nuevo archivo:** `src/components/AchievementUnlocked.css`

```css
.achievement-popup {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  transform: translateX(400px);
  transition: transform 0.3s ease-out;
}

.achievement-popup.show {
  transform: translateX(0);
}

.achievement-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  color: white;
  min-width: 280px;
  text-align: center;
}

.achievement-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.achievement-title {
  font-size: 14px;
  opacity: 0.9;
  margin-bottom: 5px;
}

.achievement-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
}

.achievement-points {
  font-size: 16px;
  opacity: 0.8;
}
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Fundamentos (2-3 horas)
- [ ] Agregar `recordQuizCompletion()` a CxCProgressContext
- [ ] Implementar funciones de cálculo (streak, accuracy, etc.)
- [ ] Mejorar `getStats()` con todas las métricas
- [ ] Agregar funciones FSRS
- [ ] Agregar funciones ZPD
- [ ] Agregar funciones Exam Readiness
- [ ] Exportar todas las nuevas funciones
- [ ] Llamar `recordQuizCompletion()` desde ResultsScreen
- [ ] Probar que las métricas se calculan

### Fase 2: Logros (1-2 horas)
- [ ] Expandir ACHIEVEMENT_TYPES (25 logros)
- [ ] Mejorar `checkAchievements()`
- [ ] Probar que los logros se desbloquean

### Fase 3: UI/UX (2-3 horas)
- [ ] Crear AchievementUnlocked component
- [ ] Agregar CSS para animaciones
- [ ] Integrar en App.js
- [ ] Mejorar ProfileScreen tabs
- [ ] Agregar gráficas y visualizaciones

---

## 🎯 PRIORIDAD INMEDIATA

**HACER PRIMERO:**
1. ✅ Agregar `recordQuizCompletion()` 
2. ✅ Implementar funciones de cálculo básicas
3. ✅ Mejorar `getStats()`
4. ✅ Probar con un quiz real

**Resultado esperado:**
- ProfileScreen muestra datos reales
- Racha se calcula correctamente
- Precisión se muestra
- Preparación para examen funciona

---

**¿Comenzamos con la Fase 1?** 🚀
