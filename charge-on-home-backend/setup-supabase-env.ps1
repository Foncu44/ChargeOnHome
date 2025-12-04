# Script de PowerShell para configurar variables de entorno para Supabase
# Ejecuta este script antes de iniciar la aplicación

Write-Host "Configurando variables de entorno para Supabase..." -ForegroundColor Green

# Variables de base de datos
# Connection Pooler (Supavisor) - Session mode - IPv4 compatible
# Formato: postgresql://postgres.uxsjdqooafmvzdazkqgz:[PASSWORD]@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
$env:DATABASE_URL = "jdbc:postgresql://aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require"
$env:DB_HOST = "aws-1-eu-west-1.pooler.supabase.com"
$env:DB_PORT = "5432"
$env:DB_NAME = "postgres"
$env:DB_USERNAME = "postgres.uxsjdqooafmvzdazkqgz"
$env:DB_PASSWORD = "vp05UtP4NJzrdslu"

# Perfil de Spring Boot
$env:SPRING_PROFILES_ACTIVE = "prod"

# Configuración Java para mejorar resolución DNS y preferir IPv4
$env:JAVA_TOOL_OPTIONS = "-Djava.net.preferIPv4Stack=true -Djava.net.useSystemProxies=false"

# Supabase API
$env:SUPABASE_URL = "https://uxsjdqooafmvzdazkqgz.supabase.co"
$env:SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4c2pkcW9vYWZtdnpkYXprcWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Njk4NjEsImV4cCI6MjA4MDI0NTg2MX0.vDBOp3am3iKHUf3-4f6pQJEQshIJ_QX1_SgeXQVeuSc"
$env:SUPABASE_PROJECT_ID = "uxsjdqooafmvzdazkqgz"

Write-Host "Variables de entorno configuradas correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes ejecutar:" -ForegroundColor Yellow
Write-Host "  mvn spring-boot:run" -ForegroundColor Cyan
Write-Host ""
Write-Host "O si prefieres, ejecuta este script y luego en la misma ventana:" -ForegroundColor Yellow
Write-Host "  mvn spring-boot:run" -ForegroundColor Cyan

