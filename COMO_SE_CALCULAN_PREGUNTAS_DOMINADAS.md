# 📊 Cómo se Calculan las Preguntas Dominadas

## 🎯 Resumen Ejecutivo

Una pregunta se considera **DOMINADA** cuando cumple alguna de estas condiciones:

```javascript
status === 'mastered' || confidenceLevel >= 4
```

Es decir:
1. **Estado = 'mastered'** → Has respondido correctamente 3+ veces consecutivas
2. **Nivel de confianza ≥ 4** → Tienes confianza HIGH o VERY_HIGH

---

## 🏗️ Sistema de Estados de Preguntas

### Estados Disponibles (`QUESTION_STATUS`)

```javascript
export const QUESTION_STATUS = {
  NEW: 'new',              // 🆕 Nunca respondida
  LEARNING: 'learning',    // 📚 En proceso de aprendizaje
  REVIEWING: 'reviewing',  // 🔄 En revisión (ya la sabes pero refuerzas)
  MASTERED: 'mastered',    // ✅ Dominada (3 correctas consecutivas)
  RETIRED: 'retired'       // 🏆 Retirada (5 correctas consecutivas)
};
```

### Niveles de Confianza (`CONFIDENCE_LEVELS`)

```javascript
export const CONFIDENCE_LEVELS = {
  NONE: 0,        // Sin intentos suficientes
  VERY_LOW: 1,    // < 33% de acierto
  LOW: 2,         // 33% - 66% de acierto
  MEDIUM: 3,      // ≥ 66% de acierto
  HIGH: 4,        // 3+ correctas consecutivas ⭐ DOMINADA
  VERY_HIGH: 5    // 5+ correctas consecutivas ⭐ DOMINADA
};
```

---

## 🔢 Configuración de Dominio

```javascript
export const MASTERY_CONFIG = {
  ATTEMPTS_TO_MASTER: 3,      // Correctas consecutivas para MASTERED
  ATTEMPTS_TO_RETIRE: 5,      // Correctas consecutivas para RETIRED
  REVIEW_INTERVAL_DAYS: 7,    // Días entre revisiones de dominadas
  MAX_STREAK_REWARD: 10,      // Bonus máximo por racha
  MIN_ATTEMPTS_FOR_CONFIDENCE: 2  // Intentos mínimos para calcular confianza
};
```

---

## 🧮 Algoritmo de Cálculo Completo

### Paso 1: Actualización de Tracking

Cada vez que respondes una pregunta, se actualiza su **tracking**:

```javascript
const tracking = {
  id: "pregunta-123",
  status: "learning",                  // Estado actual
  confidenceLevel: 2,                  // Nivel de confianza (0-5)
  totalAttempts: 5,                    // Total de intentos
  correctAttempts: 3,                  // Intentos correctos
  incorrectAttempts: 2,                // Intentos incorrectos
  consecutiveCorrect: 2,               // Correctas seguidas
  consecutiveIncorrect: 0,             // Incorrectas seguidas
  lastAttemptDate: "2025-10-19T...",   // Última vez que la respondiste
  masteredDate: null,                  // Fecha en que la dominaste
  nextReviewDate: "2025-10-26T...",    // Próxima revisión programada
  averageTimeSpent: 45,                // Tiempo promedio en segundos
  personalDifficulty: 35               // Dificultad personal (0-100)
};
```

### Paso 2: Cálculo de Nivel de Confianza

```javascript
function updateQuestionStatusAndConfidence(tracking) {
  const { consecutiveCorrect, totalAttempts, correctAttempts } = tracking;
  
  // 1️⃣ Si no hay intentos suficientes
  if (totalAttempts < 2) {
    tracking.confidenceLevel = 0; // NONE
    return;
  }
  
  // 2️⃣ Calcular tasa de éxito
  const successRate = correctAttempts / totalAttempts;
  
  // 3️⃣ Determinar nivel de confianza
  if (consecutiveCorrect >= 5) {
    tracking.confidenceLevel = 5; // VERY_HIGH ✅ DOMINADA
  } 
  else if (consecutiveCorrect >= 3) {
    tracking.confidenceLevel = 4; // HIGH ✅ DOMINADA
  } 
  else if (successRate >= 0.66) {
    tracking.confidenceLevel = 3; // MEDIUM
  } 
  else if (successRate >= 0.33) {
    tracking.confidenceLevel = 2; // LOW
  } 
  else {
    tracking.confidenceLevel = 1; // VERY_LOW
  }
}
```

### Paso 3: Cálculo de Estado

```javascript
function updateQuestionStatusAndConfidence(tracking) {
  const { consecutiveCorrect, totalAttempts, correctAttempts, consecutiveIncorrect } = tracking;
  
  // 1️⃣ RETIRED: 5+ correctas consecutivas
  if (consecutiveCorrect >= 5) {
    tracking.status = 'retired'; // 🏆
    tracking.masteredDate = new Date().toISOString();
  }
  
  // 2️⃣ MASTERED: 3-4 correctas consecutivas
  else if (consecutiveCorrect >= 3) {
    tracking.status = 'mastered'; // ✅
    if (!tracking.masteredDate) {
      tracking.masteredDate = new Date().toISOString();
    }
  }
  
  // 3️⃣ NEW: Sin intentos
  else if (totalAttempts === 0) {
    tracking.status = 'new'; // 🆕
  }
  
  // 4️⃣ REVIEWING: Has acertado antes y no tienes incorrectas recientes
  else if (correctAttempts > 0 && consecutiveIncorrect === 0) {
    tracking.status = 'reviewing'; // 🔄
  }
  
  // 5️⃣ LEARNING: Aún aprendiendo
  else {
    tracking.status = 'learning'; // 📚
  }
}
```

### Paso 4: Conteo de Preguntas Dominadas

```javascript
const countMastered = (questionTracking) => {
  if (!questionTracking) return 0;
  
  return Object.values(questionTracking).filter(q => 
    q.status === 'mastered' || q.confidenceLevel >= 4
  ).length;
};
```

**Explicación:**
- Recorre todas las preguntas del tracking
- Cuenta las que cumplen **CUALQUIERA** de estas condiciones:
  - `status === 'mastered'` (3+ correctas consecutivas)
  - `status === 'retired'` (5+ correctas consecutivas) ← También cuenta como mastered
  - `confidenceLevel >= 4` (HIGH o VERY_HIGH)

---

## 📈 Ejemplos Prácticos

### Ejemplo 1: Pregunta Nueva → Dominada

```
Intento 1: ❌ Incorrecta
├─ totalAttempts: 1
├─ correctAttempts: 0
├─ consecutiveCorrect: 0
├─ status: 'learning'
└─ confidenceLevel: 0 (NONE)

Intento 2: ✅ Correcta
├─ totalAttempts: 2
├─ correctAttempts: 1
├─ consecutiveCorrect: 1
├─ status: 'reviewing'
└─ confidenceLevel: 2 (LOW, 50% acierto)

Intento 3: ✅ Correcta
├─ totalAttempts: 3
├─ correctAttempts: 2
├─ consecutiveCorrect: 2
├─ status: 'reviewing'
└─ confidenceLevel: 3 (MEDIUM, 66% acierto)

Intento 4: ✅ Correcta
├─ totalAttempts: 4
├─ correctAttempts: 3
├─ consecutiveCorrect: 3 ← ¡DOMINADA!
├─ status: 'mastered' ✅
├─ confidenceLevel: 4 (HIGH) ✅
├─ masteredDate: "2025-10-19T15:30:00Z"
└─ nextReviewDate: "2025-10-26T15:30:00Z" (7 días después)
```

### Ejemplo 2: Pregunta con Altibajos

```
Intento 1: ✅ Correcta
├─ consecutiveCorrect: 1
└─ status: 'reviewing'

Intento 2: ✅ Correcta
├─ consecutiveCorrect: 2
└─ status: 'reviewing'

Intento 3: ❌ Incorrecta ← Se rompe la racha
├─ consecutiveCorrect: 0
├─ consecutiveIncorrect: 1
└─ status: 'learning'

Intento 4: ✅ Correcta
├─ consecutiveCorrect: 1
├─ consecutiveIncorrect: 0
└─ status: 'reviewing'

Intento 5: ✅ Correcta
├─ consecutiveCorrect: 2
└─ status: 'reviewing'

Intento 6: ✅ Correcta
├─ consecutiveCorrect: 3 ← ¡DOMINADA!
├─ status: 'mastered' ✅
└─ confidenceLevel: 4 (HIGH) ✅
```

### Ejemplo 3: Pregunta Perfecta → Retirada

```
Intento 1: ✅ Correcta
Intento 2: ✅ Correcta
Intento 3: ✅ Correcta → MASTERED
Intento 4: ✅ Correcta
Intento 5: ✅ Correcta → RETIRED 🏆

Estado final:
├─ consecutiveCorrect: 5
├─ status: 'retired'
├─ confidenceLevel: 5 (VERY_HIGH)
└─ nextReviewDate: +30 días
```

---

## 🎨 Visualización por Dominio

En `ProfileScreenDuolingo.js`, las preguntas dominadas se cuentan **por dominio**:

```javascript
const totalMastered = Object.values(stats.domainStats)
  .reduce((sum, domain) => sum + (domain.mastered || 0), 0);

// Ejemplo de stats.domainStats:
{
  "preparar-datos": {
    total: 10,
    answered: 10,
    correct: 8,
    mastered: 3,  // ← 3 preguntas dominadas de este dominio
    accuracy: 80
  },
  "modelar-datos": {
    total: 15,
    answered: 12,
    correct: 10,
    mastered: 5,  // ← 5 preguntas dominadas de este dominio
    accuracy: 83
  }
}

// Total de preguntas dominadas: 3 + 5 = 8
```

---

## 🔍 Dónde se Usa

### 1. **Conteo Global**
```javascript
// En CxCProgressContext.js (línea 637)
const countMastered = (questionTracking) => {
  if (!questionTracking) return 0;
  return Object.values(questionTracking).filter(q => 
    q.status === 'mastered' || q.confidenceLevel >= 4
  ).length;
};
```

### 2. **Perfil de Usuario**
```javascript
// En ProfileScreenDuolingo.js (línea 1282)
const totalMastered = Object.values(stats.domainStats)
  .reduce((sum, domain) => sum + (domain.mastered || 0), 0);

// Se muestra en:
if (totalMastered === 0) return 'Ninguna aún';
if (totalMastered < 5) return `${totalMastered} preguntas`;
if (totalMastered < 15) return `${totalMastered} preguntas ⭐`;
return `${totalMastered} preguntas 🏆`;
```

### 3. **Análisis de Preparación**
```javascript
// En profileImpact.js (línea 208)
const masteredCount = questionTracking 
  ? Object.values(questionTracking).filter(t => t.status === 'MASTERED').length 
  : 0;

const masteryRate = answeredCount > 0 
  ? (masteredCount / answeredCount) * 100 
  : 0;
```

### 4. **Filtrado de Preguntas**
```javascript
// En preguntas.js (línea 2768)
// Excluir preguntas dominadas del quiz
todasLasPreguntas = todasLasPreguntas.filter(p => {
  const tracking = questionTracking[p.id];
  if (!tracking) return true; // No respondida, incluir
  
  const accuracy = tracking.totalAttempts > 0 
    ? (tracking.correctAttempts / tracking.totalAttempts) * 100 
    : 0;
  
  // Excluir solo si está dominada
  const isMastered = tracking.consecutiveCorrect >= 3 && accuracy >= 80;
  return !isMastered;
});
```

---

## 📊 Estadísticas Relacionadas

### Tasa de Dominio (Mastery Rate)

```javascript
// Por dominio
const masteryRate = (domain.mastered / domain.total) * 100;

// Ejemplo:
// - Total de preguntas en "preparar-datos": 20
// - Preguntas dominadas: 8
// - Mastery Rate: (8 / 20) × 100 = 40%
```

### Preparación para el Examen

```javascript
// En profileImpact.js (línea 443)
const masteryRate = (stats.mastered / total) * 100;
const readinessScore = (coverageRate * 0.3) + (masteryRate * 0.4) + (consistencyScore * 0.3);

// Factores:
// - 30% Cobertura (cuántas preguntas has respondido)
// - 40% Dominio (cuántas has dominado)
// - 30% Consistencia (racha actual y precisión)
```

---

## 🎯 Criterios Exactos para Dominar

### Opción 1: Por Rachas Consecutivas

| Correctas Consecutivas | Estado | Confianza | ¿Dominada? |
|------------------------|--------|-----------|------------|
| 0-2 | learning/reviewing | LOW/MEDIUM | ❌ No |
| 3-4 | **mastered** | **HIGH** | ✅ **Sí** |
| 5+ | **retired** | **VERY_HIGH** | ✅ **Sí** |

### Opción 2: Por Tasa de Éxito

| Tasa de Éxito | Confianza | ¿Dominada? |
|---------------|-----------|------------|
| < 33% | VERY_LOW (1) | ❌ No |
| 33% - 66% | LOW (2) | ❌ No |
| ≥ 66% | MEDIUM (3) | ❌ No |
| ≥ 66% + 3 correctas | **HIGH (4)** | ✅ **Sí** |
| ≥ 66% + 5 correctas | **VERY_HIGH (5)** | ✅ **Sí** |

---

## 🛠️ Cómo se Actualiza el Tracking

### Al Responder una Pregunta

```javascript
// En CxCProgressContext.js (función recordAnswer)

1. Actualizar intentos:
   - totalAttempts++
   - correctAttempts++ (si correcta)
   - incorrectAttempts++ (si incorrecta)

2. Actualizar rachas:
   - Si correcta: consecutiveCorrect++, consecutiveIncorrect = 0
   - Si incorrecta: consecutiveIncorrect++, consecutiveCorrect = 0

3. Calcular nivel de confianza:
   → updateQuestionStatusAndConfidence(tracking)

4. Actualizar estado (NEW → LEARNING → REVIEWING → MASTERED → RETIRED):
   → updateQuestionStatusAndConfidence(tracking)

5. Calcular próxima revisión:
   → calculateNextReviewDate(tracking)

6. Calcular dificultad personal:
   → calculatePersonalDifficulty(tracking)

7. Guardar en localStorage:
   → saveProgress(progress)
```

---

## 💡 Consejos para Dominar Preguntas

### Estrategia Óptima

1. **Enfócate en rachas**: Necesitas 3 correctas seguidas
2. **Revisa tus errores**: Cada error reinicia la racha
3. **Practica regularmente**: Mantén el streak para bonus
4. **No te saltes dominios**: Explora todas las áreas

### Progresión Típica

```
Quiz 1: 5 preguntas → 0 dominadas (primeros intentos)
Quiz 2: 5 preguntas → 1 dominada (refuerzas una)
Quiz 3: 5 preguntas → 2 dominadas (mejoras en 2)
Quiz 4: 5 preguntas → 3 dominadas (dominas una nueva)
Quiz 5: 5 preguntas → 5 dominadas (ya las conoces bien)
...
Quiz 20: 5 preguntas → 25 dominadas total
```

### Tiempo Estimado

- **Dominar 1 pregunta**: 3 quizzes mínimo
- **Dominar 10 preguntas**: ~6-8 quizzes
- **Dominar 50 preguntas**: ~20-25 quizzes
- **Dominar todas (100)**: ~40-50 quizzes

---

## 📝 Resumen

✅ **Pregunta Dominada** = `status === 'mastered'` **O** `confidenceLevel >= 4`

✅ **Requisitos**:
- Mínimo 2 intentos
- 3+ correctas consecutivas **O**
- 66%+ de acierto general con buen historial

✅ **Beneficios**:
- Bonus de puntos (25 pts)
- Mayor XP
- Intervalos de revisión más largos
- Mejor preparación para el examen

✅ **Ubicación en código**:
- `src/contexts/CxCProgressContext.js` (líneas 360-410, 637-642)
- `src/components/ProfileScreenDuolingo.js` (líneas 1282-1289)
- `src/utils/profileImpact.js` (líneas 196-220, 270-305)

---

**Fecha de creación:** 19 de octubre de 2025  
**Archivo principal:** `CxCProgressContext.js`  
**Función clave:** `countMastered(questionTracking)`  
**Estado:** ✅ Documentado completamente
