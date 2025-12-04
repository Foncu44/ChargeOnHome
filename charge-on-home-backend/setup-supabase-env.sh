#!/bin/bash
# Script de Bash para configurar variables de entorno para Supabase
# Ejecuta este script antes de iniciar la aplicación: source setup-supabase-env.sh

echo "Configurando variables de entorno para Supabase..."

# Variables de base de datos
# Connection Pooler (Supavisor) - Session mode - IPv4 compatible
export DATABASE_URL="jdbc:postgresql://aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require"
export DB_HOST="aws-1-eu-west-1.pooler.supabase.com"
export DB_PORT="5432"
export DB_NAME="postgres"
export DB_USERNAME="postgres.uxsjdqooafmvzdazkqgz"
export DB_PASSWORD="vp05UtP4NJzrdslu"

# Perfil de Spring Boot
export SPRING_PROFILES_ACTIVE="prod"

# Supabase API
export SUPABASE_URL="https://uxsjdqooafmvzdazkqgz.supabase.co"
export SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4c2pkcW9vYWZtdnpkYXprcWd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2Njk4NjEsImV4cCI6MjA4MDI0NTg2MX0.vDBOp3am3iKHUf3-4f6pQJEQshIJ_QX1_SgeXQVeuSc"
export SUPABASE_PROJECT_ID="uxsjdqooafmvzdazkqgz"

echo "Variables de entorno configuradas correctamente!"
echo ""
echo "Ahora puedes ejecutar:"
echo "  mvn spring-boot:run"
echo ""
echo "O si prefieres, ejecuta este script con source y luego:"
echo "  source setup-supabase-env.sh"
echo "  mvn spring-boot:run"

