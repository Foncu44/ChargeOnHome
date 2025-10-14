@echo off
echo Configurando base de datos ChargeOnHome...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pA.Foncu4848 < setup_database.sql
if %errorlevel% equ 0 (
    echo Base de datos configurada correctamente!
    echo Usuario de prueba: juan@example.com
    echo Contraseña: password
) else (
    echo Error al configurar la base de datos
    echo Verifica que MySQL esté ejecutándose y la contraseña sea correcta
)
pause 