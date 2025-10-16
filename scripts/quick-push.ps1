# Script rapido de push - Sin build local
# Uso: .\scripts\quick-push.ps1 "mensaje"

param(
    [Parameter(Mandatory=$false)]
    [string]$msg = "Quick update: $(Get-Date -Format 'HH:mm:ss')"
)

git add .
git commit -m $msg
git push

Write-Host "`n✅ Push completado!" -ForegroundColor Green
