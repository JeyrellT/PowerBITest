# 🔍 Diagnóstico del Sistema de Carga (Loading)

## 📋 Resumen del Problema

**Síntoma reportado:**
- HomeScreen muestra datos correctos (50 quizzes, 655K puntos)
- ProfileScreen muestra todo en ceros

## 🔎 Análisis del Código

### 1. Sistema de Loading en CxCProgressContext

```javascript
// Inicialización (línea 756-769)
const [progress, setProgress] = useState({
  totalPoints: 0,
  totalXP: 0,
  answeredQuestions: [],
  // ... estructura inicial con valores en 0
});

const [loading, setLoading] = useState(true);  // ✅ Inicia en true
```

**Flujo de Carga:**
1. ✅ `progress` inicia con objeto por defecto (todos los valores en 0)
2. ✅ `loading` inicia en `true`
3. ✅ `useEffect` llama `initProgress()` (línea 787)
4. ✅ `setLoading(true)` al inicio (línea 789)
5. ✅ `progressService.loadProgress()` carga desde localStorage (línea 790)
6. ✅ `setProgress(sanitizedProgress)` actualiza con datos reales (línea 818)
7. ✅ `setLoading(false)` en finally (línea 850)

### 2. Exportación del Loading Flag

**✅ CONFIRMADO: loading SÍ está exportado**

```javascript
// Línea 2055-2065
const value = {
  // Estado principal
  progress: progress ? { ...progress } : null,
  loading,        // ✅ Exportado
  saving,         // ✅ Exportado
  lastSaved,      // ✅ Exportado
  userId,
  dirty,
  // ... funciones
};
```

### 3. Uso en HomeScreen (FUNCIONA ✅)

```javascript
const { getStats, state } = useCxCProgress();

useEffect(() => {
  const stats = getStats();  // ❌ NO verifica loading
  setUserStats(stats);
}, [getStats, state.totalPoints, state.totalXP]);
```

**¿Por qué funciona?**
1. Se ejecuta inmediatamente → obtiene valores iniciales (0)
2. Cuando `state.totalPoints` cambia (de 0 a 655K) → se dispara de nuevo
3. Llama `getStats()` otra vez → obtiene valores actualizados ✅

### 4. Uso en ProfileScreen (MUESTRA CEROS ❌)

```javascript
const { getStats, state, loading } = useCxCProgress();

useEffect(() => {
  if (!loading) {  // ✅ Espera a que termine de cargar
    loadStats();
  }
}, [loading]);

useEffect(() => {
  if (!loading) {
    loadStats();
  }
}, [loading, state.totalPoints, state.totalXP, state.currentLevel, ...]);

const loadStats = () => {
  const currentStats = getStats();
  if (currentStats) {
    setStats(currentStats);
  }
};
```

**¿Por qué NO funciona?**

## 🐛 HIPÓTESIS DEL BUG

### Teoría 1: Race Condition con Loading
- `loading` cambia de `true` a `false`
- Se dispara el useEffect
- `getStats()` se llama ANTES de que `progress` se actualice
- Devuelve los valores iniciales (0)
- El segundo useEffect NO se dispara porque `state.totalPoints` ya es el valor real

**❌ DESCARTADA**: El useEffect tiene múltiples dependencias (`state.totalPoints`, etc.) que deberían dispararlo cuando cambien.

### Teoría 2: localStorage Corrupto
El usuario mencionó "tengo datos corruptos" (655K puntos inflados).

**Datos corruptos detectados:**
- `totalPoints`: 655,000 (inflado)
- `quizzesTaken`: 50 (correcto)
- `domainStats.attempted`: 15892 (inflado, máximo debería ser 12)

**Sanitización implementada (línea 795-810):**
```javascript
// Si points.total está inflado (>5000), resetear a 0
const oldPointsTotal = storedProgress.progress.points?.total || 0;
if (oldPointsTotal > 5000) {
  console.warn('⚠️ Datos inflados detectados. Reseteando puntos desde:', oldPointsTotal);
  totalPoints = 0;  // ✅ Resetear porque están inflados
}
```

### ✅ TEORÍA 3: Datos Sanitizados a 0 (PROBABLE)

**Causa Raíz:**
1. Usuario tiene datos corruptos en localStorage (655K puntos)
2. Sistema detecta inflación (`points.total > 5000`)
3. Sanitiza resetando `totalPoints` a 0
4. ProfileScreen carga cuando ya están sanitizados → muestra 0 ✅
5. HomeScreen carga después y también muestra 0... PERO el usuario dice que HomeScreen muestra 655K 🤔

### Teoría 4: Dos Fuentes de Datos Diferentes

El usuario mencionó: **"tengo 2 perfiles, uno para la teoria que va ligada a las preguntas y otro que va ligado al juego"**

**Posible explicación:**
- HomeScreen usa datos del perfil de "teoría/quizzes"
- ProfileScreen usa datos del perfil de "juego/misiones" (CxC)
- Son dos sistemas separados con diferentes fuentes de localStorage

**Investigar:**
- ¿HomeScreen lee de un localStorage key diferente?
- ¿ProfileScreen muestra stats de misiones en lugar de quizzes?

## 🔧 Próximos Pasos de Diagnóstico

### 1. Verificar Valores Actuales en localStorage
```javascript
// Ejecutar en consola del navegador
const data = JSON.parse(localStorage.getItem('cxc-progress'));
console.log('totalPoints:', data?.progress?.totalPoints);
console.log('answeredQuestions:', data?.progress?.answeredQuestions?.length);
console.log('history:', data?.progress?.history?.length);
console.log('domainStats:', data?.progress?.domainStats);
```

### 2. Agregar Logs Detallados en loadStats
```javascript
const loadStats = () => {
  console.log('🔍 ProfileScreen.loadStats() ejecutándose');
  console.log('   loading:', loading);
  console.log('   state.totalPoints:', state.totalPoints);
  console.log('   state.answeredQuestions:', state.answeredQuestions?.length);
  
  const currentStats = getStats();
  console.log('   getStats() devolvió:', currentStats);
  
  if (currentStats) {
    setStats(currentStats);
  } else {
    console.warn('⚠️ getStats() devolvió null');
  }
};
```

### 3. Verificar si HomeScreen y ProfileScreen usan el mismo Context
```javascript
// En HomeScreen y ProfileScreen
const context = useCxCProgress();
console.log('Context en HomeScreen:', context === window.__DEBUG_CONTEXT);
window.__DEBUG_CONTEXT = context;
```

### 4. Limpiar localStorage y Empezar de Nuevo
```javascript
localStorage.removeItem('cxc-progress');
location.reload();
```

## 📊 Estado Actual del Sistema

### ✅ Implementaciones Correctas
1. Loading flag exportado del Provider
2. ProfileScreen verifica loading antes de renderizar
3. Sanitización de datos inflados implementada
4. Validaciones en getStats() para detectar inconsistencias

### ❌ Problemas Pendientes
1. ProfileScreen muestra ceros (causa raíz desconocida)
2. Inflación de domainStats.attempted (15892/12)
3. Entender separación de "2 perfiles" (teoría vs juego)

### 🔄 En Investigación
- ¿Por qué HomeScreen muestra datos correctos y ProfileScreen no?
- ¿Son dos sistemas de progreso separados?
- ¿Los datos sanitizados causan el reset a 0?

---

**Fecha:** ${new Date().toLocaleString()}
**Contexto:** Diagnóstico post-corrección de duplicaciones en ResultsScreen
