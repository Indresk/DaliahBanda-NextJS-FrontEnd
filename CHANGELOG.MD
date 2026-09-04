# Daliah Banda Page - CHANGELOG

## [0.0.1] - 2026-08-29

- Re estructuración de arquitectura de carpetas y archivos separando app para rutas y src para utilidades de front y logica de backend.
- Bases de vinculación inicial con base de datos SQL (planeado para PostgreSQL) y configuración de ORM (Sequelize).
- Se comenzó el proceso de retirar TypeScript y migrar a JavaScript para simplificar el desarrollo y reducir la complejidad del proyecto.
- Bases de autenticación oAuth con google

### [0.0.1] - 2026-09-04

- Se implementó la funcionalidad de autenticación oAuth con Google, permitiendo a los usuarios iniciar sesión utilizando sus cuentas de Google.
- Se configuró la base de datos para almacenar información de usuarios autenticados y se establecieron relaciones básicas entre las tablas.
- Se configuro el bloqueo de logeo con base en la lista de correos permitidos desde .env, para restringir el acceso a usuarios no autorizados.
