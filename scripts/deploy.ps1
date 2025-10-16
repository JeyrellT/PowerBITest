# Script de deploy automatico para Windows PowerShell
# Uso: .\scripts\deploy.ps1 "mensaje del commit"

param(
    [Parameter(Mandatory=$false)]
    [string]$commitMessage = "Auto deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

Write-Host "🚀 Iniciando proceso de deploy automatico..." -ForegroundColor Cyan

# Verificar si hay cambios
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "✅ No hay cambios para commitear" -ForegroundColor Green
    exit 0
}

Write-Host "📝 Cambios detectados:" -ForegroundColor Yellow
git status --short

# Agregar todos los cambios
Write-Host "`n📦 Agregando archivos al stage..." -ForegroundColor Cyan
git add .

# Crear commit
Write-Host "`n💾 Creando commit..." -ForegroundColor Cyan
git commit -m $commitMessage

# Push a GitHub
Write-Host "`n🌐 Enviando cambios a GitHub..." -ForegroundColor Cyan
$branch = git rev-parse --abbrev-ref HEAD
git push origin $branch

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Deploy completado exitosamente!" -ForegroundColor Green
    Write-Host "📊 GitHub Actions se encargara del build y deploy automatico" -ForegroundColor Cyan
    Write-Host "🔗 Revisa el progreso en: https://github.com/JeyrellT/PL300PB/actions" -ForegroundColor Blue
} else {
    Write-Host "`n❌ Error al hacer push a GitHub" -ForegroundColor Red
    exit 1
}
