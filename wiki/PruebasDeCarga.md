# Pruebas de Carga

Para validar el rendimiento de la API se ejecutaron pruebas de carga con *k6*.

| Escenario | Usuarios Virtuales | Duración | Resultado |
|-----------|-------------------|----------|-----------|
| Lectura de Tareas | 50 | 30s | 100% solicitudes exitosas |
| Creación de Tareas | 50 | 30s | 98% solicitudes exitosas |

Los scripts y resultados detallados se almacenan en la carpeta `tests/performance`.
