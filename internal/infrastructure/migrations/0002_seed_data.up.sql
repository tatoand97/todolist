-- Inserción de datos en la tabla de categorías
INSERT INTO categories (name, description) VALUES
    ('Hogar', 'Tareas relacionadas con la casa, limpieza, y mantenimiento.'),
    ('Trabajo', 'Pendientes y proyectos de la oficina o negocio.'),
    ('Estudio', 'Actividades académicas, cursos y formación personal.'),
    ('Compras', 'Lista de productos para el supermercado o tiendas.'),
    ('Salud', 'Citas médicas, ejercicio y seguimiento de bienestar.'),
    ('Finanzas', 'Pagos, facturas, presupuestos y ahorros.'),
    ('Proyectos Personales', 'Hobbies, desarrollo de habilidades o metas a largo plazo.'),
    ('Social', 'Eventos, reuniones con amigos y familiares.'),
    ('Viajes', 'Planificación de itinerarios, reservas y empaque.'),
    ('Entretenimiento', 'Películas, series, lectura y pasatiempos.'),
    ('Automóvil', 'Mantenimiento, revisión de aceite y reparaciones del coche.'),
    ('Mascotas', 'Cuidados, citas con el veterinario y alimentación.'),
    ('Voluntariado', 'Actividades de servicio comunitario y ayuda a otros.'),
    ('Familia', 'Tareas y responsabilidades compartidas con la familia.'),
    ('Creatividad', 'Ideas, diseño, escritura y arte.');

-- Inserción de datos en la tabla de usuarios
-- Contraseña original: dev123
INSERT INTO users (username, password_hash, profile_image_url) VALUES
    ('dev_user', '$2a$10$30tpwD81jsT.uMqVJPedLOe5kC6DKRGuYj10soW29/y9YfZVGXxAC', '/static/default.jpg');
-- Contraseña original: test_password
INSERT INTO users (username, password_hash, profile_image_url) VALUES
    ('test_user', '$2a$10$X2QtzEhqGimDnUjndNmclO65kjfKwpcP5jkoGadY.LTgD5FuY02wO', '/static/default.jpg');
-- Contraseña original: admin_pass
INSERT INTO users (username, password_hash, profile_image_url) VALUES
    ('admin', '$2a$10$k/m6vKHDoiBWUKb5Ar9Esun3JnNRF25/0B1.YtNmkXZwWCE4ZKeo6', '/static/default.jpg');
-- Contraseña original: user_pass4
INSERT INTO users (username, password_hash, profile_image_url) VALUES
    ('user4', '$2a$10$cGgNhgezLQA3Wm35.QMB5.y4/PwLGF4ABgrBkI1zQ/H5Z7F5jNs66', '/static/default.jpg');

-- Inserción de tareas para el 'dev_user' (ID 1)
INSERT INTO tasks (text, state, user_id, category_id, due_date) VALUES
    ('Actualizar el repositorio con la versión final', 'Empezada', 1, 2, '2025-09-01 23:59:59'),
    ('Revisar la documentación técnica del proyecto', 'Sin Empezar', 1, 2, '2025-08-25 23:59:59'),
    ('Implementar autenticación JWT', 'Finalizada', 1, 2, '2025-08-20 23:59:59'),
    ('Configurar base de datos PostgreSQL', 'Finalizada', 1, 2, '2025-08-18 23:59:59'),
    ('Crear endpoints de la API REST', 'Empezada', 1, 2, '2025-08-30 23:59:59'),
    ('Escribir tests unitarios', 'Sin Empezar', 1, 2, '2025-09-05 23:59:59'),
    ('Optimizar consultas de base de datos', 'Sin Empezar', 1, 2, '2025-09-10 23:59:59'),
    ('Implementar middleware de CORS', 'Finalizada', 1, 2, '2025-08-19 23:59:59'),
    ('Configurar Docker containers', 'Empezada', 1, 2, '2025-08-28 23:59:59'),
    ('Documentar API con OpenAPI', 'Sin Empezar', 1, 2, '2025-09-15 23:59:59'),
    ('Revisar código con el equipo', 'Sin Empezar', 1, 2, '2025-09-08 23:59:59'),
    ('Preparar demo para cliente', 'Sin Empezar', 1, 2, '2025-09-12 23:59:59');

-- Inserción de tareas para el 'test_user' (ID 2)
INSERT INTO tasks (text, state, user_id, category_id, due_date) VALUES
    ('Crear el plan de pruebas para la API', 'Sin Empezar', 2, 2, '2025-08-28 23:59:59'),
    ('Reportar los bugs encontrados en el login', 'Empezada', 2, 2, '2025-08-20 23:59:59'),
    ('Automatizar las pruebas de regresión', 'Sin Empezar', 2, 2, '2025-09-10 23:59:59'),
    ('Ejecutar pruebas de carga', 'Sin Empezar', 2, 2, '2025-09-05 23:59:59'),
    ('Validar endpoints de autenticación', 'Finalizada', 2, 2, '2025-08-17 23:59:59'),
    ('Probar integración con frontend', 'Empezada', 2, 2, '2025-08-25 23:59:59'),
    ('Documentar casos de prueba', 'Sin Empezar', 2, 2, '2025-09-03 23:59:59'),
    ('Revisar cobertura de código', 'Sin Empezar', 2, 2, '2025-09-07 23:59:59'),
    ('Configurar CI/CD pipeline', 'Empezada', 2, 2, '2025-08-30 23:59:59'),
    ('Realizar pruebas de seguridad', 'Sin Empezar', 2, 2, '2025-09-12 23:59:59'),
    ('Validar manejo de errores', 'Finalizada', 2, 2, '2025-08-19 23:59:59'),
    ('Probar rendimiento de la API', 'Sin Empezar', 2, 2, '2025-09-15 23:59:59');

-- Inserción de tareas para el 'admin' (ID 3)
INSERT INTO tasks (text, state, user_id, category_id, due_date) VALUES
    ('Configurar los permisos de los nuevos usuarios', 'Sin Empezar', 3, 2, '2025-08-22 23:59:59'),
    ('Revisar el informe de seguridad mensual', 'Finalizada', 3, 2, '2025-08-15 23:59:59'),
    ('Actualizar políticas de acceso', 'Empezada', 3, 2, '2025-08-26 23:59:59'),
    ('Configurar backup automático', 'Finalizada', 3, 2, '2025-08-18 23:59:59'),
    ('Monitorear logs del sistema', 'Empezada', 3, 2, '2025-08-24 23:59:59'),
    ('Implementar alertas de seguridad', 'Sin Empezar', 3, 2, '2025-09-02 23:59:59'),
    ('Revisar certificados SSL', 'Sin Empezar', 3, 2, '2025-09-08 23:59:59'),
    ('Actualizar documentación de admin', 'Sin Empezar', 3, 2, '2025-09-05 23:59:59'),
    ('Configurar firewall', 'Finalizada', 3, 2, '2025-08-16 23:59:59'),
    ('Auditar accesos de usuarios', 'Empezada', 3, 2, '2025-08-29 23:59:59'),
    ('Planificar mantenimiento del servidor', 'Sin Empezar', 3, 2, '2025-09-10 23:59:59'),
    ('Revisar métricas de rendimiento', 'Sin Empezar', 3, 2, '2025-09-12 23:59:59');

-- Inserción de tareas para el 'user4' (ID 4)
INSERT INTO tasks (text, state, user_id, category_id, due_date) VALUES
    ('Preparar la lista de la compra', 'Sin Empezar', 4, 4, '2025-08-16 23:59:59'),
    ('Ir al gimnasio 3 veces esta semana', 'Empezada', 4, 5, '2025-08-18 23:59:59'),
    ('Pagar la factura de la luz', 'Finalizada', 4, 6, '2025-08-14 23:59:59'),
    ('Limpiar la casa a fondo', 'Sin Empezar', 4, 1, '2025-08-20 23:59:59'),
    ('Comprar medicamentos', 'Empezada', 4, 5, '2025-08-17 23:59:59'),
    ('Revisar presupuesto mensual', 'Sin Empezar', 4, 6, '2025-08-25 23:59:59'),
    ('Organizar armario', 'Sin Empezar', 4, 1, '2025-08-22 23:59:59'),
    ('Hacer ejercicio cardiovascular', 'Finalizada', 4, 5, '2025-08-15 23:59:59'),
    ('Pagar tarjeta de crédito', 'Empezada', 4, 6, '2025-08-19 23:59:59'),
    ('Comprar comida para la semana', 'Sin Empezar', 4, 4, '2025-08-21 23:59:59'),
    ('Lavar el coche', 'Sin Empezar', 4, 11, '2025-08-24 23:59:59'),
    ('Planificar vacaciones', 'Empezada', 4, 9, '2025-09-01 23:59:59'),
    ('Ver película recomendada', 'Sin Empezar', 4, 10, '2025-08-26 23:59:59');