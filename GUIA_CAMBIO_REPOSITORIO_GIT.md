# 📝 Guía para Cambiar el Repositorio Remoto de Git

## 🎯 Objetivo
Cambiar el repositorio remoto de Git a: `https://github.com/JeyrellT/PowerBITest`

---

## 🔧 Instrucciones Paso a Paso

### Opción 1: Usando PowerShell (Recomendado)

Abre PowerShell en la raíz del proyecto y ejecuta los siguientes comandos:

```powershell
# 1. Ver el repositorio remoto actual
git remote -v

# 2. Cambiar la URL del repositorio remoto
git remote set-url origin https://github.com/JeyrellT/PowerBITest.git

# 3. Verificar que el cambio se aplicó correctamente
git remote -v

# 4. (Opcional) Si quieres agregar un nuevo remoto sin cambiar el existente
# git remote add new-origin https://github.com/JeyrellT/PowerBITest.git
```

### Resultado Esperado:
Después del paso 3, deberías ver:
```
origin  https://github.com/JeyrellT/PowerBITest.git (fetch)
origin  https://github.com/JeyrellT/PowerBITest.git (push)
```

---

## 📤 Subir los Cambios al Nuevo Repositorio

### Paso 1: Verificar archivos modificados
```powershell
git status
```

### Paso 2: Agregar todos los cambios (incluyendo README.md)
```powershell
git add .
```

### Paso 3: Hacer commit de los cambios
```powershell
git commit -m "feat: Implementar sistema de paywall y actualizar README

- Agregar componente DonationPaywall con sistema de código de acceso
- Implementar PaywallContext para gestión global del límite de preguntas
- Integrar contador en QuizScreen (30 preguntas límite)
- Crear README.md completo con documentación del proyecto
- Actualizar enlaces de donación a PayPal
- Actualizar timeline de desarrollo (Q4 2025 - Q2 2026)
- Mejorar centrado del componente 'Consejo Inteligente'
- Optimizar estilos responsive en HomeScreen"
```

### Paso 4: Subir al nuevo repositorio
```powershell
# Si es la primera vez subiendo a este repositorio
git push -u origin main

# O si ya existe
git push origin main
```

---

## 🔄 Alternativa: Eliminar y Re-agregar el Remoto

Si prefieres eliminar completamente el remoto existente:

```powershell
# 1. Eliminar el remoto actual
git remote remove origin

# 2. Agregar el nuevo remoto
git remote add origin https://github.com/JeyrellT/PowerBITest.git

# 3. Verificar
git remote -v

# 4. Subir los cambios
git push -u origin main
```

---

## 📋 Checklist de Verificación

Antes de hacer push, asegúrate de que:

- [ ] El README.md está creado y completo
- [ ] Todos los archivos nuevos están agregados (DonationPaywall.js, PaywallContext.js, etc.)
- [ ] Los cambios en HomeScreen.css están guardados
- [ ] El repositorio remoto apunta a `https://github.com/JeyrellT/PowerBITest.git`
- [ ] No hay errores de compilación en el código
- [ ] `.gitignore` está configurado correctamente (ignorar node_modules, build, etc.)

---

## 📁 Archivos Importantes Incluidos

### Nuevos Componentes:
- ✅ `src/components/DonationPaywall.js`
- ✅ `src/styles/DonationPaywall.css`
- ✅ `src/contexts/PaywallContext.js`
- ✅ `src/hooks/usePaywallControl.js`

### Archivos Modificados:
- ✅ `src/App.js` (integración del paywall)
- ✅ `src/components/QuizScreen.js` (contador de preguntas)
- ✅ `src/components/HomeScreen.js` (hook del paywall)
- ✅ `src/components/UnderConstructionScreen.js` (enlace PayPal y timeline)
- ✅ `src/styles/HomeScreen.css` (mejoras de centrado)

### Documentación:
- ✅ `README.md` (nuevo)
- ✅ `CAMBIOS_CONSTRUCCION_CXC_HUB_FINAL.md`
- ✅ `RESUMEN_IMPLEMENTACION_CONSTRUCCION.md`
- ✅ `ACTUALIZACION_ENLACE_PAYPAL.md`
- ✅ `ACTUALIZACION_HOJA_DE_RUTA.md`
- ✅ `MEJORAS_CENTRADO_CONSEJO_INTELIGENTE.md`

---

## 🚀 Comandos Rápidos (Todo en Uno)

Si quieres hacer todo de una vez:

```powershell
# Configurar el nuevo repositorio remoto
git remote set-url origin https://github.com/JeyrellT/PowerBITest.git

# Agregar todos los cambios
git add .

# Hacer commit
git commit -m "feat: Sistema completo de paywall + README profesional

Implementación completa del sistema de donaciones:
- Paywall después de 30 preguntas
- Código de acceso: WFGWX-YVC9B-4J6C9-T83GX
- Integración con PayPal
- README.md profesional y completo
- Timeline actualizado Q4 2025 - Q2 2026
- Mejoras UI/UX en HomeScreen"

# Subir al repositorio
git push -u origin main
```

---

## ⚠️ Solución de Problemas

### Error: "Permission denied"
```powershell
# Asegúrate de tener permisos en el repositorio
# O usa SSH en lugar de HTTPS
git remote set-url origin git@github.com:JeyrellT/PowerBITest.git
```

### Error: "Repository not found"
```powershell
# Verifica que el repositorio existe en GitHub
# Crea el repositorio en GitHub primero si no existe
```

### Error: "Failed to push"
```powershell
# Si el repositorio tiene contenido, primero haz pull
git pull origin main --allow-unrelated-histories

# Luego push
git push origin main
```

---

## 📝 Notas Adicionales

### Crear el Repositorio en GitHub

Si el repositorio no existe todavía:

1. Ve a [https://github.com/new](https://github.com/new)
2. Nombre del repositorio: `PowerBITest`
3. Descripción: "Plataforma de preparación profesional para el examen Microsoft Power BI Data Analyst (PL-300)"
4. Público o Privado: **Público** (recomendado para donaciones)
5. **NO** inicializar con README (ya lo tenemos)
6. Click en "Create repository"

### Configurar GitHub Pages (Opcional)

Para hospedar la aplicación gratis en GitHub Pages:

```powershell
# 1. Instalar gh-pages
npm install --save-dev gh-pages

# 2. Agregar scripts en package.json
# "predeploy": "npm run build",
# "deploy": "gh-pages -d build"

# 3. Desplegar
npm run deploy
```

Tu app estará disponible en: `https://jeyrelit.github.io/PowerBITest`

---

## ✅ Verificación Final

Después de hacer push, verifica en GitHub:

1. Ve a: https://github.com/JeyrellT/PowerBITest
2. Verifica que el README.md se muestra correctamente
3. Confirma que todos los archivos están presentes
4. Revisa que los badges y enlaces funcionen

---

**¡Listo!** Tu repositorio ahora está configurado correctamente en GitHub.

---

**Fecha**: 19 de Octubre, 2025  
**Repositorio**: https://github.com/JeyrellT/PowerBITest
