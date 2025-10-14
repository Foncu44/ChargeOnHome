@echo off
REM Script para ejecutar el backend de ChargeOnHome
REM Configura JAVA_HOME automáticamente y ejecuta Spring Boot

echo Configurando JAVA_HOME...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.15.6-hotspot

echo Verificando Java...
java -version

echo Verificando Maven...
mvn -version

echo Iniciando el backend...
mvn spring-boot:run

pause 