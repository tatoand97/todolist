-- Eliminar datos de prueba en orden inverso para mantener integridad referencial

-- Eliminar tareas
DELETE FROM tasks;

-- Eliminar usuarios
DELETE FROM users;

-- Eliminar categorías
DELETE FROM categories;

-- Reiniciar secuencias
ALTER SEQUENCE tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;