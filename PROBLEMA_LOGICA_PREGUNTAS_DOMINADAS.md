# 🚨 Problema Crítico: Lógica de Preguntas Dominadas vs Exclusión de Quiz

## 📋 Problema Identificado

**Pregunta del usuario:**
> "Pero si en mi aplicación saco las correctas del siguiente quiz, ¿cómo puedo dominar? ¿O ahí ya sería un problema por esa lógica?"

## 🎯 Respuesta: ¡DETECTASTE UN PROBLEMA REAL!

Existe una **contradicción lógica** entre:

1. **Sistema de dominio**: Necesitas **3 respuestas correctas CONSECUTIVAS**
2. **Sistema de exclusión**: Las preguntas se excluyen del quiz si están dominadas

---

## 🔍 Análisis del Problema

### Escenario Problemático

```
Quiz 1: Pregunta A
├─ Respondes CORRECTA ✅
├─ consecutiveCorrect: 1
└─ status: 'reviewing'

Quiz 2: Pregunta A vuelve a aparecer
├─ Respondes CORRECTA ✅
├─ consecutiveCorrect: 2
└─ status: 'reviewing'

Quiz 3: Pregunta A vuelve a aparecer
├─ Respondes CORRECTA ✅
├─ consecutiveCorrect: 3
├─ status: 'mastered' ✅
└─ ⚠️ AHORA SE EXCLUYE DE FUTUROS QUIZZES

Quiz 4: ❌ Pregunta A NO APARECE
└─ No puedes seguir practicándola

Quiz 5: ❌ Pregunta A NO APARECE
└─ Nunca llegas a 'retired' (5 correctas)
```

### El Ciclo Vicioso

```
1. Necesitas 3 correctas consecutivas → MASTERED
2. MASTERED se excluye del quiz → excludeMasteredOnly: true
3. No vuelve a aparecer → No puedes practicarla más
4. Nunca llegas a RETIRED (5 correctas)
5. Puede que olvides la pregunta con el tiempo
```

---

## 📊 Estado Actual del Código

### En `preguntas.js` (línea 2764-2775)

```javascript
else if (excludeMasteredOnly) {
  // Solo excluir preguntas DOMINADAS (mastered/retired)
  todasLasPreguntas = todasLasPreguntas.filter(p => {
    const tracking = questionTracking[p.id];
    if (!tracking) return true; // No respondida, incluir
    
    // Excluir solo si está dominada (3+ correctas consecutivas y 80%+ accuracy)
    const accuracy = tracking.totalAttempts > 0 
      ? (tracking.correctAttempts / tracking.totalAttempts) * 100 
      : 0;
    const isDominated = tracking.consecutiveCorrect >= 3 && accuracy >= 80;
    
    return !isDominated; // Incluir si NO está dominada
  });
}
```

**Problema:** Una vez que `consecutiveCorrect >= 3`, la pregunta se excluye PARA SIEMPRE.

### En `QuizScreen.js` (línea 62)

```javascript
filteredQuestions = getFilteredQuestions(
  quizConfig.domain,
  quizConfig.level,
  quizConfig.numberOfQuestions,
  [], // No usar preguntasExcluidas legacy
  {
    questionTracking,
    excludeMasteredOnly: true, // ✅ Solo excluir dominadas, no todas
    prioritizeWeak: true
  }
);
```

**Resultado:** Las preguntas con `status === 'mastered'` nunca vuelven a aparecer.

---

## 💡 Soluciones Propuestas

### Opción 1: Sistema de Repetición Espaciada (RECOMENDADO) ⭐

**Concepto:** No excluir completamente, sino mostrar con menor frecuencia.

```javascript
// En preguntas.js
else if (excludeMasteredOnly) {
  // NUEVO: Sistema de ponderación en lugar de exclusión total
  todasLasPreguntas = todasLasPreguntas.map(p => {
    const tracking = questionTracking[p.id];
    if (!tracking) {
      return { ...p, weight: 1.0 }; // Peso normal
    }
    
    const accuracy = tracking.totalAttempts > 0 
      ? (tracking.correctAttempts / tracking.totalAttempts) * 100 
      : 0;
    
    // Asignar peso según estado
    let weight = 1.0;
    
    if (tracking.status === 'retired') {
      weight = 0.05; // 5% probabilidad (muy dominada)
    } else if (tracking.status === 'mastered') {
      weight = 0.15; // 15% probabilidad (dominada)
    } else if (tracking.status === 'reviewing' && accuracy >= 70) {
      weight = 0.40; // 40% probabilidad (casi dominada)
    } else if (tracking.status === 'reviewing') {
      weight = 0.70; // 70% probabilidad (en revisión)
    } else if (tracking.status === 'learning') {
      weight = 1.0; // 100% probabilidad (aprendiendo)
    } else if (tracking.consecutiveIncorrect >= 2) {
      weight = 1.5; // 150% probabilidad (necesita refuerzo)
    }
    
    return { ...p, weight };
  });
  
  // Selección ponderada
  preguntasParaSortear = weightedShuffle(todasLasPreguntas, cantidad);
}

// Nueva función de mezcla ponderada
function weightedShuffle(questions, count) {
  const weighted = [];
  
  questions.forEach(q => {
    const times = Math.ceil((q.weight || 1.0) * 10);
    for (let i = 0; i < times; i++) {
      weighted.push(q);
    }
  });
  
  const shuffled = shuffleArray(weighted);
  const unique = [];
  const seen = new Set();
  
  for (const q of shuffled) {
    if (!seen.has(q.id)) {
      unique.push(q);
      seen.add(q.id);
      if (unique.length >= count) break;
    }
  }
  
  return unique;
}
```

**Ventajas:**
- ✅ Las preguntas dominadas AÚN pueden aparecer (pero menos frecuente)
- ✅ Permite llegar a RETIRED (5 correctas)
- ✅ Refuerza memoria a largo plazo
- ✅ Balancea práctica vs eficiencia

**Probabilidades:**
```
RETIRED     → 5% de aparecer  (1 de cada 20 quizzes)
MASTERED    → 15% de aparecer (1 de cada 7 quizzes)
REVIEWING   → 40-70% de aparecer
LEARNING    → 100% de aparecer
WEAK (2+ ❌) → 150% de aparecer (más prioridad)
```

---

### Opción 2: Revisión Programada por Fechas

**Concepto:** Usar `nextReviewDate` para determinar si incluir la pregunta.

```javascript
else if (excludeMasteredOnly) {
  const now = new Date();
  
  todasLasPreguntas = todasLasPreguntas.filter(p => {
    const tracking = questionTracking[p.id];
    if (!tracking) return true; // No respondida, incluir
    
    // Si no tiene fecha de revisión, incluir
    if (!tracking.nextReviewDate) return true;
    
    // Si ya llegó la fecha de revisión, incluir
    const reviewDate = new Date(tracking.nextReviewDate);
    if (now >= reviewDate) return true;
    
    // Si está dominada pero aún no toca revisión, excluir
    if (tracking.status === 'mastered' || tracking.status === 'retired') {
      return false;
    }
    
    return true; // Otros casos, incluir
  });
}
```

**En `CxCProgressContext.js` (línea 450-480):**

```javascript
// Actualizar calculateNextReviewDate para intervalos más cortos
const calculateNextReviewDate = (tracking) => {
  const { status, consecutiveCorrect, lastAttemptDate } = tracking;
  const lastAttempt = new Date(lastAttemptDate);
  let daysToAdd = 0;

  switch (status) {
    case QUESTION_STATUS.LEARNING:
      daysToAdd = 1; // 1 día
      break;
    case QUESTION_STATUS.REVIEWING:
      daysToAdd = Math.min(2 * consecutiveCorrect, 7); // 2-7 días
      break;
    case QUESTION_STATUS.MASTERED:
      daysToAdd = 7; // 7 días (antes de excluir)
      break;
    case QUESTION_STATUS.RETIRED:
      daysToAdd = 14; // 14 días (revisión espaciada)
      break;
  }

  tracking.nextReviewDate = new Date(lastAttempt.getTime() + daysToAdd * 24 * 60 * 60 * 1000).toISOString();
  return tracking;
};
```

**Ventajas:**
- ✅ Revisión basada en ciencia cognitiva (repetición espaciada)
- ✅ Las preguntas vuelven a aparecer después de X días
- ✅ Mejor retención a largo plazo

**Intervalos:**
```
LEARNING  → 1 día
REVIEWING → 2-7 días (según racha)
MASTERED  → 7 días
RETIRED   → 14 días
```

---

### Opción 3: Modo "Revisión de Dominadas" Explícito

**Concepto:** No excluir del todo, sino crear un modo especial de revisión.

```javascript
// En QuizScreen.js - Agregar opción de quiz
const quizModes = {
  NORMAL: 'normal',           // Excluye dominadas
  REVIEW_ALL: 'review-all',   // Incluye todas (hasta dominadas)
  MASTERED_ONLY: 'mastered'   // SOLO dominadas
};

// Modificar filtrado
if (quizConfig.mode === 'MASTERED_ONLY') {
  // SOLO preguntas dominadas
  filteredQuestions = getFilteredQuestions(
    quizConfig.domain,
    quizConfig.level,
    quizConfig.numberOfQuestions,
    [],
    {
      questionTracking,
      includeMasteredOnly: true // Nueva opción
    }
  );
} else if (quizConfig.mode === 'REVIEW_ALL') {
  // TODAS las preguntas (sin exclusión)
  filteredQuestions = getFilteredQuestions(
    quizConfig.domain,
    quizConfig.level,
    quizConfig.numberOfQuestions,
    [],
    {
      questionTracking,
      excludeMasteredOnly: false, // No excluir
      prioritizeWeak: true
    }
  );
} else {
  // Modo normal (excluir dominadas)
  filteredQuestions = getFilteredQuestions(
    quizConfig.domain,
    quizConfig.level,
    quizConfig.numberOfQuestions,
    [],
    {
      questionTracking,
      excludeMasteredOnly: true,
      prioritizeWeak: true
    }
  );
}
```

**En HomeScreen.js - Agregar botón:**

```javascript
<button 
  className="quiz-mode-btn"
  onClick={() => startQuiz({ mode: 'MASTERED_ONLY' })}
>
  🏆 Revisar Preguntas Dominadas
  <span className="badge">{masteredCount}</span>
</button>
```

**Ventajas:**
- ✅ Control explícito del usuario
- ✅ No cambia comportamiento por defecto
- ✅ Permite practicar dominadas cuando quieras

---

### Opción 4: Degradación de Dominio por Inactividad

**Concepto:** Si no practicas una pregunta dominada en X días, vuelve a REVIEWING.

```javascript
// En CxCProgressContext.js - Nueva función
const checkMasteryDegradation = (questionTracking) => {
  const now = new Date();
  const DEGRADATION_DAYS = 30; // 30 días sin práctica
  
  Object.values(questionTracking).forEach(tracking => {
    if (tracking.status !== 'mastered' && tracking.status !== 'retired') {
      return; // Solo revisar dominadas
    }
    
    if (!tracking.lastAttemptDate) return;
    
    const lastAttempt = new Date(tracking.lastAttemptDate);
    const daysSince = (now - lastAttempt) / (1000 * 60 * 60 * 24);
    
    // Si pasaron 30+ días sin practicar
    if (daysSince >= DEGRADATION_DAYS) {
      tracking.status = 'reviewing'; // Degradar a revisión
      tracking.consecutiveCorrect = Math.max(0, tracking.consecutiveCorrect - 1);
      console.log(`📉 Pregunta ${tracking.id} degradada a REVIEWING por inactividad`);
    }
  });
  
  return questionTracking;
};

// Llamar al cargar progreso
useEffect(() => {
  const progress = loadProgress();
  if (progress.questionTracking) {
    progress.questionTracking = checkMasteryDegradation(progress.questionTracking);
    setProgress(progress);
  }
}, []);
```

**Ventajas:**
- ✅ Refleja realidad cognitiva (olvido natural)
- ✅ Las preguntas vuelven a aparecer si no las practicas
- ✅ Incentiva revisión periódica

---

## 🎯 Recomendación Final: COMBO de Opción 1 + Opción 2

**Sistema Híbrido:**

1. **Repetición Espaciada** (Opción 2): Usar `nextReviewDate` para determinar cuándo revisar
2. **Ponderación** (Opción 1): Si la fecha de revisión llegó, darle peso reducido en vez de 100%

```javascript
else if (excludeMasteredOnly) {
  const now = new Date();
  
  todasLasPreguntas = todasLasPreguntas.map(p => {
    const tracking = questionTracking[p.id];
    if (!tracking) {
      return { ...p, weight: 1.0 };
    }
    
    let weight = 1.0;
    
    // Si tiene fecha de revisión y NO ha llegado aún
    if (tracking.nextReviewDate) {
      const reviewDate = new Date(tracking.nextReviewDate);
      if (now < reviewDate) {
        // Aún no toca revisar
        if (tracking.status === 'retired') {
          return { ...p, weight: 0.0 }; // Excluir totalmente
        } else if (tracking.status === 'mastered') {
          return { ...p, weight: 0.05 }; // Muy baja probabilidad
        }
      }
    }
    
    // Si llegó la fecha de revisión O no tiene fecha
    if (tracking.status === 'retired') {
      weight = 0.20; // 20% (toca revisión)
    } else if (tracking.status === 'mastered') {
      weight = 0.40; // 40% (toca revisión)
    } else if (tracking.status === 'reviewing') {
      weight = 0.80;
    } else if (tracking.status === 'learning') {
      weight = 1.0;
    } else if (tracking.consecutiveIncorrect >= 2) {
      weight = 1.5; // Prioridad máxima
    }
    
    return { ...p, weight };
  });
  
  preguntasParaSortear = weightedShuffle(todasLasPreguntas, cantidad);
}
```

**Comportamiento resultante:**

```
Día 0: Respondes correcta → LEARNING
Día 1: Aparece de nuevo (100%) → Respondes correcta → REVIEWING
Día 3: Aparece de nuevo (80%) → Respondes correcta → MASTERED
  └─ nextReviewDate = Día 10

Día 4-9: NO aparece (o 5% probabilidad)
Día 10: ✅ Aparece (40% probabilidad) → Si respondes correcta
  └─ consecutiveCorrect = 4
  └─ nextReviewDate = Día 17

Día 17: ✅ Aparece (40% probabilidad) → Si respondes correcta
  └─ consecutiveCorrect = 5 → RETIRED 🏆
  └─ nextReviewDate = Día 31

Día 31: ✅ Aparece (20% probabilidad) → Mantenimiento
```

---

## 📊 Comparativa de Opciones

| Opción | Complejidad | Eficacia Pedagógica | Mantiene Dominio | UX |
|--------|-------------|---------------------|------------------|-----|
| 1. Ponderación | Media | ⭐⭐⭐⭐ | ✅ Sí | ⭐⭐⭐⭐ |
| 2. Fechas | Media | ⭐⭐⭐⭐⭐ | ✅ Sí | ⭐⭐⭐⭐⭐ |
| 3. Modo Explícito | Baja | ⭐⭐⭐ | ⚠️ Manual | ⭐⭐⭐ |
| 4. Degradación | Alta | ⭐⭐⭐⭐ | ✅ Sí | ⭐⭐⭐⭐ |
| **Combo 1+2** | **Alta** | **⭐⭐⭐⭐⭐** | **✅ Sí** | **⭐⭐⭐⭐⭐** |

---

## 🛠️ Implementación Recomendada

### Paso 1: Modificar `preguntas.js`

```javascript
// Agregar función de mezcla ponderada
function weightedShuffle(questions, targetCount) {
  // Crear pool ponderado
  const weighted = [];
  
  questions.forEach(q => {
    const weight = q.weight || 1.0;
    const copies = Math.max(1, Math.ceil(weight * 10));
    
    for (let i = 0; i < copies; i++) {
      weighted.push(q);
    }
  });
  
  // Mezclar y deduplicar
  const shuffled = shuffleArray(weighted);
  const unique = [];
  const seen = new Set();
  
  for (const q of shuffled) {
    if (!seen.has(q.id)) {
      unique.push({ ...q }); // Remover weight del resultado
      delete unique[unique.length - 1].weight;
      seen.add(q.id);
      
      if (unique.length >= targetCount) break;
    }
  }
  
  return unique;
}

// Modificar filtrado
else if (excludeMasteredOnly) {
  const now = new Date();
  
  // Aplicar ponderación según estado y fecha de revisión
  const weightedQuestions = todasLasPreguntas.map(p => {
    const tracking = questionTracking[p.id];
    if (!tracking || tracking.totalAttempts === 0) {
      return { ...p, weight: 1.0 };
    }
    
    let weight = 1.0;
    const needsReview = tracking.nextReviewDate 
      ? new Date(tracking.nextReviewDate) <= now 
      : true;
    
    if (!needsReview) {
      // Aún no toca revisar
      if (tracking.status === 'retired') weight = 0.0;
      else if (tracking.status === 'mastered') weight = 0.05;
      else weight = 0.5;
    } else {
      // Toca revisar
      if (tracking.status === 'retired') weight = 0.20;
      else if (tracking.status === 'mastered') weight = 0.40;
      else if (tracking.status === 'reviewing') weight = 0.80;
      else if (tracking.status === 'learning') weight = 1.0;
      
      // Bonus por debilidad
      if (tracking.consecutiveIncorrect >= 2) weight = 1.5;
    }
    
    return { ...p, weight };
  });
  
  // Filtrar las de peso 0
  const filteredWeighted = weightedQuestions.filter(q => q.weight > 0);
  
  preguntasParaSortear = filteredWeighted;
}
```

### Paso 2: Ajustar intervalos en `CxCProgressContext.js`

```javascript
const calculateNextReviewDate = (tracking) => {
  const { status, consecutiveCorrect, lastAttemptDate } = tracking;

  if (status === QUESTION_STATUS.NEW || !lastAttemptDate) {
    tracking.nextReviewDate = null;
    return tracking;
  }

  const lastAttempt = new Date(lastAttemptDate);
  let daysToAdd = 0;

  switch (status) {
    case QUESTION_STATUS.LEARNING:
      daysToAdd = 1; // Revisar mañana
      break;
    case QUESTION_STATUS.REVIEWING:
      daysToAdd = Math.min(2 * consecutiveCorrect, 7); // 2-7 días
      break;
    case QUESTION_STATUS.MASTERED:
      daysToAdd = 7; // Revisar en 1 semana
      break;
    case QUESTION_STATUS.RETIRED:
      daysToAdd = 14; // Revisar en 2 semanas
      break;
    default:
      daysToAdd = 1;
  }

  tracking.nextReviewDate = new Date(
    lastAttempt.getTime() + daysToAdd * 24 * 60 * 60 * 1000
  ).toISOString();
  
  return tracking;
};
```

### Paso 3: Agregar logging para debug

```javascript
console.log('📊 Distribución de pesos:', {
  retired: weightedQuestions.filter(q => q.weight === 0.20).length,
  mastered: weightedQuestions.filter(q => q.weight === 0.40).length,
  reviewing: weightedQuestions.filter(q => q.weight === 0.80).length,
  learning: weightedQuestions.filter(q => q.weight === 1.0).length,
  weak: weightedQuestions.filter(q => q.weight === 1.5).length,
  excluded: weightedQuestions.filter(q => q.weight === 0.0).length
});
```

---

## ✅ Resultado Final

Con esta implementación:

✅ **Puedes dominar preguntas** (3 correctas consecutivas)  
✅ **Puedes retirarlas** (5 correctas consecutivas)  
✅ **Siguen apareciendo ocasionalmente** (revisión espaciada)  
✅ **Balance entre eficiencia y retención** (no practicas lo mismo todo el tiempo)  
✅ **Refleja ciencia cognitiva** (curva de olvido de Ebbinghaus)  

---

**Fecha de análisis:** 19 de octubre de 2025  
**Problema:** Contradicción entre sistema de dominio y exclusión  
**Solución recomendada:** Sistema híbrido con ponderación + fechas de revisión  
**Impacto:** ⚠️ CRÍTICO - Afecta toda la progresión del usuario
