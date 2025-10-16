# 🛠️ IMPLEMENTACIÓN DETALLADA: Sistema de Engagement

## 📋 PARTE 1: FUNCIONES DE CÁLCULO

### 1. Racha (Streak) y Actividad

```javascript
/**
 * Calcula la racha actual de días consecutivos
 * @param {Array} history - Historial de quizzes
 * @param {Date} lastActivity - Última actividad registrada
 * @returns {number} Días consecutivos
 */
const calculateStreak = (history, lastActivity) => {
  if (!history || history.length === 0) return 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActive = lastActivity ? new Date(lastActivity) : null;
  if (!lastActive) return 0;
  
  lastActive.setHours(0, 0, 0, 0);
  
  // Si última actividad no fue ayer ni hoy, racha rota
  const daysDiff = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
  if (daysDiff > 1) return 0;
  
  // Contar días consecutivos hacia atrás
  let streak = 0;
  let currentDate = new Date(today);
  
  // Agrupar history por día
  const activityByDay = {};
  history.forEach(entry => {
    const date = new Date(entry.completedAt);
    date.setHours(0, 0, 0, 0);
    const dateStr = date.toISOString().split('T')[0];
    activityByDay[dateStr] = true;
  });
  
  // Contar hacia atrás
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (!activityByDay[dateStr]) break;
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
};

/**
 * Calcula días totales activos
 */
const calculateDaysActive = (history) => {
  if (!history || history.length === 0) return 0;
  
  const uniqueDays = new Set();
  history.forEach(entry => {
    const date = new Date(entry.completedAt);
    uniqueDays.add(date.toISOString().split('T')[0]);
  });
  
  return uniqueDays.size;
};

/**
 * Promedio de preguntas por día
 */
const calculateAvgPerDay = (answeredQuestions, history) => {
  const daysActive = calculateDaysActive(history);
  if (daysActive === 0) return 0;
  return Math.round((answeredQuestions?.length || 0) / daysActive * 10) / 10;
};
```

### 2. Precisión y Correctas

```javascript
/**
 * Calcula total de respuestas correctas
 */
const calculateCorrectAnswers = (questionTracking) => {
  if (!questionTracking) return 0;
  
  return Object.values(questionTracking).reduce((sum, q) => {
    return sum + (q.correctAttempts || 0);
  }, 0);
};

/**
 * Calcula precisión global
 */
const calculateAccuracy = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const total = Object.values(questionTracking).reduce((sum, q) => {
    return sum + (q.totalAttempts || 0);
  }, 0);
  
  const correct = calculateCorrectAnswers(questionTracking);
  
  return total > 0 ? Math.round((correct / total) * 1000) / 10 : 0;
};
```

### 3. Tiempo y Velocidad

```javascript
/**
 * Calcula tiempo total de estudio
 */
const calculateTotalTime = (questionTracking) => {
  if (!questionTracking) return 0;
  
  return Object.values(questionTracking).reduce((sum, q) => {
    return sum + (q.totalTimeSpent || 0);
  }, 0);
};

/**
 * Tiempo promedio por pregunta
 */
const calculateAvgTime = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const totalTime = calculateTotalTime(questionTracking);
  const totalQuestions = Object.keys(questionTracking).length;
  
  return totalQuestions > 0 ? Math.round(totalTime / totalQuestions) : 0;
};

/**
 * Quiz más rápido
 */
const getFastestQuiz = (history) => {
  if (!history || history.length === 0) return null;
  
  return history.reduce((fastest, quiz) => {
    if (!fastest || quiz.timeSpent < fastest.timeSpent) {
      return quiz;
    }
    return fastest;
  }, null);
};

/**
 * Eficiencia de estudio (preguntas por hora)
 */
const calculateEfficiency = (questionTracking) => {
  const totalTime = calculateTotalTime(questionTracking);
  const totalQuestions = Object.keys(questionTracking).length;
  
  if (totalTime === 0) return 0;
  
  const hours = totalTime / 3600;
  return Math.round((totalQuestions / hours) * 10) / 10;
};
```

### 4. FSRS - Retención

```javascript
/**
 * Retención promedio (FSRS)
 */
const calculateAvgRetention = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const questions = Object.values(questionTracking);
  if (questions.length === 0) return 0;
  
  // R(t) = probabilidad de recordar
  // Basado en successRate y recency
  const totalRetention = questions.reduce((sum, q) => {
    const successRate = q.totalAttempts > 0 
      ? q.correctAttempts / q.totalAttempts 
      : 0;
    
    const daysSinceReview = q.lastAttemptDate 
      ? Math.floor((Date.now() - new Date(q.lastAttemptDate)) / (1000 * 60 * 60 * 24))
      : 999;
    
    // Decay exponencial: R = successRate * e^(-days/stability)
    const stability = q.stability || 7;
    const retention = successRate * Math.exp(-daysSinceReview / stability);
    
    return sum + retention;
  }, 0);
  
  return Math.round((totalRetention / questions.length) * 100);
};

/**
 * Estabilidad promedio (días)
 */
const calculateAvgStability = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const questions = Object.values(questionTracking);
  if (questions.length === 0) return 0;
  
  const totalStability = questions.reduce((sum, q) => {
    return sum + (q.stability || 0);
  }, 0);
  
  return Math.round(totalStability / questions.length);
};

/**
 * Preguntas que necesitan revisión
 */
const countDueReviews = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const now = new Date();
  
  return Object.values(questionTracking).filter(q => {
    if (!q.nextReviewDate) return false;
    return new Date(q.nextReviewDate) <= now;
  }).length;
};

/**
 * Preguntas dominadas
 */
const countMastered = (questionTracking) => {
  if (!questionTracking) return 0;
  
  return Object.values(questionTracking).filter(q => {
    return q.status === 'mastered' || q.confidenceLevel >= 4;
  }).length;
};
```

### 5. Zona de Aprendizaje (ZPD)

```javascript
/**
 * Zona de Confort (>90% accuracy)
 */
const calculateComfortZone = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const comfortable = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    const accuracy = q.correctAttempts / q.totalAttempts;
    return accuracy >= 0.9;
  });
  
  return Math.round((comfortable.length / Object.keys(questionTracking).length) * 100);
};

/**
 * Zona de Desarrollo Próximo (60-90%)
 */
const calculateZPD = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const zpd = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    const accuracy = q.correctAttempts / q.totalAttempts;
    return accuracy >= 0.6 && accuracy < 0.9;
  });
  
  return Math.round((zpd.length / Object.keys(questionTracking).length) * 100);
};

/**
 * Zona Desafiante (<60%)
 */
const calculateChallenging = (questionTracking) => {
  if (!questionTracking) return 0;
  
  const challenging = Object.values(questionTracking).filter(q => {
    if (q.totalAttempts === 0) return false;
    const accuracy = q.correctAttempts / q.totalAttempts;
    return accuracy < 0.6;
  });
  
  return Math.round((challenging.length / Object.keys(questionTracking).length) * 100);
};
```

### 6. Dominios

```javascript
/**
 * Mejora stats de dominios con accuracy
 */
const enhanceDomainStats = (domainStats, questionTracking) => {
  if (!domainStats) return {};
  
  const enhanced = {};
  
  Object.entries(domainStats).forEach(([domain, stats]) => {
    const domainQuestions = Object.values(questionTracking).filter(q => 
      q.domain === domain
    );
    
    const accuracy = stats.total > 0 
      ? Math.round((stats.correct / stats.total) * 100) 
      : 0;
    
    const mastered = domainQuestions.filter(q => 
      q.status === 'mastered'
    ).length;
    
    enhanced[domain] = {
      ...stats,
      accuracy,
      mastered,
      inProgress: domainQuestions.length - mastered,
      averageTime: stats.total > 0 
        ? Math.round(stats.timeSpent / stats.total)
        : 0,
    };
  });
  
  return enhanced;
};

/**
 * Cobertura de dominios
 */
const calculateDomainCoverage = (answeredQuestions) => {
  // Total 100 preguntas divididas en 4 dominios
  const TOTAL_PER_DOMAIN = {
    'preparar-datos': 20,
    'modelar-datos': 12,
    'visualizar-analizar': 12,
    'administrar-asegurar': 56,
  };
  
  // Contar por dominio (necesitarías metadata de las preguntas)
  // Por ahora, distribución aproximada
  const coverage = {
    'preparar-datos': 0,
    'modelar-datos': 0,
    'visualizar-analizar': 0,
    'administrar-asegurar': 0,
  };
  
  // Distribución aproximada basada en porcentajes
  const totalAnswered = answeredQuestions?.length || 0;
  coverage['preparar-datos'] = Math.round((totalAnswered * 0.20) / TOTAL_PER_DOMAIN['preparar-datos'] * 100);
  coverage['modelar-datos'] = Math.round((totalAnswered * 0.12) / TOTAL_PER_DOMAIN['modelar-datos'] * 100);
  coverage['visualizar-analizar'] = Math.round((totalAnswered * 0.12) / TOTAL_PER_DOMAIN['visualizar-analizar'] * 100);
  coverage['administrar-asegurar'] = Math.round((totalAnswered * 0.56) / TOTAL_PER_DOMAIN['administrar-asegurar'] * 100);
  
  return coverage;
};
```

### 7. Preparación para Examen

```javascript
/**
 * Calcula % de preparación para examen
 */
const calculateExamReadiness = (progress) => {
  const questionsAnswered = progress.answeredQuestions?.length || 0;
  const accuracy = calculateAccuracy(progress.questionTracking);
  const domainCoverage = calculateDomainCoverage(progress.answeredQuestions);
  
  // Cobertura promedio de dominios
  const avgCoverage = Object.values(domainCoverage).reduce((sum, c) => sum + c, 0) / 4;
  
  // Fórmula ponderada:
  // 50% preguntas respondidas
  // 30% precisión
  // 20% cobertura de dominios
  const readiness = (
    (questionsAnswered / 100 * 0.5) +
    (accuracy / 100 * 0.3) +
    (avgCoverage / 100 * 0.2)
  ) * 100;
  
  return Math.min(100, Math.round(readiness));
};

/**
 * Estima días para estar listo
 */
const estimateDaysToReady = (progress) => {
  const questionsRemaining = 100 - (progress.answeredQuestions?.length || 0);
  const avgPerDay = calculateAvgPerDay(progress.answeredQuestions, progress.history);
  
  if (avgPerDay === 0) {
    // Si no hay historial, estimar 10 preguntas por día
    return Math.ceil(questionsRemaining / 10);
  }
  
  return Math.ceil(questionsRemaining / avgPerDay);
};

/**
 * Determina nivel de confianza
 */
const determineConfidence = (progress) => {
  const readiness = calculateExamReadiness(progress);
  
  if (readiness >= 85) return { level: 'Alta', icon: '🌟', color: 'green' };
  if (readiness >= 70) return { level: 'Buena', icon: '✨', color: 'blue' };
  if (readiness >= 50) return { level: 'En desarrollo', icon: '📈', color: 'yellow' };
  return { level: 'Iniciando', icon: '🌱', color: 'gray' };
};
```

### 8. Insights Personalizados

```javascript
/**
 * Analiza patrón de estudio
 */
const analyzeStudyPattern = (history) => {
  if (!history || history.length < 3) {
    return { pattern: 'Insuficiente data', recommendation: 'Completa más quizzes' };
  }
  
  const last7 = history.slice(-7);
  const consistency = calculateConsistency(last7);
  
  if (consistency > 0.8) {
    return { 
      pattern: 'Muy consistente', 
      recommendation: 'Excelente ritmo, sigue así!' 
    };
  }
  
  if (consistency > 0.5) {
    return { 
      pattern: 'Moderadamente consistente', 
      recommendation: 'Intenta estudiar diariamente' 
    };
  }
  
  return { 
    pattern: 'Irregular', 
    recommendation: 'Establece un horario fijo de estudio' 
  };
};

/**
 * Encuentra mejor hora del día
 */
const findBestTimeOfDay = (history) => {
  if (!history || history.length === 0) return null;
  
  const timeSlots = { morning: 0, afternoon: 0, evening: 0, night: 0 };
  const performance = { morning: [], afternoon: [], evening: [], night: [] };
  
  history.forEach(entry => {
    const hour = new Date(entry.completedAt).getHours();
    const slot = 
      hour < 12 ? 'morning' :
      hour < 17 ? 'afternoon' :
      hour < 21 ? 'evening' : 'night';
    
    timeSlots[slot]++;
    performance[slot].push(entry.score);
  });
  
  // Encontrar slot con mejor promedio
  let bestSlot = null;
  let bestScore = 0;
  
  Object.entries(performance).forEach(([slot, scores]) => {
    if (scores.length > 0) {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg > bestScore) {
        bestScore = avg;
        bestSlot = slot;
      }
    }
  });
  
  const slotNames = {
    morning: '🌅 Mañana (6am-12pm)',
    afternoon: '☀️ Tarde (12pm-5pm)',
    evening: '🌆 Noche (5pm-9pm)',
    night: '🌙 Madrugada (9pm-6am)',
  };
  
  return bestSlot ? {
    slot: slotNames[bestSlot],
    avgScore: Math.round(bestScore),
    count: timeSlots[bestSlot],
  } : null;
};

/**
 * Recomienda próximo foco
 */
const recommendNextFocus = (progress) => {
  const domainStats = progress.domainStats || {};
  
  // Encontrar dominio más débil
  let weakest = null;
  let lowestAccuracy = 100;
  
  Object.entries(domainStats).forEach(([domain, stats]) => {
    if (stats.total === 0) {
      return { domain, reason: 'Sin data' };
    }
    
    const accuracy = (stats.correct / stats.total) * 100;
    if (accuracy < lowestAccuracy) {
      lowestAccuracy = accuracy;
      weakest = domain;
    }
  });
  
  if (!weakest) {
    return { domain: 'all', reason: 'Balanceado' };
  }
  
  const domainNames = {
    'preparar-datos': 'Preparar Datos',
    'modelar-datos': 'Modelar Datos',
    'visualizar-analizar': 'Visualizar y Analizar',
    'administrar-asegurar': 'Administrar y Asegurar',
  };
  
  return {
    domain: weakest,
    name: domainNames[weakest],
    accuracy: Math.round(lowestAccuracy),
    reason: `Tu precisión más baja (${Math.round(lowestAccuracy)}%)`,
  };
};

/**
 * Evalúa riesgo de racha
 */
const assessStreakRisk = (lastActivity) => {
  if (!lastActivity) return { risk: 'high', message: '🚨 ¡Comienza hoy!' };
  
  const hoursSince = (Date.now() - new Date(lastActivity)) / (1000 * 60 * 60);
  
  if (hoursSince < 12) return { risk: 'none', message: '✅ Racha activa' };
  if (hoursSince < 20) return { risk: 'low', message: '⚠️ Estudia pronto' };
  if (hoursSince < 24) return { risk: 'medium', message: '⏰ ¡Última oportunidad hoy!' };
  return { risk: 'high', message: '🔥 Racha en riesgo' };
};

/**
 * Genera mensaje motivacional
 */
const generateMotivation = (progress) => {
  const readiness = calculateExamReadiness(progress);
  const streak = progress.streakDays || 0;
  
  if (readiness >= 85) {
    return '🎉 ¡Estás listo para el examen! Mantén el enfoque.';
  }
  
  if (streak >= 7) {
    return `🔥 ¡${streak} días de racha! Eres imparable.`;
  }
  
  if (progress.questionsAnswered >= 50) {
    return '💪 ¡Vas a la mitad! El esfuerzo vale la pena.';
  }
  
  return '🌱 Cada pregunta te acerca más a tu meta.';
};
```

---

## 📋 PARTE 2: ACTUALIZAR CxCProgressContext

### Funciones a Agregar

```javascript
// En CxCProgressContext.js

/**
 * Registra completación de quiz
 */
const recordQuizCompletion = useCallback((quizData) => {
  applyProgressUpdate((prev) => {
    const newHistory = [
      ...(prev.history || []),
      {
        id: generateId('quiz'),
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
    };
  });
  
  telemetryService.emit('quiz_completed', { ...quizData, userId });
}, [applyProgressUpdate, userId]);
```

Continuaré en el siguiente archivo...
