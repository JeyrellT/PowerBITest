# 🔍 Análisis de Limpieza del Proyecto PL300PB

**Fecha:** 16 de octubre de 2025

## 📋 Resumen Ejecutivo

Se identificaron **archivos obsoletos y duplicados** que pueden ser eliminados de forma segura para mantener el código limpio y organizado.

---

## 🗑️ Archivos a Eliminar

### 1. **Archivos de Utilidades en Raíz (Scripts de Desarrollo/Debug)**

Estos archivos están en la raíz del proyecto y son herramientas de desarrollo/debugging que no se usan en producción:

- ❌ `count-exact.js` - Script para contar preguntas (herramienta de desarrollo)
- ❌ `count-package.json` - Archivo de configuración solo para el script de conteo
- ❌ `count-questions.js` - Otro script para contar preguntas (duplicado)
- ❌ `diagnose-data.js` - Script de diagnóstico de localStorage (debug)
- ❌ `validate-refactoring.js` - Script de validación usado una vez durante refactorización
- ❌ `clear-storage.html` - Herramienta HTML para limpiar localStorage (debug)

**Razón:** Son herramientas de desarrollo que no se importan en el código principal de la aplicación.

---

### 2. **Archivos Duplicados en `public/` y `build/`**

- ❌ `public/diagnostic-tool.js` - Herramienta de diagnóstico duplicada
- ❌ `build/diagnostic-tool.js` - Copia en carpeta de build

**Razón:** Los archivos en `build/` son generados automáticamente. Este archivo específico no se usa en la app.

---

### 3. **Archivos DEPRECATED en `src/utils/`**

Archivos marcados como obsoletos que ya no se usan:

- ❌ `src/utils/progressManager.js` - DEPRECATED, reemplazado por `CxCProgressContext`
- ❌ `src/utils/questionTracker.js` - DEPRECATED, reemplazado por `CxCProgressContext`

**Razón:** 
- Tienen advertencias de deprecación explícitas en el código
- Ya no se importan en ningún componente activo
- Toda la funcionalidad se migró al contexto `CxCProgressContext`

---

### 4. **Carpeta `build/` (Opcional)**

- ⚠️ `build/` - Carpeta completa de build (se regenera con `npm run build`)

**Razón:** Esta carpeta se regenera automáticamente y no debería estar en control de versiones.

---

## ✅ Archivos que se MANTIENEN

### Scripts de Utilidad (scripts/)
- ✅ `scripts/deploy.ps1` - Script de despliegue
- ✅ `scripts/init-repo.ps1` - Inicialización de repositorio
- ✅ `scripts/init-repo-simple.ps1` - Versión simple de inicialización
- ✅ `scripts/quick-push.ps1` - Push rápido a Git
- ✅ `scripts/consolidate-js-json.js` - Consolidación de archivos

### Archivos Core
- ✅ `src/utils/questionScorer.js` - Activo, usa el nuevo sistema de contextos
- ✅ `src/utils/quizIntegration.js` - Activo, refactorizado correctamente
- ✅ `src/utils/questionCounter.js` - Activo, ya refactorizado

---

## 📊 Estadísticas

- **Total de archivos a eliminar:** 10 archivos + 1 carpeta opcional
- **Espacio estimado a liberar:** ~500KB+ (sin contar build/)
- **Archivos deprecated:** 2
- **Scripts de debug:** 6
- **Duplicados:** 2

---

## 🎯 Recomendaciones

1. **Eliminar archivos listados** - Son seguros de borrar
2. **Agregar build/ al .gitignore** - Si no está ya
3. **Mantener scripts/ en otra carpeta** - Por ejemplo `dev-tools/` o `scripts-dev/`
4. **Documentar herramientas de desarrollo** - En README si son útiles para otros devs

---

## ⚠️ Verificación Previa

Antes de ejecutar, se verificó que:
- ✅ No hay imports de archivos deprecated en componentes activos
- ✅ Los archivos de utilidad en raíz no se usan en producción
- ✅ Las herramientas de debug son standalone
- ✅ El sistema está completamente migrado a contextos
