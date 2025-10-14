# Script para ejecutar el backend de ChargeOnHome
# Configura JAVA_HOME automáticamente y ejecuta Spring Boot

# Configurar JAVA_HOME para esta sesión
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.15.6-hotspot"

# Agregar Java al PATH
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"

# Verificar que Java 17 esté disponible
Write-Host "Verificando Java..." -ForegroundColor Green
java -version

Write-Host "Verificando Maven..." -ForegroundColor Green
mvn -version

Write-Host "Iniciando el backend..." -ForegroundColor Green
mvn spring-boot:run 