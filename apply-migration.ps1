# Script para aplicar migração do banco de dados

Write-Host "🔄 Parando servidor (se estiver rodando)..." -ForegroundColor Yellow

# Aplicar migração
Write-Host "`n📦 Aplicando migração do Prisma..." -ForegroundColor Cyan
Set-Location "c:\Users\GOJO\Documents\Site\lyoki-site\server"

# Executar migração
npx prisma migrate dev --name add_user_profile_fields

# Gerar cliente Prisma
Write-Host "`n🔧 Gerando cliente Prisma..." -ForegroundColor Cyan
npx prisma generate

Write-Host "`n✅ Migração concluída!" -ForegroundColor Green
Write-Host "`nAgora você pode reiniciar o servidor com: npm run dev" -ForegroundColor Yellow
