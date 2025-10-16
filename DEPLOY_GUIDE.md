# Guía Completa de CI/CD y Deploy Automatico

## 🎯 Sistema de Deploy Configurado

Este proyecto cuenta con un sistema completo de CI/CD que incluye:

1. **GitHub Actions** para build y deploy automatico
2. **Scripts PowerShell** para push rapido
3. **GitHub Pages** para hosting

---

## 📋 Pasos Iniciales (SOLO UNA VEZ)

### 1. Inicializar el Repositorio

```powershell
# Ejecutar desde la raiz del proyecto
.\scripts\init-repo.ps1
```

Este script:
- ✅ Inicializa Git (si no existe)
- ✅ Configura el remote a tu repositorio
- ✅ Crea la rama `main`
- ✅ Prepara el primer commit

### 2. Primer Push a GitHub

```powershell
# Push inicial (solo la primera vez)
git push -u origin main
```

### 3. Configurar GitHub Pages

1. Ve a tu repositorio: https://github.com/JeyrellT/PL300PB
2. Click en **Settings** → **Pages**
3. En **Source**, selecciona `gh-pages` branch
4. Guarda los cambios
5. Tu app estará en: https://JeyrellT.github.io/PL300PB

---

## 🚀 Deploy Diario (Uso Regular)

### Opción 1: Deploy Automatico Completo (RECOMENDADO)

```powershell
# Con mensaje personalizado
.\scripts\deploy.ps1 "Agregue nuevas preguntas de Power BI"

# Con mensaje automatico (incluye fecha/hora)
.\scripts\deploy.ps1
```

**¿Que hace este script?**
- 📝 Detecta cambios automaticamente
- 📦 Hace `git add .`
- 💾 Crea commit con tu mensaje
- 🌐 Push a GitHub
- ✅ GitHub Actions hace el build y deploy

### Opción 2: Push Rapido

```powershell
# Para cambios menores
.\scripts\quick-push.ps1 "Fix de typo"
```

### Opción 3: Manual (Git tradicional)

```powershell
git add .
git commit -m "Tu mensaje"
git push
```

---

## 🔄 ¿Como Funciona el CI/CD?

### Flujo Automatico

```
1. TU PUSH
   ↓
2. GITHUB ACTIONS DETECTA EL PUSH
   ↓
3. EJECUTA BUILD (npm install + npm run build)
   ↓
4. EJECUTA TESTS
   ↓
5. DEPLOY A GITHUB PAGES
   ↓
6. TU APP ESTÁ ACTUALIZADA EN VIVO
```

### Tiempo Estimado

- ⏱️ Build: 2-4 minutos
- ⏱️ Deploy: 1-2 minutos
- ✅ Total: ~5 minutos desde push hasta producción

---

## 📊 Monitorear el Deploy

### Ver el Progreso

1. Ve a: https://github.com/JeyrellT/PL300PB/actions
2. Verás los workflows ejecutándose en tiempo real
3. ✅ Verde = Exitoso | ❌ Rojo = Error

### Ver la App en Vivo

- URL Principal: https://JeyrellT.github.io/PL300PB
- Puede tomar 1-2 minutos en actualizar después del deploy

---

## 🛠️ Workflows Configurados

### 1. Deploy Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push a `main` o `master`
- Pull requests
- Manual (botón "Run workflow")

**Acciones:**
- ✅ Checkout del código
- ✅ Setup Node.js 18
- ✅ Instalar dependencias
- ✅ Build de producción
- ✅ Deploy a GitHub Pages

### 2. CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push a `main`, `master`, o `develop`
- Pull requests

**Acciones:**
- ✅ Tests en Node 18 y 20
- ✅ Linting
- ✅ Build verification

---

## 🎨 Badges para tu README

Ya incluidos en el README.md:

```markdown
[![Build and Deploy](https://github.com/JeyrellT/PL300PB/actions/workflows/deploy.yml/badge.svg)](https://github.com/JeyrellT/PL300PB/actions/workflows/deploy.yml)
[![CI](https://github.com/JeyrellT/PL300PB/actions/workflows/ci.yml/badge.svg)](https://github.com/JeyrellT/PL300PB/actions/workflows/ci.yml)
```

---

## 🔧 Troubleshooting

### Error: "Permission denied"

```powershell
# Habilitar ejecución de scripts en PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Error: "fatal: not a git repository"

```powershell
# Re-ejecutar el script de inicialización
.\scripts\init-repo.ps1
```

### Error en GitHub Actions

1. Ve a la pestaña "Actions" en GitHub
2. Click en el workflow fallido
3. Revisa los logs para ver el error específico
4. Común: errores de build → revisa `package.json` y dependencias

### El sitio no se actualiza

1. Verifica que el workflow terminó exitosamente
2. Espera 2-3 minutos adicionales
3. Fuerza refresh: `Ctrl + Shift + R`
4. Limpia cache del navegador

---

## 📝 Comandos Útiles

### Ver estado del repositorio
```powershell
git status
```

### Ver historial de commits
```powershell
git log --oneline -10
```

### Ver ramas
```powershell
git branch -a
```

### Deshacer último commit (sin perder cambios)
```powershell
git reset --soft HEAD~1
```

### Ver cambios antes de commit
```powershell
git diff
```

---

## 🎯 Mejores Prácticas

### Commits

✅ **BIEN:**
```
git commit -m "Agregue 50 nuevas preguntas de visualizaciones"
git commit -m "Fix: Corregir calculo de puntuación"
git commit -m "Feature: Agregar sistema de achievements"
```

❌ **MAL:**
```
git commit -m "cambios"
git commit -m "fix"
git commit -m "asdfasdf"
```

### Frecuencia de Push

- 📅 **Diario**: Ideal para desarrollo activo
- 🔄 **Por Feature**: Cuando completas una funcionalidad
- 🐛 **Por Fix**: Inmediatamente después de arreglar un bug crítico

### Ramas (Opcional pero recomendado)

```powershell
# Crear rama para nueva feature
git checkout -b feature/nuevo-modulo

# Trabajar en la rama...
# Cuando esté listo:
git checkout main
git merge feature/nuevo-modulo
git push
```

---

## 🚀 Flujo de Trabajo Diario Recomendado

### Mañana
```powershell
# 1. Actualizar tu código local
git pull

# 2. Trabajar en tus cambios...
# (editar archivos, agregar features, etc.)

# 3. Deploy al final del día
.\scripts\deploy.ps1 "Resumen de cambios del día"
```

### Deploy Rápido
```powershell
# Hacer cambios...
.\scripts\quick-push.ps1 "Mensaje corto"
```

---

## 📈 Monitoreo y Analytics

### GitHub Insights

1. Ve a tu repo → **Insights**
2. Verás:
   - 📊 Traffic (visitas)
   - 📈 Commits por día
   - 👥 Contributors
   - 🌟 Stars

### GitHub Pages Analytics

- Considera agregar Google Analytics
- O usar: https://plausible.io (alternativa privacy-friendly)

---

## 🎉 ¡Todo Listo!

Tu proyecto ahora tiene:

✅ CI/CD automatico con GitHub Actions
✅ Scripts de deploy fáciles de usar
✅ GitHub Pages configurado
✅ Documentación completa
✅ Badges de estado

**Siguiente paso:** 
```powershell
.\scripts\init-repo.ps1
git push -u origin main
```

¡Y tu app estará en línea en ~5 minutos! 🚀
