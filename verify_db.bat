@echo off
echo Verificando base de datos ChargeOnHome...
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -pA.Foncu4848 < verify_db.sql
pause 