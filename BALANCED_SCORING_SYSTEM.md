# 🎯 Sistema de Puntuación Balanceado - PL-300

## 📊 Análisis del Sistema

### Datos Base
- **Total de preguntas disponibles**: 100
- **Distribución por nivel**:
  - Principiante: 22 preguntas (22%)
  - Intermedio: 25 preguntas (25%)
  - Avanzado: 53 preguntas (53%)

### Objetivo del Sistema
Crear un sistema donde:
- Responder **todas las 100 preguntas perfectamente** = Nivel 10 (Divinidad)
- Cada pregunta vale puntos proporcionales a su dificultad
- Los bonos por racha y velocidad son significativos pero no dominantes
- El progreso es gradual y motivante

---

## 🎮 Nuevo Sistema de Niveles

### Cálculo de Puntos Totales Posibles

**Puntos Base por Nivel de Dificultad:**
```
Principiante: 15 puntos base × 22 preguntas = 330 puntos
Intermedio:   25 puntos base × 25 preguntas = 625 puntos  
Avanzado:     40 puntos base × 53 preguntas = 2,120 puntos
─────────────────────────────────────────────────────────
TOTAL PUNTOS BASE: 3,075 puntos
```

**Con Bonos Máximos (velocidad, primera vez, racha):**
- Estimado con bonos realistas: ~5,000 puntos máximos
- **Meta para Divinidad (Nivel 10): 5,000 puntos**

### Umbrales de Nivel Balanceados

| Nivel | Nombre | Puntos Requeridos | % del Total | Preguntas Estimadas |
|-------|--------|-------------------|-------------|---------------------|
| 1 | 🌱 Novato | 0 | 0% | 0 preguntas |
| 2 | 📚 Aprendiz | 100 | 2% | ~5-7 preguntas |
| 3 | 🎓 Estudiante | 300 | 6% | ~15-18 preguntas |
| 4 | 💼 Competente | 600 | 12% | ~25-30 preguntas |
| 5 | ⭐ Profesional | 1,000 | 20% | ~40-45 preguntas |
| 6 | 🏆 Experto | 1,600 | 32% | ~55-60 preguntas |
| 7 | 👑 Maestro | 2,400 | 48% | ~70-75 preguntas |
| 8 | 💎 Gran Maestro | 3,300 | 66% | ~85-90 preguntas |
| 9 | 🌟 Leyenda | 4,200 | 84% | ~95-98 preguntas |
| 10 | ✨ Divinidad | 5,000 | 100% | 100 preguntas (perfecto) |

---

## 💰 Sistema de Puntuación por Pregunta

### Puntos Base (Reducidos)
```javascript
BASE_POINTS: {
  principiante: 15,  // Reducido de 10
  intermedio: 25,    // Reducido de 15
  avanzado: 40       // Reducido de 20
}
```

### Multiplicadores de Velocidad (Ajustados)
```javascript
SPEED_MULTIPLIERS: {
  VERY_FAST: 1.3,    // < 15 seg (antes 1.5)
  FAST: 1.2,         // 15-30 seg (antes 1.3)
  NORMAL: 1.0,       // 30-60 seg
  SLOW: 0.9,         // 60-120 seg (antes 0.8)
  VERY_SLOW: 0.8     // > 120 seg (antes 0.6)
}
```

### Bonos (Ajustados)
```javascript
STREAK_BONUS: {
  3: 5,      // Reducido de 10
  5: 15,     // Reducido de 25
  10: 30,    // Reducido de 50
  15: 60,    // Reducido de 100
  20: 100    // Reducido de 200
}

FIRST_TRY_BONUS: 10      // Reducido de 20
MASTERY_BONUS: 25        // Reducido de 50
IMPROVEMENT_BONUS: 15    // Reducido de 30
```

### Ejemplo de Puntuación

**Pregunta Avanzada con Buena Ejecución:**
```
Puntos base: 40
× Velocidad FAST (1.2): 48 puntos
+ Racha de 5: +15 puntos
+ Primera vez correcta: +10 puntos
─────────────────────────
TOTAL: 73 puntos
```

**Pregunta Principiante Normal:**
```
Puntos base: 15
× Velocidad NORMAL (1.0): 15 puntos
+ Sin bonos
─────────────────────────
TOTAL: 15 puntos
```

---

## 📈 Sistema de XP (Separado de Puntos)

El XP se usa para logros y progreso de habilidades:

```javascript
BASE_XP: {
  principiante: 5,
  intermedio: 8,
  avanzado: 12
}
```

**XP NO afecta el nivel** - solo los puntos determinan el nivel.

---

## 🔢 Campos de Progreso

### En CxCProgressContext

```javascript
{
  // Puntos para niveles
  totalPoints: 0,        // Suma de todos los puntos ganados
  currentLevel: 1,       // Nivel actual (1-10)
  
  // XP para logros
  totalXP: 0,            // Suma de XP ganada
  
  // Estadísticas
  answeredQuestions: [], // IDs de preguntas respondidas
  questionTracking: {},  // Tracking detallado por pregunta
  
  // Para compatibilidad con sistema CxC antiguo
  points: {
    total: 0,            // Debería reflejar totalPoints
    available: 0,
    spentOnHelps: 0,
    currentRank: 'Bronce'
  }
}
```

### Problema Detectado en HomeScreen

El HomeScreen está mostrando **64,750 puntos** cuando debería mostrar ~100-500 puntos para unos pocos quizzes.

**Posibles causas:**
1. Está sumando `state.totalPoints + state.points.total` (duplicación)
2. Está usando `state.points.total` que podría estar mal calculado
3. Multiplicaciones incorrectas en el scoring

---

## ✅ Acciones a Implementar

### 1. Actualizar LEVEL_THRESHOLDS en CxCProgressContext.js
```javascript
export const LEVEL_THRESHOLDS = [
  { level: 1, name: 'Novato', points: 0, icon: '🌱' },
  { level: 2, name: 'Aprendiz', points: 100, icon: '📚' },
  { level: 3, name: 'Estudiante', points: 300, icon: '🎓' },
  { level: 4, name: 'Competente', points: 600, icon: '💼' },
  { level: 5, name: 'Profesional', points: 1000, icon: '⭐' },
  { level: 6, name: 'Experto', points: 1600, icon: '🏆' },
  { level: 7, name: 'Maestro', points: 2400, icon: '👑' },
  { level: 8, name: 'Gran Maestro', points: 3300, icon: '💎' },
  { level: 9, name: 'Leyenda', points: 4200, icon: '🌟' },
  { level: 10, name: 'Divinidad', points: 5000, icon: '✨' }
];
```

### 2. Actualizar SCORING_CONFIG en questionScorer.js
Ajustar puntos base y bonos como se describe arriba.

### 3. Investigar y Corregir HomeScreen
- Verificar qué valor se está mostrando
- Asegurar que solo se use `state.totalPoints`
- Eliminar duplicaciones

### 4. Sincronizar state.points.total con state.totalPoints
Asegurar que `state.points.total` siempre sea igual a `state.totalPoints`.

---

**Fecha de Diseño:** 2025-10-15
**Estado:** 📋 PENDIENTE DE IMPLEMENTACIÓN
