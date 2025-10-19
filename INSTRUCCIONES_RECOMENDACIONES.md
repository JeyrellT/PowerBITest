# 📖 Instrucciones de Uso - Sistema de Recomendaciones

## 🚀 Inicio Rápido

### ✅ ¿Qué ya está funcionando?

El sistema de recomendaciones ya está **completamente implementado** en tu aplicación. Solo necesitas:

1. **Navegar al Perfil** → El componente `ProfileScreenDuolingo`
2. **Ir a la pestaña "Analysis"** → Segunda pestaña
3. **Ver la sección "Recomendaciones Personalizadas"** → Aparece automáticamente

### 🎯 Sin configuración adicional requerida

Todo funciona automáticamente porque:
- ✅ La lógica ya está integrada en `useMemo` que se ejecuta automáticamente
- ✅ Los estilos CSS ya están cargados
- ✅ El componente `RecommendationCard` ya está definido
- ✅ Las animaciones Framer Motion ya están configuradas

---

## 🎮 Cómo Funciona Internamente

### 1. Análisis Automático del Progreso

Cada vez que el usuario visita su perfil:

```javascript
// El sistema analiza automáticamente:
const analysis = useMemo(() => {
  // 1. Revisa estadísticas de dominios
  // 2. Identifica debilidades (accuracy < 50%)
  // 3. Calcula racha actual
  // 4. Detecta preguntas difíciles
  // 5. Verifica cobertura de dominios
  // 6. Analiza nivel de confianza
  // 7. Evalúa tiempo de estudio
  // 8. Comprueba logros desbloqueables
  
  // Resultado: Array con 8 recomendaciones más relevantes
  return { recommendations: topRecommendations };
}, [stats, progress]);
```

### 2. Renderizado Interactivo

Las recomendaciones se muestran en un grid responsivo:

```jsx
<AnimatePresence>
  {showRecommendations && (
    <motion.div className="recommendations-mega-grid">
      {analysis.recommendations.map((rec, idx) => (
        <RecommendationCard 
          key={rec.id} 
          recommendation={rec} 
          index={idx}
          onAction={handleAction}
        />
      ))}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🔧 Personalización

### Cambiar el Número de Recomendaciones Mostradas

**Ubicación:** `ProfileScreenDuolingo.js`, línea ~1623

```javascript
// Actual: Muestra 8 recomendaciones
const topRecommendations = recommendations.slice(0, 8);

// Para mostrar más:
const topRecommendations = recommendations.slice(0, 12);

// Para mostrar menos:
const topRecommendations = recommendations.slice(0, 5);
```

### Ajustar Umbrales de Precisión

**Ubicación:** `ProfileScreenDuolingo.js`, líneas ~1245-1620

```javascript
// Debilidades (línea ~1245)
// Actual: accuracy < 50%
if (domain.performance === 'weak') { // accuracy < 50%

// Cambiar a más estricto:
if (domain.accuracy < 60) {

// Precisión general baja (línea ~1345)
// Actual: < 70%
if (stats.accuracyOverall < 70) {

// Cambiar a:
if (stats.accuracyOverall < 80) {
```

### Modificar Recompensas de XP

**Ubicación:** `ProfileScreenDuolingo.js`, dentro de cada recomendación

```javascript
// Recomendación de debilidades (línea ~1272)
xpReward: 150, // Cambiar a 200, 300, etc.

// Recomendación de racha (línea ~1284)
xpReward: 50,  // Cambiar según prefieras

// Recomendación de logros (línea ~1522)
xpReward: 300, // La más alta
```

### Cambiar Colores de Prioridad

**Ubicación:** `ProfileScreenDuolingo.css`, línea ~2554

```css
.rec-mega-card.priority-high {
  --priority-color: #F44336; /* Cambiar a otro color hex */
}

.rec-mega-card.priority-medium {
  --priority-color: #FF9800; /* Cambiar según tu marca */
}
```

---

## 🎨 Personalizar Estilos Visuales

### Cambiar Tamaño de Tarjetas

**Ubicación:** `ProfileScreenDuolingo.css`, línea ~2604

```css
.recommendations-mega-grid {
  /* Actual: mínimo 380px */
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  
  /* Para tarjetas más grandes: */
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  
  /* Para tarjetas más pequeñas: */
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}
```

### Ajustar Animaciones

**Ubicación:** `ProfileScreenDuolingo.js`, componente RecommendationCard

```javascript
// Velocidad de entrada (línea ~1185)
initial={{ opacity: 0, y: 50, scale: 0.9 }}
animate={{ opacity: 1, y: 0, scale: 1 }}
transition={{ 
  delay: index * 0.08,  // Cambiar a 0.05 (más rápido) o 0.15 (más lento)
  ...springConfig 
}}

// Efecto hover (línea ~1189)
whileHover={{ scale: 1.02, y: -5 }}

// Cambiar a más dramático:
whileHover={{ scale: 1.05, y: -10 }}
```

### Desactivar Haptic Feedback

**Ubicación:** `ProfileScreenDuolingo.js`, varias líneas

```javascript
// Buscar todas las instancias de:
haptic(30);

// Y comentarlas o eliminarlas:
// haptic(30);
```

---

## 🔌 Integrar Acciones Personalizadas

### Conectar con tu Sistema de Navegación

**Ubicación:** `ProfileScreenDuolingo.js`, línea ~1773

```javascript
onAction={(actionData) => {
  console.log('Acción de recomendación:', actionData);
  
  // TU CÓDIGO AQUÍ:
  const { actionTarget, actionData: data } = actionData;
  
  if (actionTarget === 'quiz') {
    // Navegar a quiz
    onNavigate?.('quiz', { 
      domain: data.domain,
      level: data.level 
    });
  }
  
  if (actionTarget === 'guide') {
    // Abrir guía
    onNavigate?.('guide', { 
      section: data.section 
    });
  }
  
  // etc...
}}
```

### Ejemplo Completo de Integración

```javascript
// En tu componente AnalysisTabDuo
const handleRecommendationAction = useCallback((actionData) => {
  const { actionTarget, actionData: data, recommendation } = actionData;
  
  // 1. Registrar en analytics
  telemetryService.trackEvent('recommendation_clicked', {
    id: recommendation.id,
    type: recommendation.type,
    priority: recommendation.priority
  });
  
  // 2. Haptic feedback
  haptic([50, 25, 50]);
  
  // 3. Mostrar notificación de éxito
  toast.success(`¡Empezando ${recommendation.action}!`);
  
  // 4. Ejecutar acción
  switch(actionTarget) {
    case 'quiz':
      // Guardar estado
      localStorage.setItem('recommendedDomain', data.domain);
      
      // Navegar con animación
      setTimeout(() => {
        onNavigate?.('quiz', data);
      }, 300);
      break;
      
    case 'review':
      // Abrir modal de revisión
      setReviewMode({ 
        active: true, 
        type: data.type,
        questions: data.count 
      });
      break;
      
    case 'guide':
      // Scroll a sección específica
      const guideSection = document.getElementById(data.section);
      guideSection?.scrollIntoView({ behavior: 'smooth' });
      onNavigate?.('guide');
      break;
      
    case 'achievements':
      // Cambiar tab
      setActiveTab('achievements');
      break;
  }
  
  // 5. Actualizar progreso de recomendación seguida
  updateProgress({
    recommendationFollowed: recommendation.id,
    timestamp: new Date().toISOString()
  });
}, [onNavigate, setActiveTab, updateProgress]);

// Usar en el componente
<RecommendationCard 
  recommendation={rec}
  onAction={handleRecommendationAction}
/>
```

---

## 📊 Tracking y Analytics

### Eventos Sugeridos para Registrar

```javascript
// 1. Cuando se muestra una recomendación
trackEvent('recommendation_impression', {
  id: recommendation.id,
  type: recommendation.type,
  priority: recommendation.priority,
  position: index
});

// 2. Cuando se clickea
trackEvent('recommendation_clicked', {
  id: recommendation.id,
  action: recommendation.action,
  xpReward: recommendation.xpReward
});

// 3. Cuando se expanden los tips
trackEvent('recommendation_expanded', {
  id: recommendation.id
});

// 4. Cuando se completa la acción
trackEvent('recommendation_completed', {
  id: recommendation.id,
  timeToComplete: completionTime,
  success: true
});

// 5. KPIs agregados
trackMetric('recommendation_ctr', {
  clicks: totalClicks,
  impressions: totalImpressions,
  rate: (totalClicks / totalImpressions) * 100
});
```

---

## 🧪 Testing

### Probar Diferentes Escenarios

```javascript
// 1. Usuario nuevo (sin progreso)
localStorage.clear();
// Deberías ver: Recomendaciones de racha y tiempo de estudio

// 2. Usuario con debilidades
// Modificar temporalmente en consola:
progress.domainStats['visualizar-analizar'].accuracy = 35;
// Deberías ver: Recomendación de reforzar área débil

// 3. Usuario avanzado con racha larga
progress.currentStreak = 15;
progress.accuracyOverall = 85;
// Deberías ver: Recomendaciones motivacionales y desafíos

// 4. Usuario con preguntas difíciles
// Agregar preguntas con bajo ratio en questionTracking
// Deberías ver: Recomendación de repaso
```

---

## 🐛 Troubleshooting

### Problema: No aparecen recomendaciones

**Solución:**
```javascript
// Verificar que analysis.recommendations existe
console.log('Recommendations:', analysis.recommendations);

// Verificar que showRecommendations está en true
console.log('Show recommendations:', showRecommendations);

// Verificar que hay datos de progreso
console.log('Progress:', progress);
console.log('Stats:', stats);
```

### Problema: Estilos no se aplican correctamente

**Solución:**
```javascript
// 1. Verificar que el CSS está importado
import '../styles/ProfileScreenDuolingo.css';

// 2. Verificar que no hay conflictos de clases
// Buscar en DevTools elementos con clase .rec-mega-card

// 3. Limpiar caché del navegador
// Ctrl + Shift + R (Windows) o Cmd + Shift + R (Mac)
```

### Problema: Animaciones no funcionan

**Solución:**
```javascript
// 1. Verificar que Framer Motion está instalado
npm list framer-motion

// 2. Si no está, instalar:
npm install framer-motion

// 3. Verificar import en el archivo
import { motion, AnimatePresence } from 'framer-motion';
```

### Problema: Las acciones no navegan correctamente

**Solución:**
```javascript
// Asegúrate de pasar onNavigate desde el componente padre
<ProfileScreenDuolingo onNavigate={handleNavigation} />

// Y que el handler esté definido:
const handleNavigation = (screen, data) => {
  console.log('Navigating to:', screen, data);
  // Tu lógica de navegación
};
```

---

## 📚 Recursos Adicionales

### Archivos Relacionados

- **Lógica:** `src/components/ProfileScreenDuolingo.js` (líneas 1245-1623)
- **Componente:** `src/components/ProfileScreenDuolingo.js` (líneas 1152-1362)
- **Estilos:** `src/styles/ProfileScreenDuolingo.css` (líneas 2554-3099)
- **Documentación:** `SISTEMA_RECOMENDACIONES.md`
- **Ejemplos:** `EJEMPLO_RECOMENDACIONES.js`

### Referencias de Diseño

El sistema está inspirado en:
- **Duolingo**: Sistema de rachas y motivación
- **Khan Academy**: Recomendaciones personalizadas
- **Coursera**: Progreso adaptativo
- **Codecademy**: Badges y logros

---

## 🎉 ¡Listo para Usar!

Tu sistema de recomendaciones está **completamente funcional**. Solo necesitas:

1. ✅ Abrir la aplicación
2. ✅ Ir al perfil
3. ✅ Seleccionar la pestaña "Analysis"
4. ✅ ¡Disfrutar de las recomendaciones personalizadas!

**¿Preguntas o mejoras?** El código está bien comentado y es fácil de modificar. ¡Experimenta! 🚀
