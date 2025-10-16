# 🧪 Guía de Pruebas - Sistema de Engagement Fase 1

## 🎯 Objetivo
Verificar que las métricas avanzadas (racha, FSRS, ZPD, exam readiness) se calculan correctamente después de completar quizzes.

---

## ✅ Prueba 1: Completar Primer Quiz

### Pasos:
1. Abrir la aplicación
2. Navegar a **Quiz** / **Examen**
3. Seleccionar configuración:
   - Dominio: Cualquiera (ej: "Preparar los datos")
   - Nivel: Mixto o específico
   - Número de preguntas: 5-10
4. Responder todas las preguntas
5. Ver pantalla de resultados

### Verificaciones:

#### En Console (F12):
```
✅ Buscar mensajes:
"✅ Progreso actualizado correctamente (CONTEXTO CENTRALIZADO)"
"quiz_completed" en telemetría
```

#### En Pantalla de Resultados:
```
✅ Debe mostrar:
- Puntuación (ej: 70%)
- Preguntas correctas/total
- Tiempo transcurrido
- Estadísticas por dominio
```

#### En ProfileScreen (Navegar a Perfil):
```
✅ Verificar que NO sean 0:
- Puntos totales: [número] puntos
- XP total: [número] XP
- Nivel actual: [Novato/Aprendiz/etc]
- Racha de días: 1 día ← ⭐ IMPORTANTE
- Quizzes completados: 1 ← ⭐ IMPORTANTE
- Preguntas respondidas: [5-10] ← ⭐ IMPORTANTE
- Precisión global: [%] ← ⭐ IMPORTANTE
```

#### En React DevTools:
1. Abrir DevTools (F12) → pestaña "Components"
2. Buscar `CxCProgressProvider` en el árbol
3. Expandir `hooks` → `State`
4. Verificar:
   ```javascript
   state: {
     totalPoints: [número > 0],
     totalXP: [número > 0],
     history: [ // ⭐ Debe tener 1 objeto
       {
         type: 'quiz',
         score: [...],
         totalQuestions: [...],
         correctAnswers: [...],
         completedAt: '2024-...',
         ...
       }
     ],
     streakDays: 1, // ⭐ IMPORTANTE
     lastActivity: '2024-...', // ⭐ Fecha de hoy
     ...
   }
   ```

---

## ✅ Prueba 2: Racha de Días Consecutivos

### Día 1 (HOY):
1. Completar quiz (ya hecho en Prueba 1)
2. Verificar: `streakDays = 1`

### Día 2 (MAÑANA):
1. Completar otro quiz
2. Verificar: `streakDays = 2` ⭐
3. Verificar: `maxStreak = 2` ⭐

### Día 3 (PASADO MAÑANA):
1. **NO completar quiz** (saltar día)
2. Al día siguiente, verificar: `streakDays = 0` (reset)

### Día 4:
1. Completar quiz
2. Verificar: `streakDays = 1` (nueva racha)
3. Verificar: `maxStreak = 2` (mantiene el récord)

---

## ✅ Prueba 3: Métricas FSRS y ZPD

### Completar 10-15 Quizzes:
```
Para ver métricas significativas de FSRS y ZPD:
- Responder al menos 15-20 preguntas únicas
- Variar precisión (responder algunas mal intencionalmente)
- Completar en varios días
```

### Verificar en ProfileScreen:

#### Retención FSRS:
```
✅ Retención promedio: [60-95]%
✅ Estabilidad promedio: [7-20] días
✅ Preguntas dominadas: [número]
✅ Revisiones pendientes: [número]
```

#### Zona de Desarrollo Próximo:
```
✅ Zona de Confort (>90%): [%]
✅ ZPD (60-90%): [%] ← Debe ser la mayor %
✅ Zona Desafiante (<60%): [%]
```

**Interpretación**:
- ZPD alto (60%+) = Estás en zona óptima de aprendizaje 🎯
- Comfort Zone alto = Preguntas muy fáciles, necesitas más desafío
- Challenging alto = Preguntas muy difíciles, revisar fundamentos

---

## ✅ Prueba 4: Preparación para Examen

### Responder 30+ Preguntas:
```
Objetivo: Ver cómo sube el % de preparación
```

### Fórmula:
```javascript
examReadiness = (questionsAnswered/100 * 60%) + (accuracy/100 * 40%)
```

### Ejemplos:

#### Escenario A: Muchas preguntas, baja precisión
```
- 50 preguntas respondidas
- 60% precisión
→ examReadiness = (50/100 * 0.6) + (60/100 * 0.4)
                 = 0.3 + 0.24
                 = 54% ← "En desarrollo" 📈
→ daysToReady = ~15 días
→ confidence = { level: 'En desarrollo', icon: '📈', color: 'yellow' }
```

#### Escenario B: Pocas preguntas, alta precisión
```
- 30 preguntas respondidas
- 90% precisión
→ examReadiness = (30/100 * 0.6) + (90/100 * 0.4)
                 = 0.18 + 0.36
                 = 54% ← "En desarrollo" 📈
```

#### Escenario C: Listo para examen
```
- 90 preguntas respondidas
- 85% precisión
→ examReadiness = (90/100 * 0.6) + (85/100 * 0.4)
                 = 0.54 + 0.34
                 = 88% ← "Alta" 🌟
→ daysToReady = ~3 días
→ confidence = { level: 'Alta', icon: '🌟', color: 'green' }
```

### Verificar en ProfileScreen:
```
✅ Preparación para Examen: [%]
✅ Días estimados: [número] días
✅ Confianza: [Alta/Buena/En desarrollo/Iniciando] [icon]
```

---

## ✅ Prueba 5: Verificación en Console del Estado

### Abrir Console y ejecutar:

```javascript
// 1. Ver estado completo
JSON.parse(localStorage.getItem('cxc-progress'))

// 2. Verificar history
JSON.parse(localStorage.getItem('cxc-progress')).history

// 3. Verificar racha
JSON.parse(localStorage.getItem('cxc-progress')).streakDays

// 4. Verificar questionTracking
JSON.parse(localStorage.getItem('cxc-progress')).questionTracking

// 5. Calcular stats manualmente (opcional)
const progress = JSON.parse(localStorage.getItem('cxc-progress'));
console.table({
  totalPoints: progress.totalPoints,
  totalXP: progress.totalXP,
  questionsAnswered: progress.answeredQuestions.length,
  quizzesTaken: progress.history.filter(h => h.type === 'quiz').length,
  streakDays: progress.streakDays,
  lastActivity: progress.lastActivity
});
```

### Resultado Esperado:
```javascript
{
  totalPoints: 750,
  totalXP: 450,
  questionsAnswered: 15,
  quizzesTaken: 2,
  streakDays: 1, // ⭐ Si completaste quiz hoy
  lastActivity: '2024-XX-XXT...' // ⭐ Fecha de hoy
}
```

---

## 🐛 Troubleshooting

### Problema: streakDays siempre es 0
**Causas posibles**:
1. `history` array está vacío
2. `lastActivity` no se actualiza
3. `recordQuizCompletion()` no se llama

**Solución**:
```javascript
// Verificar en console:
const progress = JSON.parse(localStorage.getItem('cxc-progress'));
console.log('History:', progress.history);
console.log('Last Activity:', progress.lastActivity);

// Si history está vacío → recordQuizCompletion() no se está llamando
// Verificar ResultsScreen línea 127-136
```

### Problema: quizzesTaken es 0 pero hay history
**Causa**:
- Objetos en `history` no tienen `type: 'quiz'`

**Solución**:
```javascript
// Verificar estructura de history:
const progress = JSON.parse(localStorage.getItem('cxc-progress'));
progress.history.forEach((h, i) => {
  console.log(`History[${i}]:`, h.type, h);
});

// Debe mostrar: type: 'quiz'
```

### Problema: examReadiness es NaN o undefined
**Causa**:
- Division por cero
- answeredQuestions está vacío

**Solución**:
```javascript
// Verificar:
const progress = JSON.parse(localStorage.getItem('cxc-progress'));
console.log('Answered:', progress.answeredQuestions.length);

// Si es 0 → Completar más quizzes
```

### Problema: avgRetention es 0 pero hay preguntas
**Causa**:
- `questionTracking` no tiene datos FSRS
- `stability` o `retrievability` no se calculan

**Solución**:
```javascript
// Verificar questionTracking:
const progress = JSON.parse(localStorage.getItem('cxc-progress'));
const tracking = Object.values(progress.questionTracking);
console.log('Tracking:', tracking.slice(0, 3)); // Primeras 3

// Debe tener: correctAttempts, totalAttempts, stability
```

---

## 📊 Resultados Esperados - Resumen

### Después de 1 Quiz (5-10 preguntas):
```
totalPoints: 100-400
totalXP: 60-240
currentLevel: "Novato" o "Aprendiz"
questionsAnswered: 5-10
quizzesTaken: 1 ⭐
streakDays: 1 ⭐
globalAccuracy: 40-100%
avgRetention: 50-90%
examReadiness: 5-20%
daysToReady: 30-60 días
confidence: "Iniciando" 🌱
```

### Después de 5 Quizzes (25-50 preguntas):
```
totalPoints: 500-2000
totalXP: 300-1200
currentLevel: "Aprendiz" o "Estudiante"
questionsAnswered: 25-50
quizzesTaken: 5 ⭐
streakDays: 1-5 (dependiendo de días consecutivos) ⭐
globalAccuracy: 60-85%
avgRetention: 65-85%
comfortZone: 15-30%
zpd: 50-70% ⭐ (óptimo)
challenging: 15-30%
mastered: 5-15
examReadiness: 20-45%
daysToReady: 15-30 días
confidence: "En desarrollo" 📈
```

### Después de 20 Quizzes (80-100 preguntas):
```
totalPoints: 3500-5000
totalXP: 2100-3000
currentLevel: "Profesional" o "Experto"
questionsAnswered: 80-100
quizzesTaken: 20 ⭐
streakDays: 1-30 (récord personal) ⭐
globalAccuracy: 75-95%
avgRetention: 80-95%
comfortZone: 40-60%
zpd: 30-40%
challenging: 10-20%
mastered: 30-60
dueReviews: 10-20
examReadiness: 75-95% ⭐
daysToReady: 1-10 días ⭐
confidence: "Alta" o "Buena" 🌟✨
```

---

## ✅ Checklist de Pruebas

- [ ] Completé al menos 1 quiz
- [ ] ProfileScreen muestra `streakDays = 1`
- [ ] ProfileScreen muestra `quizzesTaken = 1`
- [ ] ProfileScreen muestra `questionsAnswered > 0`
- [ ] ProfileScreen muestra `globalAccuracy %`
- [ ] Console muestra "✅ Progreso actualizado"
- [ ] localStorage tiene `history[]` con 1 objeto
- [ ] `lastActivity` es fecha de hoy
- [ ] Completé quiz 2 días seguidos → `streakDays = 2`
- [ ] Salté 1 día → `streakDays = 0` (reset)
- [ ] Después de 15+ preguntas veo métricas FSRS
- [ ] `avgRetention` muestra %
- [ ] `avgStability` muestra días
- [ ] ZPD muestra % (comfort/zpd/challenging)
- [ ] `examReadiness` muestra %
- [ ] `daysToReady` muestra días estimados
- [ ] `confidence` muestra nivel con emoji

---

## 🎉 Siguiente Paso

Una vez que **todas las pruebas pasen** ✅:

1. **Reportar resultados**: Indicar qué métricas funcionan correctamente
2. **Identificar bugs**: Si algo no funciona como esperado
3. **Proceder a Fase 2**: Expandir logros de 8 → 25+
4. **Proceder a Fase 3**: Crear componente `AchievementUnlocked` con animaciones

---

**Fecha**: ${new Date().toLocaleDateString()}
**Sistema**: CxC Progress - Testing Guide
**Fase**: 1 de 3
