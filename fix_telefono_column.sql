USE charge_on_home;

-- Hacer la columna telefono opcional (permitir NULL)
ALTER TABLE usuarios MODIFY COLUMN telefono VARCHAR(20) NULL;

-- Mostrar la estructura actualizada
DESCRIBE usuarios; 