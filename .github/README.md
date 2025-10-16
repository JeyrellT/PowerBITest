# GitHub Actions CI/CD Setup

Este directorio contiene los workflows de GitHub Actions para CI/CD automatico.

## Workflows Disponibles

### 1. deploy.yml
**Proposito:** Build y deploy automatico a GitHub Pages

**Triggers:**
- Push a rama `main` o `master`
- Pull requests
- Manual dispatch

**Pasos:**
1. Checkout del codigo
2. Setup Node.js 18
3. Instalar dependencias (`npm ci`)
4. Build de produccion
5. Deploy a GitHub Pages (rama `gh-pages`)

### 2. ci.yml
**Proposito:** Continuous Integration y testing

**Triggers:**
- Push a `main`, `master`, o `develop`
- Pull requests

**Pasos:**
1. Checkout del codigo
2. Setup Node.js (matriz: 18.x y 20.x)
3. Instalar dependencias
4. Run linter/build
5. Run tests

## Configuracion Necesaria

### GitHub Pages
1. Ir a: Settings → Pages
2. Source: `gh-pages` branch
3. Directory: `/ (root)`

### Permisos
Los workflows ya tienen configurados los permisos necesarios:
- `contents: write` - Para push a gh-pages
- `pages: write` - Para deploy a Pages
- `id-token: write` - Para autenticacion

## Variables de Entorno

Actualmente no se requieren secrets adicionales. El workflow usa:
- `GITHUB_TOKEN` - Automaticamente provisto por GitHub

## Monitoreo

Ver el estado de los workflows:
- https://github.com/JeyrellT/PL300PB/actions

## Badges

```markdown
[![Build and Deploy](https://github.com/JeyrellT/PL300PB/actions/workflows/deploy.yml/badge.svg)](https://github.com/JeyrellT/PL300PB/actions/workflows/deploy.yml)
[![CI](https://github.com/JeyrellT/PL300PB/actions/workflows/ci.yml/badge.svg)](https://github.com/JeyrellT/PL300PB/actions/workflows/ci.yml)
```
