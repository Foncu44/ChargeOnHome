@echo off
echo Actualizando tabla usuarios...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pA.Foncu4848 < update_usuarios_table.sql
echo Tabla usuarios actualizada correctamente!
pause 