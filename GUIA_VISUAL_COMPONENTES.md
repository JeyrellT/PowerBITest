# 🎨 Guía Visual de Componentes Mejorados

## 1. Menú de Configuración Desplegable

### Estructura HTML
```jsx
<div className="config-dropdown-wrapper">
  <button className="nav-button glass config-btn">
    <span className="icon">⚙️</span>
    <span>Configuración</span>
  </button>
  
  {showConfigMenu && (
    <div className="config-dropdown-menu">
      <button className="config-menu-item">
        <span className="icon">🏢</span>
        <span className="item-text">
          <strong>CxC Hub</strong>
          <small>Centro de Conocimiento y Competencias</small>
        </span>
      </button>
      {/* más items... */}
    </div>
  )}
</div>
```

### Características Clave
- ✅ Posicionamiento absoluto relativo al botón
- ✅ Backdrop blur para efecto glassmorphism
- ✅ Animación de entrada (dropdownSlide)
- ✅ Cierre automático al hacer clic fuera
- ✅ Items con hover effect

---

## 2. Botones de Acción Rápida

### Estructura HTML
```jsx
<button className="quick-action-btn primary-gradient">
  <span className="btn-icon">🎲</span>
  <span className="btn-content">
    <strong>Test Aleatorio</strong>
    <small>Todas las categorías</small>
  </span>
</button>
```

### Variantes de Estilos
- **primary-gradient**: Púrpura → Cyan (Test Aleatorio)
- **exam-mode**: Rojo → Amarillo (Modo Examen)
- **analytics**: Cyan → Púrpura (Análisis)

### Efectos
- Hover: `translateY(-5px)` + escala de ícono
- Pseudo-elemento `::before` con gradiente de fondo
- Sombra animada en hover

---

## 3. Banner CxC Hub

### Estructura HTML
```jsx
<div className="cxc-banner">
  <div className="cxc-banner-content">
    <div className="cxc-banner-icon">🏢</div>
    <div className="cxc-banner-text">
      <h3>¿Nuevo aquí? Explora el CxC Hub</h3>
      <p>Centro de Conocimiento y Competencias...</p>
      <button className="cxc-banner-btn">
        <span>Explorar CxC Hub</span>
        <span className="arrow">→</span>
      </button>
    </div>
  </div>
</div>
```

### Efectos Especiales
- **Shimmer Effect**: Línea de luz que recorre el banner
- **Float Animation**: Ícono flotante
- **Arrow Transition**: Flecha que se mueve al hover
- Gradiente de fondo con borde de 2px

---

## 4. Hero Badge

### Estructura HTML
```jsx
<div className="hero-badge">
  <span className="badge-pulse">⚡</span>
  <span>Preparación Profesional PL-300</span>
</div>
```

### Animación
```css
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
}
```

---

## 5. Tarjeta de Característica Destacada (CxC Hub)

### Estructura HTML
```jsx
<div className="feature-card feature-card-highlight">
  <div className="feature-icon">🏢</div>
  <div className="feature-badge premium">Premium</div>
  <h3>CxC Hub</h3>
  <p>Centro de Conocimiento y Competencias...</p>
  <button className="feature-cta">
    Explorar CxC Hub →
  </button>
</div>
```

### Características Especiales
- **Borde Animado**: Gradiente que se mueve
- **Badge Premium**: Dorado con animación shine
- **Botón CTA**: Full width con gradiente
- Sombra púrpura destacada

---

## 6. Estados Responsive

### Breakpoints
```css
/* Tablet: 1024px */
- Hero en 1 columna
- Dashboard en 2 columnas

/* Mobile: 768px */
- Stats en 1 columna
- Menú de config centrado
- Botones de acción en columna
- Banner CxC en columna

/* Small Mobile: 480px */
- Títulos reducidos
- Dashboard en 1 columna
- Padding reducido
```

---

## 7. Sistema de Colores

### Variables CSS
```css
:root {
  --primary-purple: #7B3FF2;
  --primary-cyan: #00D4FF;
  --dark-bg: #0F0F23;
  --card-glass: rgba(255, 255, 255, 0.1);
  --card-border: rgba(255, 255, 255, 0.25);
  --gradient-primary: linear-gradient(135deg, #7B3FF2, #00D4FF);
}
```

### Modo Claro
```css
[data-theme="light"] {
  --primary-purple: #6B2FE2;
  --primary-cyan: #0099CC;
  --dark-bg: #F5F7FA;
  /* ... */
}
```

---

## 8. Animaciones Clave

### 1. fadeIn
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 2. slideDown
```css
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3. shimmer
```css
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### 4. float
```css
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### 5. gradientShift
```css
@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}
```

---

## 9. Glassmorphism Effect

### Componentes con Glassmorphism
- Botones de navegación
- Menú de configuración
- Tarjetas de dashboard
- Tarjetas de dominio
- Banner CxC Hub

### Propiedades Clave
```css
.glass-element {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
}
```

---

## 10. Interacciones de Usuario

### Hover Effects
1. **Botones**: `translateY(-2px)` + sombra aumentada
2. **Tarjetas**: `translateY(-5px)` + rotación 3D
3. **Iconos**: `scale(1.2)` + rotación leve
4. **Flechas**: `translateX(5px)`

### Click Effects
1. Cierre de menú desplegable
2. Navegación a pantallas
3. Cambio de tema
4. Reinicio de perfil (con confirmación)

---

## 11. Accesibilidad

### Características
- ✅ Contraste de colores adecuado
- ✅ Tamaños de fuente legibles
- ✅ Áreas de click suficientemente grandes
- ✅ Animaciones sutiles (no molestas)
- ✅ Soporte para temas claro y oscuro
- ✅ Responsive en todos los dispositivos

---

## 12. Performance

### Optimizaciones
- ✅ Animaciones con `transform` y `opacity` (GPU acelerado)
- ✅ `will-change` solo cuando necesario
- ✅ Uso eficiente de `backdrop-filter`
- ✅ Reducción de re-renders con `useCallback` y `useEffect`
- ✅ Event listeners limpiados correctamente

