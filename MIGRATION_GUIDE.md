# 📚 Guía de Migración: Sistema Centralizado de Progreso

## 🎯 Objetivo de la Migración

Esta guía documenta la migración del sistema de gestión de progreso hacia una **arquitectura centralizada** que utiliza **CxCProgressContext** como **única fuente de verdad** (Single Source of Truth).

---

## ⚠️ Archivos DEPRECATED

Los siguientes archivos están marcados como **obsoletos** y **NO deben usarse** en código nuevo:

### ❌ `src/utils/progressManager.js`
- **Estado**: DEPRECATED
- **Razón**: Múltiples fuentes de datos causaban inconsistencias
- **Alternativa**: `useCxCProgress()` de `CxCProgressContext`

### ❌ `src/utils/questionTracker.js`
- **Estado**: DEPRECATED
- **Razón**: Lógica duplicada y conflictos con el estado centralizado
- **Alternativa**: `useCxCProgress()` de `CxCProgressContext`

---

## ✅ Nueva Arquitectura

### Flujo de Datos Centralizado

```
┌─────────────────────┐
│  Componente UI      │
│  (ResultsScreen,    │
│   QuizScreen, etc)  │
└──────────┬──────────┘
           │
           │ 1. Lee estado mediante hook
           ▼
┌─────────────────────────────────┐
│  useCxCProgress()               │
│  (Hook del Contexto)            │
└──────────┬──────────────────────┘
           │
           │ 2. Despacha acción
           ▼
┌─────────────────────────────────┐
│  CxCProgressContext             │
│  (Reducer + Estado en Memoria)  │
└──────────┬──────────────────────┘
           │
           │ 3. Efecto secundario (autosave)
           ▼
┌─────────────────────────────────┐
│  progressService.saveProgress() │
│  (Capa de Persistencia)         │
└──────────┬──────────────────────┘
           │
           │ 4. Escribe en almacenamiento
           ▼
┌─────────────────────────────────┐
│  IndexedDB + localStorage       │
│  (Almacenamiento del Navegador) │
└─────────────────────────────────┘
```

---

## 🔄 Guía de Migración de Código

### 1. Importar el Hook del Contexto

#### ❌ Antes (DEPRECATED)
```javascript
import { progressManager } from '../utils/progressManager';
import { questionTracker } from '../utils/questionTracker';
```

#### ✅ Ahora (RECOMENDADO)
```javascript
import { useCxCProgress } from '../contexts/CxCProgressContext';
```

---

### 2. Usar el Hook en el Componente

#### ❌ Antes
```javascript
const MyComponent = () => {
  useEffect(() => {
    progressManager.addPoints(100);
    questionTracker.recordAttempt('q1', true, 30);
  }, []);
  
  const stats = progressManager.getStats();
  
  return <div>Puntos: {stats.totalPoints}</div>;
};
```

#### ✅ Ahora
```javascript
const MyComponent = () => {
  const { 
    addPoints, 
    recordQuestionAttempt, 
    getStats,
    progress 
  } = useCxCProgress();
  
  useEffect(() => {
    addPoints(100);
    recordQuestionAttempt('q1', true, 30);
  }, [addPoints, recordQuestionAttempt]);
  
  const stats = getStats();
  
  return <div>Puntos: {stats?.totalPoints || progress?.totalPoints || 0}</div>;
};
```

---

## 📋 Tabla de Migración de Funciones

### ProgressManager → useCxCProgress

| Función Antigua (DEPRECATED) | Nueva Función (Contexto) | Notas |
|------------------------------|--------------------------|-------|
| `progressManager.addPoints(pts)` | `addPoints(pts)` | ✅ Migrado |
| `progressManager.addXP(xp)` | `addXP(xp)` | ✅ Migrado |
| `progressManager.updateDomainStats(domain, stats)` | `updateDomainStats(domain, stats)` | ✅ Migrado |
| `progressManager.updateLevelStats(level, stats)` | `updateLevelStats(level, stats)` | ✅ Migrado |
| `progressManager.saveAnsweredQuestion(id)` | `saveAnsweredQuestion(id)` | ✅ Migrado |
| `progressManager.getAnsweredQuestions()` | `getAnsweredQuestions()` | ✅ Migrado |
| `progressManager.isQuestionAnswered(id)` | `isQuestionAnswered(id)` | ✅ Migrado |
| `progressManager.updateProgressAfterQuiz(results)` | `updateProgressAfterQuiz(results)` | ✅ Migrado |
| `progressManager.getStats()` | `getStats()` | ✅ Migrado |
| `progressManager.resetProgress()` | `resetProgress()` | ✅ Migrado (async) |
| `progressManager.getProgress()` | `progress` (del hook) | Acceso directo al estado |

### QuestionTracker → useCxCProgress

| Función Antigua (DEPRECATED) | Nueva Función (Contexto) | Notas |
|------------------------------|--------------------------|-------|
| `questionTracker.recordAttempt(id, correct, time, meta)` | `recordQuestionAttempt(id, correct, time, meta)` | ✅ Migrado |
| `questionTracker.getQuestionTracking(id)` | `getQuestionTracking(id)` | ✅ Migrado |
| `questionTracker.getAllTracking()` | `getAllQuestionsTracking()` | ✅ Migrado |
| `questionTracker.getOverallStats()` | `getQuestionTrackingStats()` | ✅ Migrado |

---

## 🔧 Constantes Exportadas

Las siguientes constantes ahora se exportan desde `CxCProgressContext`:

```javascript
import { 
  ACHIEVEMENT_TYPES, 
  LEVEL_THRESHOLDS,
  QUESTION_STATUS,
  CONFIDENCE_LEVELS,
  MASTERY_CONFIG
} from '../contexts/CxCProgressContext';
```

---

## 🎓 Ejemplos de Casos de Uso

### Caso 1: Registrar Resultado de Quiz

#### ❌ Antes
```javascript
import { progressManager } from '../utils/progressManager';
import { questionTracker } from '../utils/questionTracker';

const ResultsScreen = ({ results }) => {
  useEffect(() => {
    results.questions.forEach((q, i) => {
      const isCorrect = results.answers[i] === q.respuestaCorrecta;
      
      questionTracker.recordAttempt(q.id, isCorrect, 30, {
        domain: q.dominio,
        level: q.nivel
      });
      
      progressManager.saveAnsweredQuestion(q.id);
      
      if (isCorrect) {
        progressManager.addPoints(20);
      }
    });
  }, [results]);
  
  return <div>...</div>;
};
```

#### ✅ Ahora
```javascript
import { useCxCProgress } from '../contexts/CxCProgressContext';

const ResultsScreen = ({ results }) => {
  const {
    recordQuestionAttempt,
    saveAnsweredQuestion,
    addPoints
  } = useCxCProgress();
  
  useEffect(() => {
    results.questions.forEach((q, i) => {
      const isCorrect = results.answers[i] === q.respuestaCorrecta;
      
      recordQuestionAttempt(q.id, isCorrect, 30, {
        domain: q.dominio,
        level: q.nivel
      });
      
      saveAnsweredQuestion(q.id);
      
      if (isCorrect) {
        addPoints(20);
      }
    });
  }, [results, recordQuestionAttempt, saveAnsweredQuestion, addPoints]);
  
  return <div>...</div>;
};
```

---

### Caso 2: Mostrar Estadísticas en Perfil

#### ❌ Antes
```javascript
import { progressManager, LEVEL_THRESHOLDS } from '../utils/progressManager';

const ProfileScreen = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    const currentStats = progressManager.getStats();
    setStats(currentStats);
  }, []);
  
  return (
    <div>
      <h2>Nivel {stats?.levelInfo?.level}</h2>
      <p>Puntos: {stats?.totalPoints}</p>
    </div>
  );
};
```

#### ✅ Ahora
```javascript
import { useCxCProgress, LEVEL_THRESHOLDS } from '../contexts/CxCProgressContext';

const ProfileScreen = () => {
  const { getStats, progress } = useCxCProgress();
  const stats = getStats();
  
  return (
    <div>
      <h2>Nivel {stats?.levelInfo?.level}</h2>
      <p>Puntos: {stats?.totalPoints || progress?.totalPoints || 0}</p>
    </div>
  );
};
```

---

### Caso 3: Filtrar Preguntas No Respondidas

#### ❌ Antes
```javascript
import { progressManager } from '../utils/progressManager';

const QuizScreen = ({ quizConfig }) => {
  useEffect(() => {
    const answeredIds = progressManager.getAnsweredQuestions();
    const filtered = getFilteredQuestions(
      quizConfig.domain,
      quizConfig.level,
      quizConfig.count,
      answeredIds
    );
    setQuestions(filtered);
  }, [quizConfig]);
};
```

#### ✅ Ahora
```javascript
import { useCxCProgress } from '../contexts/CxCProgressContext';

const QuizScreen = ({ quizConfig }) => {
  const { getAnsweredQuestions } = useCxCProgress();
  
  useEffect(() => {
    const answeredIds = getAnsweredQuestions();
    const filtered = getFilteredQuestions(
      quizConfig.domain,
      quizConfig.level,
      quizConfig.count,
      answeredIds
    );
    setQuestions(filtered);
  }, [quizConfig, getAnsweredQuestions]);
};
```

---

## 🚀 Beneficios de la Nueva Arquitectura

### 1. ✅ Única Fuente de Verdad
- **Antes**: `progressManager` y `questionTracker` escribían directamente en `localStorage`
- **Ahora**: Todo pasa por `CxCProgressContext` → garantiza consistencia

### 2. 🔄 Sincronización Multi-Pestaña
- **Antes**: Cambios en una pestaña no se reflejaban en otras
- **Ahora**: `progressService` sincroniza automáticamente entre pestañas vía `BroadcastChannel`

### 3. 💾 Persistencia Robusta
- **Antes**: Solo `localStorage` (límite de 5-10 MB)
- **Ahora**: `IndexedDB` (sin límites prácticos) + `localStorage` como fallback

### 4. ⚡ Auto-guardado Inteligente
- **Antes**: Guardado manual o al cerrar
- **Ahora**: Auto-guardado con debounce de 3 segundos + retry automático

### 5. 🔍 Validación y Sanitización
- **Antes**: Datos corruptos causaban errores silenciosos
- **Ahora**: `progressValidator` + funciones de sanitización previenen inconsistencias

### 6. 📊 Telemetría y Observabilidad
- **Antes**: Sin logs estructurados
- **Ahora**: `telemetryService` emite eventos para debugging y analytics

---

## ⚙️ Configuración Necesaria

### Wrap de la App con el Provider

Asegúrate de que tu aplicación esté envuelta en `CxCProgressProvider`:

```javascript
// src/CxCApp.js o src/App.js
import { CxCProgressProvider } from './contexts/CxCProgressContext';

function App() {
  return (
    <CxCProgressProvider>
      {/* Tu aplicación aquí */}
      <HomeScreen />
      <QuizScreen />
      <ResultsScreen />
    </CxCProgressProvider>
  );
}
```

---

## 🛠️ Troubleshooting

### Problema: "useCxCProgress must be used within CxCProgressProvider"
**Solución**: Asegúrate de que el componente esté dentro de `<CxCProgressProvider>`

### Problema: Los datos no se guardan
**Solución**: Verifica que no haya errores en la consola del `progressService`. Revisa que IndexedDB esté habilitado en el navegador.

### Problema: Datos antiguos persisten
**Solución**: Llama a `resetProgress()` desde el contexto o limpia el almacenamiento manualmente:
```javascript
localStorage.clear();
indexedDB.deleteDatabase('cxcc_app_v1');
```

---

## 📝 Checklist de Migración

Para migrar un componente nuevo o existente:

- [ ] Eliminar imports de `progressManager` y `questionTracker`
- [ ] Importar `useCxCProgress` desde `CxCProgressContext`
- [ ] Reemplazar todas las llamadas a métodos antiguos con funciones del hook
- [ ] Añadir dependencias del hook en arrays de dependencias de `useEffect`
- [ ] Verificar que no haya advertencias de deprecación en consola
- [ ] Probar que los datos se persistan correctamente
- [ ] Actualizar tests si existen

---

## 🎉 Estado de la Migración

### ✅ Componentes Migrados
- [x] `ResultsScreen.js`
- [x] `QuizScreen.js`
- [x] `ProfileScreen.js`
- [x] `HomeScreen.js`

### ⚠️ Componentes Pendientes
- [ ] `ProfileScreenEnhanced.old.js` (puede eliminarse)
- [ ] Otros componentes que importen `progressManager` o `questionTracker`

### 🔧 Utils Pendientes
- [ ] `quizIntegration.js` - Necesita refactorización para recibir contexto
- [ ] `questionScorer.js` - Necesita refactorización para recibir contexto
- [ ] `questionCounter.js` - Puede seguir usando `localStorage` temporalmente

---

## 📞 Soporte

Si tienes dudas sobre la migración, consulta:
- Este documento (`MIGRATION_GUIDE.md`)
- Código de ejemplo en componentes ya migrados
- Comentarios `@deprecated` en archivos antiguos
- `CxCProgressContext.js` para la API completa

---

**Última actualización**: Octubre 15, 2025
**Versión del sistema**: 2.0 (Arquitectura Centralizada)
