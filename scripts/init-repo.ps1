# Script de inicializacion del repositorio Git
# Uso: .\scripts\init-repo.ps1

Write-Host "🔧 Inicializando repositorio Git..." -ForegroundColor Cyan

# Inicializar Git si no existe
if (-not (Test-Path ".git")) {
    Write-Host "📂 Creando repositorio Git local..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Repositorio Git inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Repositorio Git ya existe" -ForegroundColor Green
}

# Configurar remote
Write-Host "`n🌐 Configurando remote..." -ForegroundColor Cyan
$remoteUrl = "https://github.com/JeyrellT/PL300PB.git"

$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "🔄 Actualizando remote existente..." -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
} else {
    Write-Host "➕ Agregando remote origin..." -ForegroundColor Yellow
    git remote add origin $remoteUrl
}

Write-Host "✅ Remote configurado: $remoteUrl" -ForegroundColor Green

# Crear rama principal
Write-Host "`n🌿 Configurando rama principal..." -ForegroundColor Cyan
$currentBranch = git rev-parse --abbrev-ref HEAD 2>$null

if ([string]::IsNullOrEmpty($currentBranch) -or $currentBranch -eq "HEAD") {
    Write-Host "📝 Creando commit inicial..." -ForegroundColor Yellow
    git add .
    git commit -m "Initial commit: PL-300 Power BI Quiz App"
    git branch -M main
    Write-Host "✅ Rama main creada" -ForegroundColor Green
} elseif ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Host "🔄 Cambiando a rama main..." -ForegroundColor Yellow
    git branch -M main
}

Write-Host "`n📊 Estado actual:" -ForegroundColor Cyan
git status

Write-Host "`n✅ Inicializacion completa!" -ForegroundColor Green
Write-Host "📝 Proximos pasos:" -ForegroundColor Yellow
Write-Host "   1. Revisa los archivos con: git status" -ForegroundColor White
Write-Host "   2. Haz el primer push con: git push -u origin main" -ForegroundColor White
Write-Host "   3. Usa scripts\deploy.ps1 para deploys futuros" -ForegroundColor White
