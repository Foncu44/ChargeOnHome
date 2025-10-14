-- Verificar base de datos ChargeOnHome
USE charge_on_home;

-- Mostrar todas las tablas
SHOW TABLES;

-- Mostrar estructura de cada tabla
DESCRIBE usuarios;
DESCRIBE garajes;
DESCRIBE reservas;

-- Mostrar datos de ejemplo
SELECT 'USUARIOS:' as Tabla;
SELECT id, nombre, apellidos, email, tipo_usuario, verificado FROM usuarios;

SELECT 'GARAJES:' as Tabla;
SELECT id, propietario_id, direccion, precio_por_hora, tipo_conector, activo FROM garajes;

SELECT 'RESERVAS:' as Tabla;
SELECT id, cliente_id, garaje_id, fecha_inicio, fecha_fin, precio_total, estado FROM reservas; 