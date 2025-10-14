# Script para configurar permanentemente JAVA_HOME
# Ejecutar como Administrador

Write-Host "Configurando JAVA_HOME permanentemente..." -ForegroundColor Green

# Configurar JAVA_HOME para el usuario actual
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Eclipse Adoptium\jdk-17.0.15.6-hotspot", "User")

# Obtener el PATH actual del usuario
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")

# Verificar si Java ya está en el PATH
if ($currentPath -notlike "*$env:JAVA_HOME\bin*") {
    # Agregar Java al PATH
    $newPath = "$env:JAVA_HOME\bin;$currentPath"
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "User")
    Write-Host "Java agregado al PATH" -ForegroundColor Green
} else {
    Write-Host "Java ya está en el PATH" -ForegroundColor Yellow
}

Write-Host "Configuración completada!" -ForegroundColor Green
Write-Host "Reinicia PowerShell o abre una nueva ventana para que los cambios surtan efecto." -ForegroundColor Yellow
Write-Host ""
Write-Host "Para verificar, ejecuta:" -ForegroundColor Cyan
Write-Host "echo `$env:JAVA_HOME" -ForegroundColor White
Write-Host "java -version" -ForegroundColor White
Write-Host "mvn -version" -ForegroundColor White 