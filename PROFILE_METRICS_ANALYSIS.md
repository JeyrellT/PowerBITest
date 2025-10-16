# 📊 Análisis Completo de Métricas del ProfileScreen

## 🔍 Métricas Mostradas en las Imágenes

### Vista Principal (Imagen 1)

| Métrica | Ubicación | Valor Esperado | Campo en `stats` | Estado |
|---------|-----------|----------------|------------------|--------|
| **XP Restantes** | Barra superior | "500 XP restantes" | `levelInfo.xpToNext` | ⚠️ No existe |
| **Próximo Nivel** | Barra superior | "Aprendiz 📚" | `levelInfo.nextLevel` | ⚠️ No existe |
| **Preguntas Respondidas** | Card 1 | "0 / 100" | `questionsAnswered` + total(100) | ⚠️ Parcial |
| **Precisión** | Card 2 | "0.0%" | `accuracy` | ✅ Existe |
| **Racha** | Card 3 | "0 Record: 0" | `streakDays` + `maxStreak` | ❌ No existe |
| **Logros** | Card 4 | "0 Desbloqueados" | `achievements.length` | ✅ Existe |

#### Retención de Conocimiento (FSRS)
| Métrica | Campo | Estado |
|---------|-------|--------|
| Retención promedio | `retention.average` | ❌ No existe |
| Días de estabilidad | `retention.stability` | ❌ No existe |
| Para review | `retention.dueForReview` | ❌ No existe |

#### Zona de Aprendizaje
| Métrica | Campo | Estado |
|---------|-------|--------|
| Confort (0%) | `learningZone.comfort` | ❌ No existe |
| ZPD Óptima (0%) | `learningZone.zpd` | ❌ No existe |
| Desafiante (0%) | `learningZone.challenging` | ❌ No existe |

#### Eficiencia de Estudio
| Métrica | Campo | Estado |
|---------|-------|--------|
| Tiempo total | `totalTimeSpent` | ⚠️ Existe en progress |
| Por pregunta | `avgTimePerQuestion` | ✅ Calculado |
| Por hora | `questionsPerHour` | ❌ No existe |

#### Preparación para Examen
| Métrica | Campo | Estado |
|---------|-------|--------|
| % Preparación | `examReadiness.percentage` | ❌ No existe |
| Preguntas faltantes | `examReadiness.questionsNeeded` | ❌ No existe |
| Días estimados | `examReadiness.daysEstimated` | ❌ No existe |
| Confianza | `examReadiness.confidence` | ❌ No existe |

---

### Tab: Resumen General (Imagen 2)

| Sección | Contenido | Campo | Estado |
|---------|-----------|-------|--------|
| **Puntos Fuertes** | Dominios con >75% precisión | `strongDomains[]` | ❌ No existe |
| **Áreas de Mejora** | Dominios con <60% precisión | `weakDomains[]` | ❌ No existe |

---

### Tab: Logros (Imagen 3)

Muestra 7 logros diferentes de los que están en ACHIEVEMENT_TYPES:

| Logro Mostrado | ID Esperado | En ACHIEVEMENT_TYPES | Estado |
|----------------|-------------|----------------------|--------|
| Primer Paso +50 XP | `first_quiz` | ✅ `first_quiz` | ✅ Existe |
| Constancia +100 XP | `week_warrior` | ✅ `week_warrior` | ✅ Existe |
| Dedicación +250 XP | ??? | ❌ No existe | ❌ Falta crear |
| Centurión +500 XP | `hundred_questions` | ✅ `100_questions` | ✅ Existe |
| Maestro Precisión +300 XP | ??? | ❌ No existe | ❌ Falta crear |
| Profesional +200 XP | ??? | ❌ No existe | ❌ Falta crear |
| Velocista +150 XP | `speed_demon` | ✅ `speed_demon` | ✅ Existe |

---

### Tab: Dominios (Imagen 4)

| Métrica | Campo | Estado |
|---------|-------|--------|
| Rendimiento por dominio | `domainStats` | ✅ Existe |
| Precisión por dominio | `domainStats[domain].accuracy` | ⚠️ Debe calcularse |
| Gráficos de radar | Componente visual | ✅ Existe en UI |

---

### Tab: Insights (Imagen 5)

#### Tu Trayectoria de Aprendizaje
| Métrica | Campo | Estado |
|---------|-------|--------|
| Precisión actual | `accuracy` | ✅ Existe |
| Objetivo (85%+) | Constante | ✅ Hardcoded |
| Días estimados | `insights.daysToGoal` | ❌ No existe |

#### Optimización de Estudio
| Métrica | Campo | Estado |
|---------|-------|--------|
| Recomendación de racha | `insights.streakRecommendation` | ❌ No existe |

#### Salud del Conocimiento (FSRS)
| Métrica | Campo | Estado |
|---------|-------|--------|
| Retención promedio | `fsrs.retention` | ❌ No existe |
| Días estables | `fsrs.stableDays` | ❌ No existe |

---

## 📋 Campos que EXISTEN en `progress`

```javascript
{
  // ✅ Puntos y niveles
  totalPoints: 0,
  totalXP: 0,
  currentLevel: 1,
  
  // ✅ Preguntas
  answeredQuestions: [],
  questionTracking: {},
  
  // ✅ Estadísticas
  domainStats: {},
  levelStats: {},
  
  // ✅ Logros
  achievements: [],
  badges: [],
  
  // ✅ Historial
  history: [],
  
  // ✅ Misiones (CxC)
  missions: {},
  currentAct: 0,
  
  // ✅ Puntos (legacy)
  points: { total, available, spentOnHelps, currentRank }
}
```

---

## ❌ Campos que FALTAN y Necesitan Calcularse

### 1. Estadísticas Básicas Faltantes

```javascript
{
  // ❌ Falta en progress
  questionsAnswered: 0,      // Debe ser answeredQuestions.length
  correctAnswers: 0,         // Debe calcularse de questionTracking
  quizzesTaken: 0,           // Debe ser history.length
  bestScore: 0,              // Debe calcularse del history
  totalTimeSpent: 0,         // Suma de tiempos de questionTracking
  fastestQuiz: null,         // Mínimo de history[].timeSpent
  
  // ❌ Racha
  streakDays: 0,             // Días consecutivos con actividad
  maxStreak: 0,              // Récord de racha más larga
  lastActivity: null,        // Fecha de última actividad
}
```

### 2. Métricas Avanzadas (Nuevas)

```javascript
{
  // ❌ FSRS - Retención de Conocimiento
  retention: {
    average: 0,              // % promedio de retención
    stability: 0,            // Días promedio de estabilidad
    dueForReview: 0,         // Preguntas que necesitan review
    lastReview: null         // Fecha de último review
  },
  
  // ❌ Zona de Aprendizaje
  learningZone: {
    comfort: 0,              // % preguntas muy fáciles (>90% precisión)
    zpd: 0,                  // % preguntas en ZPD (60-90% precisión)
    challenging: 0           // % preguntas difíciles (<60% precisión)
  },
  
  // ❌ Eficiencia de Estudio
  studyEfficiency: {
    questionsPerHour: 0,     // Preguntas respondidas por hora
    optimalTime: null,       // Hora del día con mejor rendimiento
    sessionLength: 0         // Duración promedio de sesión
  },
  
  // ❌ Preparación para Examen
  examReadiness: {
    percentage: 0,           // % de preparación (0-100)
    questionsNeeded: 77,     // Preguntas faltantes para 85%
    daysEstimated: 8,        // Días estimados para estar listo
    confidence: 'En desarrollo' // Nivel de confianza
  },
  
  // ❌ Análisis de Dominios
  strongDomains: [],         // Dominios con >75% precisión
  weakDomains: [],           // Dominios con <60% precisión
  
  // ❌ Insights Personalizados
  insights: {
    daysToGoal: 8,           // Días para llegar a 85% precisión
    streakRecommendation: 'Practica hoy...',
    nextMilestone: 'Responde 10 preguntas más'
  }
}
```

---

## 🔧 Plan de Implementación

### Fase 1: Completar Estadísticas Básicas ✅
1. ✅ Agregar `questionsAnswered` calculado de `answeredQuestions.length`
2. ✅ Agregar `correctAnswers` calculado de `questionTracking`
3. ✅ Agregar `quizzesTaken` calculado de `history.length`
4. ❌ Agregar `bestScore` calculado de `history`
5. ❌ Agregar `totalTimeSpent` suma de tiempos
6. ❌ Agregar `fastestQuiz` del history

### Fase 2: Implementar Sistema de Rachas ⚠️
1. ❌ Agregar `streakDays` al progress
2. ❌ Agregar `maxStreak` al progress
3. ❌ Agregar `lastActivity` timestamp
4. ❌ Calcular racha en cada quiz completado

### Fase 3: Métricas FSRS (Retención) ⚠️
1. ❌ Calcular `retention.average` basado en questionTracking
2. ❌ Calcular `retention.stability` promedio
3. ❌ Calcular `retention.dueForReview` (nextReviewDate < hoy)

### Fase 4: Zona de Aprendizaje ⚠️
1. ❌ Clasificar preguntas por dificultad personal
2. ❌ Calcular % en cada zona (Confort/ZPD/Desafiante)

### Fase 5: Preparación para Examen ⚠️
1. ❌ Calcular % de preparación basado en:
   - Preguntas respondidas
   - Precisión promedio
   - Cobertura de dominios
2. ❌ Estimar días faltantes basado en ritmo actual

### Fase 6: Insights Personalizados ⚠️
1. ❌ Generar recomendaciones basadas en:
   - Dominios débiles
   - Racha actual
   - Tiempo de estudio

---

## 🎯 Siguiente Paso

**Prioridad 1:** Completar estadísticas básicas en `getStats()`
- Agregar cálculo de campos faltantes
- Asegurar que ProfileScreen reciba datos correctos

**Prioridad 2:** Implementar sistema de rachas
- Tracking de actividad diaria
- Cálculo de racha actual y máxima

**Prioridad 3:** Métricas avanzadas (FSRS, Zona, Examen)
- Cálculos más complejos
- Insights personalizados

---

**Fecha de Análisis:** 2025-10-15  
**Estado:** 📋 Análisis completo - Listo para implementación
