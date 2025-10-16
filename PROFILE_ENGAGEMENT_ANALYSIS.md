# 🎯 ANÁLISIS PROFUNDO: Sistema de Perfil, Puntuación y Engagement

## 📊 ESTADO ACTUAL DEL SISTEMA

### Componentes Identificados

#### 1. **CxCProgressContext** (Single Source of Truth)
**Ubicación:** `src/contexts/CxCProgressContext.js`

**Estado Actual:**
```javascript
{
  // Puntos y Niveles
  totalPoints: 0,        // Puntos para progresión (max ~5,000)
  totalXP: 0,            // XP separado para logros
  currentLevel: 1,       // Nivel 1-10 (Novato → Divinidad)
  
  // Tracking de Preguntas
  answeredQuestions: [], // IDs de preguntas respondidas
  questionTracking: {},  // Tracking detallado por pregunta (FSRS)
  
  // Estadísticas
  questionsAnswered: 0,  // Total respondidas
  correctAnswers: 0,     // Total correctas
  quizzesTaken: 0,       // Quizzes completados
  
  // Dominio y Niveles
  domainStats: {},       // Stats por dominio (preparar-datos, modelar-datos, etc.)
  levelStats: {},        // Stats por nivel (principiante, intermedio, avanzado)
  
  // Gamificación
  achievements: [],      // IDs de logros desbloqueados
  badges: [],           // Badges ganados
  streakDays: 0,        // Días consecutivos estudiando
  maxStreak: 0,         // Récord de racha
  lastActivity: null,   // Última actividad
  
  // Historia
  history: [],          // Array de quizzes completados
  
  // CxC Legacy (compatibilidad)
  missions: {},
  currentAct: 0,
  points: {
    total: 0,
    available: 0,
    spentOnHelps: 0,
    currentRank: 'Bronce'
  }
}
```

**Constantes:**
- `ACHIEVEMENT_TYPES`: 8 logros básicos
- `LEVEL_THRESHOLDS`: 10 niveles balanceados (0 → 5000 puntos)
- `QUESTION_STATUS`: new, learning, reviewing, mastered, retired
- `CONFIDENCE_LEVELS`: 0-5
- `MASTERY_CONFIG`: Configuración de dominio

#### 2. **QuestionScorer** (Sistema de Puntuación)
**Ubicación:** `src/utils/questionScorer.js`

**Puntos Base:**
- Principiante: 15 pts (22 preguntas × 15 = 330 pts base)
- Intermedio: 25 pts (25 preguntas × 25 = 625 pts base)
- Avanzado: 40 pts (53 preguntas × 40 = 2,120 pts base)
- **Total base: 3,075 pts** | **Con bonos: ~5,000 pts**

**Multiplicadores:**
- Velocidad: 0.8x - 1.3x
- Bonos: Racha (5-100 pts), Primera vez (10 pts), Maestría (25 pts)

#### 3. **ProfileScreen** (Visualización)
**Ubicación:** `src/components/ProfileScreen.js`

**Tabs Actuales:**
- Overview: Resumen general
- Analytics: Análisis de tendencias
- Achievements: Logros desbloqueados
- History: Historial de quizzes
- Domains: Rendimiento por dominio

#### 4. **FSRS Scheduler** (Repetición Espaciada)
**Ubicación:** `src/utils/fsrsScheduler.js`

**Métricas:**
- Difficulty: 1-10 (complejidad inherente)
- Stability: Días hasta 90% retención
- Retrievability: Probabilidad de recordar
- States: New, Learning, Review, Relearning

---

## 🎮 ANÁLISIS DE ENGAGEMENT

### Elementos de las Imágenes

#### **Imagen 1: Vista de Perfil Principal**
```
┌─────────────────────────────────────────────┐
│ Nivel: Novato 🌱                           │
│ Próximo nivel: Aprendiz 📚                 │
│ 500 XP restantes                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (barra)      │
├─────────────────────────────────────────────┤
│ 📝 0 Preguntas    🎯 0.0% Precisión        │
│ 🔥 0 Racha        🏆 0 Logros              │
├─────────────────────────────────────────────┤
│ 🧠 Retención de Conocimiento (FSRS)        │
│    0% retención promedio                    │
│    0 días estabilidad                       │
│    0 Para review                            │
│    ⚠️ Necesita más práctica                │
├─────────────────────────────────────────────┤
│ 🎯 Zona de Aprendizaje (ZPD)               │
│    🟢 Confort (0%)                         │
│    🔵 ZPD Óptima (0%)                      │
│    🔴 Desafiante (0%)                      │
│    💡 Refuerza fundamentos antes avanzar   │
├─────────────────────────────────────────────┤
│ ⚡ Eficiencia de Estudio                   │
│    ⏱️  0 min Tiempo total                  │
│    📊 0s Por pregunta                       │
│    🚀 0 Por hora                           │
│    ✏️ Eficiencia moderada                  │
├─────────────────────────────────────────────┤
│ 🎓 Preparación para Examen                 │
│    0% preparación (0/100 preguntas)        │
│    En progreso...                           │
│    Necesitas 77 preguntas más              │
│    Estimado: 8 días                         │
│    📝 Empieza el día 1                     │
│    Confianza: En desarrollo ✨             │
└─────────────────────────────────────────────┘
```

#### **Imagen 2: Resumen General**
- ✅ Puntos Fuertes: "¡Sigue practicando para desarrollar fortalezas!"
- ⚠️ Áreas de Mejora: "¡Excelente! No hay áreas críticas"

#### **Imagen 3: Logros**
```
🏆 Logros Desbloqueados (0/7):
- 🎯 Primer Paso: Completa tu primer quiz (+50 XP)
- 🔥 Constancia: Mantén racha de 5 días (+100 XP)
- ⚡ Dedicación: Mantén racha de 10 días (+250 XP)
- 🏃 Centurión: Responde 100 preguntas (+500 XP)
- 💯 Maestro Precisión: 85% precisión (+300 XP)
- ⭐ Profesional: Nivel 5 (+200 XP)
- 🚀 Velocista: 50 preguntas en un día (+150 XP)
```

#### **Imagen 4: Tabs**
- 📊 Resumen
- 🏆 Logros
- 📚 Dominios
- 💡 Insights (NUEVO badge)

#### **Imagen 5: Insights Personalizados**
```
🎯 Tu Trayectoria de Aprendizaje
   AHORA: 0% → OBJETIVO: 85%+
   Basado en ritmo actual: listo en ~8 días

📝 Optimización de Estudio
   🔥 Practica hoy para iniciar racha

🧠 Salud del Conocimiento (FSRS)
   Tu retención promedio: 0%
   Las preguntas se mantienen estables en memoria por 0 días en promedio
```

---

## 💡 PROBLEMAS IDENTIFICADOS

### 1. **Datos No Calculados**
- ❌ `streakDays` no se actualiza
- ❌ `questionsAnswered` no se incrementa
- ❌ `correctAnswers` no se suma
- ❌ `quizzesTaken` siempre 0
- ❌ `history` no se llena
- ❌ Métricas FSRS no se calculan

### 2. **Logros Limitados**
Actualmente solo 8 logros básicos. Necesitamos:
- ✅ Más variedad (velocidad, precisión, dominio, tiempo)
- ✅ Logros progresivos (bronce, plata, oro)
- ✅ Logros secretos/sorpresa
- ✅ Logros sociales/competitivos

### 3. **Falta de Feedback Inmediato**
- ❌ No hay celebraciones visuales al subir de nivel
- ❌ No hay notificaciones de logros desbloqueados
- ❌ No hay comparación con otros usuarios

### 4. **Métricas FSRS No Integradas**
- ❌ `questionTracking` tiene datos FSRS pero no se muestran
- ❌ Falta dashboard de retención
- ❌ No hay alertas de preguntas "en riesgo"

### 5. **Insights Genéricos**
- ❌ Recomendaciones no personalizadas
- ❌ No predice fecha de examen realista
- ❌ No identifica patrones de estudio

---

## 🚀 DISEÑO MEJORADO: SISTEMA INTEGRAL

### A. **Ampliación de Logros (25+ Achievements)**

#### **Categoría: Progreso** (7 logros)
```javascript
ACHIEVEMENT_TYPES_ENHANCED = {
  // Básicos
  FIRST_QUIZ: { id: 'first_quiz', name: 'Primer Paso', icon: '🎯', points: 50, tier: 'bronze' },
  QUIZ_10: { id: 'quiz_10', name: 'Dedicado', icon: '💪', points: 100, tier: 'bronze' },
  QUIZ_25: { id: 'quiz_25', name: 'Comprometido', icon: '🎖️', points: 200, tier: 'silver' },
  QUIZ_50: { id: 'quiz_50', name: 'Veterano', icon: '⚔️', points: 400, tier: 'gold' },
  QUIZ_100: { id: 'quiz_100', name: 'Centurión', icon: '🏛️', points: 1000, tier: 'platinum' },
  
  // Preguntas
  QUESTIONS_50: { id: '50_questions', name: 'Medio Camino', icon: '🎓', points: 250, tier: 'silver' },
  HUNDRED_QUESTIONS: { id: '100_questions', name: 'Completista', icon: '💯', points: 500, tier: 'gold' },
}
```

#### **Categoría: Precisión** (6 logros)
```javascript
{
  PERFECT_QUIZ: { id: 'perfect_quiz', name: 'Perfecto', icon: '💯', points: 200, tier: 'gold' },
  PERFECT_3: { id: 'perfect_3', name: 'Triple Perfecto', icon: '🎯🎯🎯', points: 600, tier: 'platinum' },
  ACCURACY_75: { id: 'accuracy_75', name: 'Buena Puntería', icon: '🎯', points: 150, tier: 'bronze' },
  ACCURACY_85: { id: 'accuracy_85', name: 'Maestro Precisión', icon: '🎖️', points: 300, tier: 'silver' },
  ACCURACY_95: { id: 'accuracy_95', name: 'Elite', icon: '👑', points: 600, tier: 'gold' },
  NO_MISTAKES_STREAK: { id: 'no_mistakes_10', name: 'Inmaculado', icon: '✨', points: 400, tier: 'platinum' },
}
```

#### **Categoría: Velocidad** (5 logros)
```javascript
{
  SPEED_DEMON: { id: 'speed_demon', name: 'Velocista', icon: '🚀', points: 150, tier: 'bronze' },
  LIGHTNING_FAST: { id: 'lightning_10s', name: 'Rayo', icon: '⚡', points: 250, tier: 'silver' },
  QUIZ_UNDER_5MIN: { id: 'quiz_5min', name: 'Speedrun', icon: '⏱️', points: 300, tier: 'gold' },
  DAILY_50: { id: 'daily_50', name: 'Maratón Diario', icon: '🏃', points: 400, tier: 'gold' },
  HOURLY_20: { id: 'hourly_20', name: 'Turbo', icon: '💨', points: 200, tier: 'silver' },
}
```

#### **Categoría: Racha** (4 logros)
```javascript
{
  STREAK_3: { id: 'streak_3', name: 'Inicio', icon: '🔥', points: 50, tier: 'bronze' },
  STREAK_7: { id: 'streak_7', name: 'Semana Perfecta', icon: '📅', points: 150, tier: 'silver' },
  STREAK_30: { id: 'streak_30', name: 'Mes de Dedicación', icon: '🗓️', points: 500, tier: 'gold' },
  COMEBACK: { id: 'comeback', name: 'Regreso Triunfal', icon: '🎆', points: 100, tier: 'special' },
}
```

#### **Categoría: Dominio** (4 logros)
```javascript
{
  MASTER_DOMAIN: { id: 'master_domain', name: 'Maestro del Dominio', icon: '👑', points: 300, tier: 'gold' },
  ALL_DOMAINS_50: { id: 'balanced', name: 'Balanceado', icon: '⚖️', points: 400, tier: 'gold' },
  SPECIALIST: { id: 'specialist', name: 'Especialista', icon: '🔬', points: 250, tier: 'silver' },
  POLYMATH: { id: 'polymath', name: 'Polímata', icon: '🎭', points: 600, tier: 'platinum' },
}
```

---

### B. **Sistema de Estadísticas Expandido**

```javascript
// En CxCProgressContext - getStats() mejorado
const getStatsEnhanced = () => {
  return {
    // ═══════════════════════════════════════════════════════════════
    // 1. MÉTRICAS BÁSICAS
    // ═══════════════════════════════════════════════════════════════
    totalPoints: progress.totalPoints || 0,
    totalXP: progress.totalXP || 0,
    currentLevel: progress.currentLevel || 1,
    levelInfo: calculateLevel(progress.totalPoints),
    
    // ═══════════════════════════════════════════════════════════════
    // 2. PREGUNTAS Y QUIZZES
    // ═══════════════════════════════════════════════════════════════
    questionsAnswered: progress.answeredQuestions?.length || 0,
    correctAnswers: calculateCorrectAnswers(progress.questionTracking),
    accuracy: calculateAccuracy(progress.questionTracking),
    quizzesTaken: progress.history?.length || 0,
    perfectQuizzes: progress.history?.filter(q => q.score === 100).length || 0,
    
    // ═══════════════════════════════════════════════════════════════
    // 3. RACHA Y ACTIVIDAD
    // ═══════════════════════════════════════════════════════════════
    streakDays: calculateStreak(progress.history, progress.lastActivity),
    maxStreak: progress.maxStreak || 0,
    lastActivity: progress.lastActivity,
    daysActive: calculateDaysActive(progress.history),
    avgQuestionsPerDay: calculateAvgPerDay(progress.answeredQuestions, progress.history),
    
    // ═══════════════════════════════════════════════════════════════
    // 4. VELOCIDAD Y TIEMPO
    // ═══════════════════════════════════════════════════════════════
    totalTimeSpent: calculateTotalTime(progress.questionTracking),
    avgTimePerQuestion: calculateAvgTime(progress.questionTracking),
    fastestQuiz: getFastestQuiz(progress.history),
    slowestQuiz: getSlowestQuiz(progress.history),
    studyEfficiency: calculateEfficiency(progress.questionTracking),
    
    // ═══════════════════════════════════════════════════════════════
    // 5. RETENCIÓN (FSRS)
    // ═══════════════════════════════════════════════════════════════
    retention: {
      average: calculateAvgRetention(progress.questionTracking),
      stability: calculateAvgStability(progress.questionTracking),
      dueForReview: countDueReviews(progress.questionTracking),
      masteredQuestions: countMastered(progress.questionTracking),
      learningQuestions: countLearning(progress.questionTracking),
    },
    
    // ═══════════════════════════════════════════════════════════════
    // 6. ZONA DE APRENDIZAJE (ZPD)
    // ═══════════════════════════════════════════════════════════════
    learningZone: {
      comfort: calculateComfortZone(progress.questionTracking),      // >90% accuracy
      zpd: calculateZPD(progress.questionTracking),                  // 60-90% accuracy
      challenging: calculateChallenging(progress.questionTracking),  // <60% accuracy
    },
    
    // ═══════════════════════════════════════════════════════════════
    // 7. DOMINIOS
    // ═══════════════════════════════════════════════════════════════
    domainStats: enhanceDomainStats(progress.domainStats, progress.questionTracking),
    strongestDomain: findStrongestDomain(progress.domainStats),
    weakestDomain: findWeakestDomain(progress.domainStats),
    domainCoverage: calculateDomainCoverage(progress.answeredQuestions),
    
    // ═══════════════════════════════════════════════════════════════
    // 8. LOGROS
    // ═══════════════════════════════════════════════════════════════
    achievements: progress.achievements || [],
    unlockedAchievements: progress.achievements?.length || 0,
    totalAchievements: Object.keys(ACHIEVEMENT_TYPES_ENHANCED).length,
    achievementProgress: calculateAchievementProgress(progress),
    nextAchievement: findNextAchievement(progress),
    
    // ═══════════════════════════════════════════════════════════════
    // 9. PREPARACIÓN PARA EXAMEN
    // ═══════════════════════════════════════════════════════════════
    examReadiness: {
      percentage: calculateExamReadiness(progress),
      questionsCompleted: progress.answeredQuestions?.length || 0,
      questionsRemaining: 100 - (progress.answeredQuestions?.length || 0),
      avgAccuracy: calculateAccuracy(progress.questionTracking),
      domainCoverage: calculateDomainCoverage(progress.answeredQuestions),
      estimatedDaysToReady: estimateDaysToReady(progress),
      confidence: determineConfidence(progress),
    },
    
    // ═══════════════════════════════════════════════════════════════
    // 10. INSIGHTS PERSONALIZADOS
    // ═══════════════════════════════════════════════════════════════
    insights: {
      studyPattern: analyzeStudyPattern(progress.history),
      bestTimeOfDay: findBestTimeOfDay(progress.history),
      recommendedFocus: recommendNextFocus(progress),
      streakRisk: assessStreakRisk(progress.lastActivity),
      motivationalMessage: generateMotivation(progress),
    },
    
    // ═══════════════════════════════════════════════════════════════
    // 11. TENDENCIAS
    // ═══════════════════════════════════════════════════════════════
    trends: {
      last7Days: analyzeLast7Days(progress.history),
      last30Days: analyzeLast30Days(progress.history),
      improvement: calculateImprovement(progress.history),
      consistency: calculateConsistency(progress.history),
    },
    
    // Historia
    history: progress.history || [],
  };
};
```

---

### C. **Funciones de Cálculo (Implementación)**

Continuaré con el diseño detallado de cada función en el siguiente mensaje...

