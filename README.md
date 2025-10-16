# PL-300 Power BI Quiz App

[![Build and Deploy](https://github.com/JeyrellT/PL300PB/actions/workflows/deploy.yml/badge.svg)](https://github.com/JeyrellT/PL300PB/actions/workflows/deploy.yml)
[![CI](https://github.com/JeyrellT/PL300PB/actions/workflows/ci.yml/badge.svg)](https://github.com/JeyrellT/PL300PB/actions/workflows/ci.yml)

Aplicación interactiva de quiz para preparación del examen PL-300 de Microsoft Power BI.

## 🚀 Demo en Vivo

[https://JeyrellT.github.io/PL300PB](https://JeyrellT.github.io/PL300PB)

## 📋 Características

- ✅ Sistema de preguntas interactivas
- 📊 Visualización de progreso
- 🎯 Sistema de logros y gamificación
- 📈 Análisis de competencias
- 💾 Guardado automático de progreso
- 🎨 Interfaz estilo Duolingo

## 🛠️ Tecnologías

- React 18
- React Router v6
- Framer Motion
- Recharts
- LocalStorage para persistencia

## 📦 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/JeyrellT/PL300PB.git
cd PL300PB

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

## 🚀 Scripts de Deploy Automatico

### Primer Setup
```powershell
# Inicializar repositorio y configurar remote
.\scripts\init-repo.ps1

# Hacer el primer push
git push -u origin main
```

### Deploy Automatico (Recomendado)
```powershell
# Deploy con mensaje personalizado
.\scripts\deploy.ps1 "Mensaje del commit"

# Deploy con mensaje automatico
.\scripts\deploy.ps1
```

### Push Rapido
```powershell
# Para cambios rapidos sin build local
.\scripts\quick-push.ps1 "Fix rapido"
```

## 🔄 CI/CD Pipeline

El proyecto usa GitHub Actions para:

1. **Build automatico**: Se ejecuta en cada push
2. **Tests**: Validación de codigo
3. **Deploy a GitHub Pages**: Deploy automatico a produccion

### Workflows Configurados

- **deploy.yml**: Build y deploy automatico a GitHub Pages
- **ci.yml**: Continuous Integration con tests

## 📝 Comandos Disponibles

```bash
npm start          # Iniciar en modo desarrollo
npm run build      # Crear build de produccion
npm test           # Ejecutar tests
npm run deploy     # Deploy manual a GitHub Pages
```

## 🌐 Deploy Manual

Si prefieres deploy manual:

```bash
npm run build
npm run deploy
```

## 📂 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── contexts/       # Context API (estado global)
├── data/          # Datos de preguntas y contenido
├── hooks/         # Custom hooks
├── routes/        # Configuracion de rutas
├── screens/       # Pantallas principales
├── services/      # Servicios (API, storage, etc)
├── styles/        # Estilos globales
└── utils/         # Utilidades y helpers
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de uso educativo.

## 👤 Autor

**JeyrellT**

- GitHub: [@JeyrellT](https://github.com/JeyrellT)
- Repositorio: [PL300PB](https://github.com/JeyrellT/PL300PB)

## 🙏 Agradecimientos

- Microsoft Learn - Contenido del examen PL-300
- Comunidad de Power BI
- Duolingo - Inspiracion de diseño

---

⭐ Si te gusta este proyecto, dale una estrella!
