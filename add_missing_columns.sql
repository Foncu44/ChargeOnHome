USE charge_on_home;

-- Agregar las columnas que faltan
ALTER TABLE usuarios ADD COLUMN metodo_pago VARCHAR(255) AFTER verificado;
ALTER TABLE usuarios ADD COLUMN fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER metodo_pago;

-- Mostrar la estructura final
DESCRIBE usuarios; 