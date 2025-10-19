# 🚨 Plan de Corrección Crítica - Discrepancias de Datos

## 📋 Problemas Identificados y Soluciones

### 1. **Sistema de Puntos - 200 puntos extras sin explicar**

#### Problema:
- **Mostrado:** 530 puntos totales
- **Esperado:** 330 puntos (165 × 2 quizzes)
- **Discrepancia:** +200 puntos

#### Causas Potenciales:
1. ✅ **Puntos de logros duplicados** - Los logros se están sumando múltiples veces
2. ✅ **Bonificaciones contadas dos veces** - Las bonificaciones por velocidad/precisión se duplican
3. ✅ **Inicialización con puntos base** - El usuario nuevo recibe puntos iniciales que no deberían estar

#### Solución:
```javascript
// En updateProgressAfterQuiz - AUDITAR cálculo de puntos
let quizPoints = 0;

// 1. Puntos base SOLO por nivel y correctas
questionDetails.forEach(detail => {
  if (detail.correct) {
    const basePoints = detail.level === 'avanzado' ? 30 : 
                       detail.level === 'intermedio' ? 20 : 10;
    quizPoints += basePoints;
  }
});

// 2. Bonificaciones UNA SOLA VEZ
const scorePercentage = (correctAnswers / totalQuestions) * 100;
if (scorePercentage === 100 && totalQuestions >= 5) {
  quizPoints += 100; // Quiz perfecto
} else if (scorePercentage >= 90) {
  quizPoints += 50;
} else if (scorePercentage >= 80) {
  quizPoints += 25;
}

// 3. Bonus por velocidad SOLO si precisión >= 80%
const avgTimePerQuestion = totalTime / totalQuestions;
if (avgTimePerQuestion < 30000 && scorePercentage >= 80) {
  quizPoints += 50;
}

// 4. Logros SE SUMAN APARTE (no en el quiz)
// NO sumar aquí, solo en unlockAchievement()

console.log('💰 Desglose de puntos:', {
  basePoints: questionDetails.filter(d => d.correct).length * 20,
  bonusPrecision: scorePercentage >= 90 ? 50 : scorePercentage >= 80 ? 25 : 0,
  bonusSpeed: avgTimePerQuestion < 30000 ? 50 : 0,
  total: quizPoints
});
```

---

### 2. **Conteo de Preguntas - 5 vs 10 preguntas**

#### Problema:
- **Perfil Overview:** "5 preguntas respondidas"
- **Precisión mostrada:** "8/10" (indica 10 preguntas)
- **Real:** 2 quizzes × 5 preguntas = 10 preguntas totales

#### Causa:
```javascript
// ❌ PROBLEMA: answeredQuestions solo guarda preguntas CORRECTAS
if (isCorrect) {
  saveAnsweredQuestion(question.id);
}

// Entonces: 4 correctas en quiz 1 + 4 correctas en quiz 2 = 8 en answeredQuestions
// Pero se mostraron 10 preguntas en total (5 + 5)
```

#### Solución:
```javascript
// ✅ SEPARAR dos conceptos:
// 1. answeredQuestions = preguntas respondidas (correctas o incorrectas)
// 2. masteredQuestions = preguntas dominadas (múltiples intentos correctos)

// En recordQuestionAttempt - guardar TODAS las preguntas respondidas
const recordQuestionAttempt = (questionId, isCorrect, timeSpent, metadata) => {
  // ... código existente ...
  
  // ✅ Agregar a answeredQuestions SIEMPRE (no solo si es correcta)
  if (!prev.answeredQuestions.includes(questionId)) {
    prev.answeredQuestions.push(questionId);
  }
  
  // Las incorrectas pueden volver al pool, pero YA FUERON RESPONDIDAS
};

// En getStats()
const questionsAnswered = progress.answeredQuestions.length; // TODAS las respondidas
const masteredQuestions = Object.values(progress.questionTracking)
  .filter(t => t.status === 'mastered').length; // Solo las dominadas
```

---

### 3. **Sistema de "Dominio" - Inconsistencia en definición**

#### Problema:
- **Tab Analysis:** "0 preguntas dominadas"
- **Tab Domains:** "2/12", "2/20" preguntas dominadas

#### Causa:
Hay confusión entre:
- **Dominadas** = status === 'mastered' (requiere múltiples intentos correctos)
- **Respondidas correctamente** = correctAttempts >= 1

#### Solución:
```javascript
// ✅ CLARIFICAR estados de preguntas
const QUESTION_STATUS = {
  NEW: 'new',           // Nunca vista
  LEARNING: 'learning', // 1-2 intentos correctos
  REVIEWING: 'reviewing', // 3+ intentos correctos
  MASTERED: 'mastered',  // 5+ intentos correctos consecutivos
  RETIRED: 'retired'     // Muy fácil, no mostrar más
};

// En domainStats
domainStats[domain] = {
  attempted: 10,      // Total de preguntas intentadas
  correct: 8,         // Preguntas respondidas correctamente (al menos una vez)
  incorrect: 2,       // Preguntas con al menos un intento incorrecto
  mastered: 3,        // Preguntas con status === 'mastered'
  total: 100,         // Total de preguntas disponibles en este dominio
  accuracy: 80        // (correct / attempted) * 100
};

// En UI
<div>
  📊 {domain}
  <div>{stats.correct}/{stats.total} correctas</div>
  <div>🎓 {stats.mastered} dominadas</div>
  <div>✅ {stats.accuracy}% precisión</div>
</div>
```

---

### 4. **Registro de Intentos - 4 intentos en 2 preguntas**

#### Problema:
"Preparar Datos" muestra 4 intentos pero solo 2 preguntas (1✓ 1✗)

#### Causa:
```javascript
// ❌ PROBLEMA: recordQuestionAttempt se llama MÚLTIPLES VECES
// ResultsScreen: 5 veces (una por pregunta)
// updateProgressAfterQuiz: 5 veces MÁS (duplicado)
// Total: 10 llamadas para 5 preguntas = DUPLICACIÓN
```

#### Solución:
✅ **YA APLICADA:** Eliminar llamadas duplicadas en ResultsScreen
```javascript
// ResultsScreen.js - ANTES
results.questions.forEach(question => {
  recordQuestionAttempt(/* ... */); // ❌ Llamada duplicada
});
updateProgressAfterQuiz(/* ... */);

// ResultsScreen.js - DESPUÉS
// ✅ Solo llamar updateProgressAfterQuiz
updateProgressAfterQuiz(/* ... */); // Internamente llama a recordQuestionAttempt
```

---

### 5. **Tiempo Promedio - Todos muestran "0.0s"**

#### Problema:
- **Dominios:** Todos muestran "0.0s" de tiempo promedio
- **Quiz real:** 22 segundos totales (4.4s promedio por pregunta)

#### Causa:
```javascript
// ❌ PROBLEMA: timeSpent no se está propagando correctamente
const questionDetails = results.questions.map((question, index) => ({
  id: question.id,
  domain: question.dominio,
  level: question.nivel,
  correct: results.answers[index] === question.respuestaCorrecta,
  timeSpent: results.timeElapsed / results.questions.length // ⚠️ Promedio, no real
}));
```

#### Solución:
```javascript
// ✅ OPCIÓN 1: Capturar tiempo real por pregunta
// En QuizScreen - guardar timestamp de cada pregunta
const [questionTimestamps, setQuestionTimestamps] = useState({});

const handleAnswer = (answer) => {
  const endTime = Date.now();
  const startTime = questionTimestamps[currentQuestion];
  const timeSpent = endTime - startTime;
  
  // Guardar en results
  results.timesByQuestion[currentQuestion] = timeSpent;
};

// ✅ OPCIÓN 2: Usar promedio pero propagarlo correctamente
const avgTime = totalTime / totalQuestions;
questionDetails.forEach(detail => {
  recordQuestionAttempt(detail.id, detail.correct, avgTime, {
    domain: detail.domain,
    level: detail.level
  });
});

// En updateQuestionStatusAndConfidence
if (timeSpent > 0) {
  const totalTime = tracking.averageTimeSpent * (tracking.totalAttempts - 1);
  tracking.averageTimeSpent = (totalTime + timeSpent) / tracking.totalAttempts;
}

// En domainStats
domainStats[domain].timeSpent += timeSpent; // ✅ Acumular
domainStats[domain].avgTime = 
  domainStats[domain].timeSpent / domainStats[domain].attempted; // ✅ Recalcular
```

---

### 6. **Duplicación en Actividad Reciente**

#### Problema:
- Muestra el mismo quiz dos veces con timestamps idénticos
- Múltiples eventos `save_autosave_success`

#### Causa:
1. ✅ **Doble procesamiento en ResultsScreen** - Ya corregido
2. ✅ **Telemetry duplicado** - Ya corregido con `recentEvents` Set
3. ⚠️ **History duplicado** - Falta validación

#### Solución:
```javascript
// En updateProgressAfterQuiz
applyProgressUpdate((prev) => {
  // ✅ VERIFICAR si ya existe este quiz en history
  const recentHistory = (prev.history || []).slice(0, 5);
  const isDuplicate = recentHistory.some(h => 
    h.type === 'quiz' && 
    h.questions === totalQuestions &&
    h.correctAnswers === correctAnswers &&
    Math.abs(new Date(h.completedAt) - Date.now()) < 2000 // < 2 segundos
  );

  if (isDuplicate) {
    console.warn('⚠️ Quiz duplicado detectado en historial, ignorando actualización');
    return prev; // ✅ NO hacer cambios
  }
  
  // ... resto del código ...
});
```

---

### 7. **XP vs Puntos - Dos métricas sin explicación**

#### Problema:
- **Log:** "Puntos ganados: 165 XP ganado: 135"
- No está clara la diferencia entre XP y puntos

#### Clarificación:
```javascript
/**
 * SISTEMA DE PROGRESIÓN:
 * 
 * 1. PUNTOS (totalPoints):
 *    - Moneda del juego
 *    - Se ganan por responder correctamente
 *    - Se usan para: ayudas, desbloquear contenido, ranking
 *    - Fórmula: basePoints + bonificaciones
 * 
 * 2. XP (totalXP):
 *    - Experiencia para nivel de usuario
 *    - Solo para cálculo de nivel (1-10)
 *    - No se gasta, solo se acumula
 *    - Fórmula: puntos × 1.5 (o factor configurable)
 * 
 * Ejemplo:
 * - Quiz: 4/5 correctas, nivel intermedio
 * - Puntos base: 4 × 20 = 80 pts
 * - Bonus precisión (80%): +25 pts
 * - Bonus velocidad: +50 pts
 * - Total puntos: 155 pts
 * - Total XP: 155 × 1.5 = 232 XP
 */

const quizXP = Math.round(quizPoints * 1.5);
console.log(`💰 Ganaste ${quizPoints} puntos (para gastar) y ${quizXP} XP (para nivel)`);
```

#### Solución UI:
```javascript
// Mostrar ambos claramente
<div className="rewards">
  <div className="reward">
    <span className="icon">💰</span>
    <span className="label">Puntos</span>
    <span className="value">+{pointsEarned}</span>
    <span className="description">Para comprar ayudas</span>
  </div>
  <div className="reward">
    <span className="icon">⭐</span>
    <span className="label">XP</span>
    <span className="value">+{xpEarned}</span>
    <span className="description">Para subir de nivel</span>
  </div>
</div>
```

---

### 8. **Porcentajes de Cobertura - Extremadamente bajos**

#### Problema:
- **Cobertura:** 2%-8% con 2 quizzes completados
- **Esperado:** Mucho mayor

#### Causa:
```javascript
// ❌ PROBLEMA: Denominador incorrecto
const total = 100; // Total de preguntas en el dataset
const attempted = 2; // Preguntas respondidas en este dominio
const coverage = (attempted / total) * 100; // 2%

// Pero si el dominio solo tiene 12 preguntas:
// coverage debería ser (2/12) * 100 = 16.7%
```

#### Solución:
```javascript
// ✅ Cargar el total REAL de preguntas por dominio
import { preguntas } from '../data/preguntas';

const getTotalQuestionsByDomain = (domain) => {
  return preguntas.filter(q => q.dominio === domain).length;
};

// En domainStats
domainStats[domain] = {
  attempted: 2,
  correct: 1,
  total: getTotalQuestionsByDomain(domain), // ✅ Total REAL
  coverage: (2 / getTotalQuestionsByDomain(domain)) * 100 // ✅ Cobertura correcta
};

// Ejemplo: "preparar-datos" tiene 20 preguntas
// 2 intentadas / 20 total = 10% de cobertura ✅
```

---

## 🔧 Orden de Implementación

### Fase 1: Correcciones Críticas (YA APLICADAS ✅)
1. ✅ Eliminar duplicación en ResultsScreen
2. ✅ Prevenir doble inicialización del contexto
3. ✅ Agregar anti-duplicación en telemetry
4. ✅ Agregar validaciones en getStats()

### Fase 2: Correcciones de Datos (SIGUIENTE)
5. ⚠️ Corregir conteo de preguntas (answeredQuestions)
6. ⚠️ Corregir cálculo de puntos (auditoría completa)
7. ⚠️ Agregar tiempo real por pregunta
8. ⚠️ Clarificar sistema de "dominio"

### Fase 3: Mejoras de UI (DESPUÉS)
9. ⚠️ Mostrar XP vs Puntos claramente
10. ⚠️ Corregir porcentajes de cobertura
11. ⚠️ Agregar tooltips explicativos

---

## 🧪 Plan de Testing Post-Corrección

### Test 1: Verificar Puntos
```
1. Resetear datos (localStorage.clear())
2. Completar Quiz 1: 5 preguntas, 4 correctas (80%), nivel intermedio
3. Verificar puntos:
   - Base: 4 × 20 = 80 pts
   - Bonus 80%: +25 pts
   - Total esperado: 105 pts (sin bonus velocidad)
4. Completar Quiz 2: mismo resultado
5. Total esperado: 210 pts
```

### Test 2: Verificar Preguntas
```
1. Quiz 1: 5 preguntas (3 correctas, 2 incorrectas)
2. Verificar:
   - questionsAnswered: 5 ✅
   - correctAnswers: 3 ✅
   - answeredQuestions.length: 5 ✅ (no 3)
3. Quiz 2: 5 preguntas más (4 correctas, 1 incorrecta)
4. Verificar:
   - questionsAnswered: 10 ✅
   - correctAnswers: 7 ✅
```

### Test 3: Verificar No Duplicación
```
1. Abrir DevTools Console
2. Completar un quiz
3. Verificar que en logs:
   - recordQuestionAttempt: 5 llamadas ✅
   - updateProgressAfterQuiz: 1 llamada ✅
   - NO aparezca "Quiz duplicado detectado" ✅
4. Verificar history:
   - Solo 1 entrada del quiz ✅
```

---

## 📊 Métricas de Éxito

### Antes de Correcciones:
- ❌ Puntos: 530 (inflados)
- ❌ Preguntas: 5 (debería ser 10)
- ❌ Intentos: 4 en 2 preguntas (duplicado)
- ❌ Tiempo: 0.0s (no se propaga)
- ❌ History: 2 entradas idénticas

### Después de Correcciones:
- ✅ Puntos: ~330 (2 quizzes × 165 pts)
- ✅ Preguntas: 10 (todas las respondidas)
- ✅ Intentos: 2 por dominio (sin duplicar)
- ✅ Tiempo: 4.4s promedio
- ✅ History: 2 entradas únicas

