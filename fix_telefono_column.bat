@echo off
echo Corrigiendo columna telefono...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pA.Foncu4848 < fix_telefono_column.sql
echo Columna telefono corregida!
pause 