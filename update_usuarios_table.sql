USE charge_on_home;

-- Agregar columnas faltantes a la tabla usuarios una por una
ALTER TABLE usuarios ADD COLUMN password VARCHAR(255) NOT NULL DEFAULT 'temp' AFTER email;
ALTER TABLE usuarios ADD COLUMN telefono VARCHAR(20) NOT NULL DEFAULT '000000000' AFTER password;
ALTER TABLE usuarios ADD COLUMN tipo_usuario ENUM('PROPIETARIO', 'CLIENTE', 'AMBOS') NOT NULL DEFAULT 'CLIENTE' AFTER telefono;
ALTER TABLE usuarios ADD COLUMN verificado BOOLEAN DEFAULT FALSE AFTER tipo_usuario;
ALTER TABLE usuarios ADD COLUMN metodo_pago VARCHAR(255) AFTER verificado;

-- Mostrar la estructura actualizada
DESCRIBE usuarios; 