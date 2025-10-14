-- Script de configuración de la base de datos ChargeOnHome
-- Ejecutar como usuario root de MySQL

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS charge_on_home 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE charge_on_home;

-- Crear tabla usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    tipo_usuario ENUM('PROPIETARIO', 'CLIENTE', 'AMBOS') NOT NULL,
    verificado BOOLEAN DEFAULT FALSE,
    metodo_pago VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_tipo_usuario (tipo_usuario)
);

-- Crear tabla garajes
CREATE TABLE IF NOT EXISTS garajes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    propietario_id BIGINT NOT NULL,
    direccion VARCHAR(500) NOT NULL,
    latitud DECIMAL(10, 8) NOT NULL,
    longitud DECIMAL(11, 8) NOT NULL,
    ancho DECIMAL(4, 2) NOT NULL,
    largo DECIMAL(4, 2) NOT NULL,
    altura DECIMAL(4, 2) NOT NULL,
    precio_por_hora DECIMAL(8, 2) NOT NULL,
    precio_electricidad DECIMAL(8, 4) NOT NULL,
    tipo_conector ENUM('TIPO_1', 'TIPO_2', 'CCS_COMBO_1', 'CCS_COMBO_2', 'CHADEMO', 'TESLA_SUPERCHARGER', 'SCHUKO') NOT NULL,
    potencia_carga DECIMAL(5, 2) NOT NULL,
    disponible24h BOOLEAN DEFAULT FALSE,
    horario_inicio TIME,
    horario_fin TIME,
    descripcion TEXT,
    fotos JSON,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (propietario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_propietario (propietario_id),
    INDEX idx_ubicacion (latitud, longitud),
    INDEX idx_tipo_conector (tipo_conector),
    INDEX idx_precio (precio_por_hora),
    INDEX idx_activo (activo)
);

-- Crear tabla reservas
CREATE TABLE IF NOT EXISTS reservas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    garaje_id BIGINT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    precio_garaje DECIMAL(8, 2) NOT NULL,
    precio_electricidad DECIMAL(8, 2) NOT NULL,
    comision_plataforma DECIMAL(8, 2) NOT NULL,
    precio_total DECIMAL(8, 2) NOT NULL,
    estado ENUM('PENDIENTE', 'CONFIRMADA', 'EN_CURSO', 'COMPLETADA', 'CANCELADA', 'NO_PRESENTADO') DEFAULT 'PENDIENTE',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (garaje_id) REFERENCES garajes(id) ON DELETE CASCADE,
    INDEX idx_cliente (cliente_id),
    INDEX idx_garaje (garaje_id),
    INDEX idx_fechas (fecha_inicio, fecha_fin),
    INDEX idx_estado (estado)
);

-- Insertar datos de ejemplo

-- Usuarios de ejemplo
INSERT INTO usuarios (nombre, apellidos, email, password, telefono, tipo_usuario, verificado) VALUES
('Juan', 'Pérez García', 'juan@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo0ycsgj/VqJxz7wcw5wUI9dcoke/a', '123456789', 'CLIENTE', TRUE),
('María', 'López Martín', 'maria@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo0ycsgj/VqJxz7wcw5wUI9dcoke/a', '987654321', 'PROPIETARIO', TRUE),
('Carlos', 'Rodríguez Sánchez', 'carlos@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo0ycsgj/VqJxz7wcw5wUI9dcoke/a', '555666777', 'AMBOS', TRUE),
('Ana', 'Fernández Ruiz', 'ana@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMye.Uo0ycsgj/VqJxz7wcw5wUI9dcoke/a', '111222333', 'PROPIETARIO', TRUE);

-- Garajes de ejemplo
INSERT INTO garajes (propietario_id, direccion, latitud, longitud, ancho, largo, altura, precio_por_hora, precio_electricidad, tipo_conector, potencia_carga, disponible24h, descripcion, fotos) VALUES
(2, 'Calle Gran Vía 28, Madrid', 40.41680000, -3.70380000, 2.50, 5.00, 2.20, 8.50, 0.25, 'TIPO_2', 11.00, TRUE, 'Garaje céntrico en el corazón de Madrid, muy fácil acceso y seguro.', '["garage1.jpg"]'),
(3, 'Avenida Diagonal 123, Barcelona', 41.38510000, 2.17340000, 2.80, 5.50, 2.50, 12.00, 0.30, 'CCS_COMBO_2', 22.00, FALSE, 'Garaje moderno con carga rápida, ideal para estancias cortas.', '["garage2.jpg"]'),
(4, 'Calle Alcalá 456, Madrid', 40.42000000, -3.69000000, 2.30, 4.80, 2.00, 6.75, 0.22, 'SCHUKO', 3.70, TRUE, 'Opción económica para cargas lentas durante la noche.', '["garage3.jpg"]'),
(2, 'Plaza España 10, Sevilla', 37.38830000, -5.97320000, 2.60, 5.20, 2.30, 9.25, 0.28, 'TIPO_2', 7.40, TRUE, 'Garaje en el centro histórico de Sevilla, muy bien ubicado.', '["garage4.jpg"]'),
(4, 'Calle Colón 89, Valencia', 39.46990000, -0.37630000, 2.40, 5.10, 2.10, 7.80, 0.24, 'CCS_COMBO_1', 50.00, FALSE, 'Carga súper rápida en Valencia, perfecto para viajes largos.', '["garage5.jpg"]');

-- Reservas de ejemplo
INSERT INTO reservas (cliente_id, garaje_id, fecha_inicio, fecha_fin, precio_garaje, precio_electricidad, comision_plataforma, precio_total, estado) VALUES
(1, 1, '2024-01-15 10:00:00', '2024-01-15 14:00:00', 34.00, 5.00, 7.80, 46.80, 'COMPLETADA'),
(3, 2, '2024-01-20 08:00:00', '2024-01-20 10:00:00', 24.00, 6.00, 6.00, 36.00, 'CONFIRMADA'),
(1, 3, '2024-01-25 20:00:00', '2024-01-26 08:00:00', 81.00, 8.80, 17.96, 107.76, 'PENDIENTE');

-- Mostrar resumen de datos insertados
SELECT 'Usuarios creados:' as Tabla, COUNT(*) as Total FROM usuarios
UNION ALL
SELECT 'Garajes creados:', COUNT(*) FROM garajes
UNION ALL
SELECT 'Reservas creadas:', COUNT(*) FROM reservas;

-- Mostrar información de conexión
SELECT 'Base de datos configurada correctamente!' as Estado;
SELECT 'Usuario de prueba: juan@example.com' as Login;
SELECT 'Contraseña: password' as Password;
SELECT 'Puedes usar estos datos para hacer login en el frontend' as Instrucciones; 