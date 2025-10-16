# Script de inicializacion del repositorio Git - Version simplificada
# Uso: .\scripts\init-repo-simple.ps1

Write-Host "Inicializando repositorio Git..." -ForegroundColor Cyan

# Inicializar Git
if (-not (Test-Path ".git")) {
    Write-Host "Creando repositorio Git local..." -ForegroundColor Yellow
    git init
    Write-Host "Repositorio Git inicializado" -ForegroundColor Green
} else {
    Write-Host "Repositorio Git ya existe" -ForegroundColor Green
}

# Configurar remote
Write-Host "Configurando remote..." -ForegroundColor Cyan
$remoteUrl = "https://github.com/JeyrellT/PL300PB.git"

try {
    git remote remove origin 2>$null
} catch {}

git remote add origin $remoteUrl
Write-Host "Remote configurado" -ForegroundColor Green

# Crear commit inicial
Write-Host "Creando commit inicial..." -ForegroundColor Yellow
git add .
git commit -m "Initial commit: PL-300 Power BI Quiz App"
git branch -M main

Write-Host ""
Write-Host "Inicializacion completa!" -ForegroundColor Green
Write-Host "Proximos pasos:" -ForegroundColor Yellow
Write-Host "1. Haz el primer push: git push -u origin main"
Write-Host "2. Configura GitHub Pages en tu repositorio"
Write-Host "3. Usa scripts\deploy.ps1 para deploys futuros"
