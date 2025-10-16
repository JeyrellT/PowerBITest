# Guía Rápida de Deploy

## 🚀 Deploy en 1 Comando

```powershell
.\scripts\deploy.ps1 "Tu mensaje aquí"
```

## 📋 Ejemplos de Uso

```powershell
# Deploy con mensaje descriptivo
.\scripts\deploy.ps1 "Agregue 25 nuevas preguntas sobre DAX"

# Deploy con mensaje automático (fecha/hora)
.\scripts\deploy.ps1

# Push rápido
.\scripts\quick-push.ps1 "Fix menor"
```

## ⏱️ Tiempo de Deploy

- Push al repositorio: **Inmediato**
- GitHub Actions build: **2-4 minutos**
- Disponible en producción: **~5 minutos total**

## 🔗 Enlaces Importantes

- **Repositorio:** https://github.com/JeyrellT/PL300PB
- **GitHub Actions:** https://github.com/JeyrellT/PL300PB/actions
- **App en Vivo:** https://JeyrellT.github.io/PL300PB

## ✅ Verificar Deploy

1. **Ver progreso del build:**
   ```powershell
   start https://github.com/JeyrellT/PL300PB/actions
   ```

2. **Ver app desplegada:**
   ```powershell
   start https://JeyrellT.github.io/PL300PB
   ```

## 🎯 Workflow de Deploy

```
TÚ → Deploy Script → GitHub → Actions → Build → GitHub Pages → ✅ Producción
     (instantáneo)           (2-4 min)              (~1 min)
```

## 💡 Tips

- Usa mensajes descriptivos en tus commits
- GitHub Actions se ejecuta automáticamente en cada push
- El sitio puede tomar 1-2 minutos extra en actualizar el cache
- Usa `Ctrl + Shift + R` para forzar recarga sin cache

---

**¡Deploy automatizado con GitHub Actions! 🎉**
