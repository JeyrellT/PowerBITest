# 🔍 ANÁLISIS PROFUNDO DEL SISTEMA DE CALIFICACIÓN Y PERFIL

**Fecha**: 16 de octubre de 2025  
**Estado**: Diagnóstico Completo

---

## 📊 PROBLEMA IDENTIFICADO

El perfil muestra **TODOS LOS VALORES EN CERO** a pesar de haber completado quizzes:
- 0 XP
- 0 Preguntas
- 0.0% Precisión
- 0 Racha
- 0 Logros

---

## 🎯 ÚNICA FUENTE DE VERDAD

### Estructura de Datos en `CxCProgressContext`:

```javascript
progress = {
  // ===== PUNTOS Y NIVEL =====
  totalPoints: 0,           // ⚠️ Calculado en updateProgressAfterQuiz
  totalXP: 0,               // ⚠️ Calculado en updateProgressAfterQuiz
  currentLevel: 1,          // ⚠️ Derivado de totalPoints
  
  // ===== PREGUNTAS =====
  answeredQuestions: [],    // ✅ Array de IDs únicos (saveAnsweredQuestion)
  questionTracking: {},     // ✅ Objeto {questionId: trackingData}
  correctAnswers: 0,        // ⚠️ Contador agregado
  
  // ===== ESTADÍSTICAS =====
  domainStats: {},          // ⚠️ Actualizado en updateProgressAfterQuiz
  levelStats: {},           // ⚠️ Actualizado en updateProgressAfterQuiz
  
  // ===== LOGROS Y RACHA =====
  achievements: [],         // ✅ Array de achievement IDs
  streakDays: 0,            // ⚠️ Calculado en updateProgressAfterQuiz
  lastQuizDate: ISO,        // ⚠️ Fecha del último quiz
  lastActivity: ISO,        // ⚠️ Fecha de última actividad
  
  // ===== HISTORIAL =====
  history: [],              // ✅ Array de quiz completions
  
  // ===== OTROS =====
  badges: [],
  missions: {},
  quizzesTaken: 0,          // ⚠️ Contador redundante (puede derivarse de history)
  questionsAnswered: 0,     // ⚠️ REDUNDANTE - usar answeredQuestions.length
  bestScore: 0,
  fastestQuiz: null
}
```

---

## 🔄 FLUJO DE DATOS ACTUAL

### 1️⃣ **Usuario Completa Quiz** → `ResultsScreen.js`

```javascript
useEffect(() => {
  // Para cada pregunta:
  results.questions.forEach((question, index) => {
    // A. Registrar intento con metadata
    recordQuestionAttempt(questionId, isCorrect, timeSpent, metadata)
    
    // B. Guardar ID de pregunta respondida
    saveAnsweredQuestion(questionId)
  })
  
  // C. Actualizar progreso completo
  updateProgressAfterQuiz(quizResultsData)
  
  // D. Verificar logros
  checkAchievements()
}, [results])
```

### 2️⃣ **Funciones Llamadas**:

#### `recordQuestionAttempt(questionId, isCorrect, timeSpent, metadata)`
- **Propósito**: Tracking detallado por pregunta (FSRS, confianza, dificultad)
- **Actualiza**: `progress.questionTracking[questionId]`
- **Calcula**: status, confidence, nextReviewDate, FSRS params
- **✅ NO duplica datos**

#### `saveAnsweredQuestion(questionId)`
- **Propósito**: Marcar pregunta como respondida
- **Actualiza**: `progress.answeredQuestions[]`
- **⚠️ VERIFICA**: No duplica IDs (usa `.includes()`)
- **✅ Funciona correctamente**

#### `updateProgressAfterQuiz(quizResults)`
- **Propósito**: ACTUALIZACIÓN CENTRAL de todo el progreso
- **Recibe**: 
  ```javascript
  {
    totalQuestions: 5,
    correctAnswers: 1,
    totalTime: 120000,
    domain: 'preparar-datos',
    questionDetails: [
      { id, domain, level, correct, timeSpent }
    ]
  }
  ```
- **Actualiza**:
  - ✅ `domainStats` (attempted, correct, timeSpent)
  - ✅ `levelStats` (attempted, correct)
  - ✅ `totalPoints` (calculado por nivel + bonuses)
  - ✅ `totalXP` (puntos × 1.5)
  - ✅ `quizzesTaken++`
  - ✅ `correctAnswers` += correctAnswers
  - ✅ `history[]` (agrega entrada de quiz)
  - ✅ `streakDays` (calcula racha)
  - ✅ `achievements[]` (verifica y agrega)
  - ✅ `currentLevel` (deriva de totalPoints)

### 3️⃣ **ProfileScreen Obtiene Datos** → `getStats()`

```javascript
const getStats = useCallback(() => {
  // ===== PREGUNTAS =====
  const questionsAnswered = progress.answeredQuestions?.length || 0
  const quizzesTaken = progress.history?.filter(h => h.type === 'quiz').length || 0
  const correctAnswers = calculateCorrectAnswers(progress.questionTracking)
  const globalAccuracy = calculateGlobalAccuracy(progress.questionTracking)
  
  // ===== RACHA =====
  const streakDays = calculateStreakDays(progress.history, progress.lastActivity)
  
  // ===== DOMINIO =====
  const domainStats = {}
  Object.entries(progress.domainStats || {}).forEach(([domain, stats]) => {
    domainStats[domain] = {
      ...stats,
      accuracy: stats.attempted > 0 ? (stats.correct / stats.attempted) * 100 : 0
    }
  })
  
  return {
    totalPoints,
    questionsAnswered,  // ✅ Calculado desde answeredQuestions.length
    quizzesTaken,       // ✅ Calculado desde history
    accuracy,           // ✅ Alias de globalAccuracy
    globalAccuracy,
    domainStats,
    // ... 30+ métricas más
  }
}, [progress])
```

---

## ⚠️ PROBLEMAS DETECTADOS

### 1. **CÁLCULO DE `questionsAnswered`**
```javascript
// EN getStats():
const questionsAnswered = progress.answeredQuestions?.length || 0

// ❌ PROBLEMA: answeredQuestions puede NO sincronizarse con questionTracking
// ✅ SOLUCIÓN: Usar SIEMPRE answeredQuestions.length como fuente principal
```

### 2. **CÁLCULO DE `quizzesTaken`**
```javascript
// EN getStats():
const quizzesTaken = progress.history?.filter(h => h.type === 'quiz').length || 0

// ⚠️ PROBLEMA POTENCIAL: Si history se duplica, quizzesTaken será incorrecto
// ✅ FIXED: Ya corregido - solo updateProgressAfterQuiz agrega a history
```

### 3. **CÁLCULO DE `accuracy` / `globalAccuracy`**
```javascript
const calculateGlobalAccuracy = (questionTracking) => {
  const total = Object.values(questionTracking).reduce((sum, q) => 
    sum + (q.totalAttempts || 0), 0
  )
  const correct = calculateCorrectAnswers(questionTracking)
  return total > 0 ? Math.round((correct / total) * 1000) / 10 : 0
}

// ❌ PROBLEMA: Si questionTracking está vacío, accuracy = 0
// ✅ SOLUCIÓN: Verificar que questionTracking tenga datos
```

### 4. **DOMINIO STATS - PROGRESO vs PRECISIÓN**
```javascript
// ANTES (HomeScreen):
const accuracy = data.total > 0 ? (data.correct / data.total) * 100 : 0

// ✅ FIXED: Ahora muestra PROGRESO (attempted/total) en lugar de precisión
const progress = info.total > 0 ? (data.attempted / info.total) * 100 : 0
```

---

## 🔧 CAUSAS RAÍZ IDENTIFICADAS

### ❌ **CAUSA #1: DATOS NO SE PERSISTEN**
- **Síntoma**: Valores en 0 en ProfileScreen
- **Razón**: `localStorage` puede no estar guardando correctamente
- **Verificación**: Revisar `progressService.saveProgress()`
- **Fix**: Asegurar autosave y guardado manual

### ❌ **CAUSA #2: DUPLICACIÓN EN ResultsScreen (FIXED)**
- **Síntoma**: 7340 quizzes, 147350 puntos por 1 quiz
- **Razón**: Se llamaban múltiples funciones que actualizaban lo mismo
- **Fix**: ✅ Eliminado `addPoints`, `addXP`, `updateDomainStats`, `updateLevelStats`, `recordQuizCompletion`
- **Ahora**: Solo `updateProgressAfterQuiz` maneja TODO

### ❌ **CAUSA #3: questionTracking vs answeredQuestions DESINCRONIZADOS**
- **Síntoma**: answeredQuestions.length ≠ Object.keys(questionTracking).length
- **Razón**: Se agregan a arrays diferentes en momentos diferentes
- **Fix**: Verificar consistencia

---

## 📈 MÉTRICAS CALCULADAS Y SUS FUENTES

| Métrica | Fuente de Datos | Cálculo | Ubicación |
|---------|----------------|---------|-----------|
| **totalPoints** | `progress.totalPoints` | Σ(puntos por pregunta correcta + bonuses) | `updateProgressAfterQuiz` |
| **totalXP** | `progress.totalXP` | `totalPoints × 1.5` | `updateProgressAfterQuiz` |
| **questionsAnswered** | `progress.answeredQuestions.length` | Directo (array de IDs únicos) | `saveAnsweredQuestion` |
| **quizzesTaken** | `progress.history.filter(h => h.type === 'quiz').length` | Filtro de history | `updateProgressAfterQuiz` |
| **globalAccuracy** | `progress.questionTracking` | `(Σ correctAttempts / Σ totalAttempts) × 100` | `calculateGlobalAccuracy` |
| **streakDays** | `progress.history`, `progress.lastActivity` | Contar días consecutivos con actividad | `calculateStreakDays` |
| **domainStats[d].attempted** | `progress.domainStats[d].attempted` | Incremento por cada pregunta del dominio | `updateProgressAfterQuiz` |
| **domainStats[d].correct** | `progress.domainStats[d].correct` | Incremento por cada respuesta correcta | `updateProgressAfterQuiz` |
| **currentLevel** | `progress.currentLevel` | Derivado de `totalPoints` vs `LEVEL_THRESHOLDS` | `calculateLevel` |
| **achievements.length** | `progress.achievements.length` | Array de achievement IDs | `checkAchievements` |

---

## ✅ FIXES IMPLEMENTADOS

### 1. **Eliminada Duplicación en ResultsScreen**
```javascript
// ❌ ANTES: 8 funciones
addPoints(), addXP(), updateDomainStats(), updateLevelStats(), 
updateProgressAfterQuiz(), recordQuizCompletion(), saveAnsweredQuestion(), recordQuestionAttempt()

// ✅ AHORA: 3 funciones
recordQuestionAttempt()      // Tracking por pregunta
saveAnsweredQuestion()        // Marcar como respondida
updateProgressAfterQuiz()     // TODO lo demás (puntos, XP, stats, history)
```

### 2. **Corregido Cálculo de Puntos**
```javascript
// ✅ NUEVO SISTEMA:
questionDetails.forEach(detail => {
  if (detail.correct) {
    const basePoints = detail.level === 'avanzado' ? 30 
                     : detail.level === 'intermedio' ? 20 
                     : 10
    quizPoints += basePoints
  }
})

// Bonus por quiz perfecto: +100
// Bonus por 90%+: +50
// Bonus por 80%+: +25
// Bonus por velocidad: +50
```

### 3. **Corregido Progreso por Dominio en HomeScreen**
```javascript
// ✅ AHORA MUESTRA:
const progress = (data.attempted / totalPreguntasDelDominio) * 100
const accuracy = (data.correct / data.attempted) * 100

// Ejemplo: "preparar-datos" tiene 20 preguntas
// Si respondiste 5 → Progreso = 25%
// Si acertaste 4 de 5 → Precisión = 80%
```

---

## 🚀 PRÓXIMOS PASOS

### A. **VERIFICAR PERSISTENCIA**
1. Revisar que `autosave` funcione
2. Verificar que `localStorage` guarde correctamente
3. Agregar logs para debug de guardado

### B. **ROBUSTECER VALIDACIÓN**
1. Validar que `answeredQuestions` no tenga duplicados
2. Validar que `history` tenga `type: 'quiz'`
3. Validar que `questionTracking` tenga datos consistentes

### C. **AGREGAR MÉTRICAS DE DEBUG**
1. Agregar `console.log` en puntos clave
2. Crear herramienta de diagnóstico en ProfileScreen
3. Mostrar datos raw en modo debug

---

## 📝 NOTAS FINALES

- **ÚNICA FUENTE DE VERDAD**: `CxCProgressContext.progress`
- **GUARDADO**: `progressService.saveProgress()` → `localStorage['cxc-progress']`
- **CARGA**: `progressService.loadProgress()` al iniciar
- **SINCRONIZACIÓN**: Autosave cada 30s + guardado manual
