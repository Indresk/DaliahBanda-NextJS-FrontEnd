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

### [0.0.1] - 2026-10-20

- Dashboard protegido (`/dashboard`) para roles `admin` y `member`. El proxy filtra por rol del token y cada página y acción del servidor vuelve a comprobar el rol en la base de datos (`sessionGuard.js`).
- Estado en vivo desde Kick: webhook `POST /api/v1/webhooks/kick` con verificación de firma (RSA SHA-256, llave pública pedida a Kick en tiempo de ejecución y refrescada si Kick la rota), idempotencia por id de mensaje y descarte de eventos desordenados. Guarda el estado en la tabla `stream-status`.
- Conexión con Kick por OAuth 2.1 + PKCE (`/api/v1/kick/oauth/login` y `/callback`, solo admin). Los tokens se guardan cifrados (AES-256-GCM) en `kick-credentials` y el access token se renueva solo cuando está por vencer, con bloqueo de fila para no rotar el refresh token dos veces.
- Banner "en vivo" (Header) y `/live` leen el estado desde una caché de Next con etiqueta `live-status`: el webhook la invalida y las páginas estáticas se regeneran con el valor nuevo. `LiveStatusRefresher` vuelve a pedir la ruta al volver a la pestaña (máx. 1 vez cada 30 s). Respaldo: la caché caduca a los 15 min y un "en vivo" sin evento de cierre se ignora pasadas 12 h.
- Páginas públicas con `Cache-Control: public, max-age=0, must-revalidate` (en `next.config.ts`): sin esto el navegador servía una vez la versión anterior (stale-while-revalidate de ISR) y el banner llegaba con un ciclo de retraso.
- Dashboard: gestión de correos permitidos, suscriptores del footer (con descarga CSV de activos) y assets en Cloudflare R2 (explorador por carpetas, sin sobrescribir). Los archivos se suben **directo del navegador a R2** con una URL firmada de 5 min (no pasan por el servidor): `createAssetUpload` valida y firma, y `confirmAssetUpload` comprueba después el tamaño (máx. 50 MB) y la firma real del archivo, y borra el objeto si no cumple (R2 no soporta POST con política para imponerlo al recibir).
- Migraciones nuevas: `stream-status` y `kick-credentials`. La de `allowed-emails` ahora crea `createdAt/updatedAt` (sin ellas no se podía añadir un correo). Mientras no haya producción se editan las migraciones existentes: para aplicar el cambio hay que recrear la base de desarrollo.
- `apiAuth.middleware.js` ya no deja pasar sin autenticación las rutas que contienen "webhook".
- Reorganización para mantenibilidad (ver `ARCHITECTURE.md`): schemas de zod en `src/shared/schemas/` (se eliminó `utils/zodSchemas.js`), constantes divididas por dominio, `kick.service.js` separado en servicios de credenciales, suscripción, OAuth y webhook, repositorio propio para R2, utilidades de cifrado/firma/CSV/validación, componentes `ui` genéricos y hook `useAssetUploads`.
- `navigationLinks` pasó a su propio archivo (lo usan Header, de servidor, y MobileMenu, de cliente).

#### Configuración necesaria para desplegar

- Variables nuevas obligatorias (también en **build** en Coolify): `KICK_CLIENT_ID`, `KICK_CLIENT_SECRET`, `KICK_BROADCASTER_ID`, `KICK_REDIRECT_URI`, `ENCRYPTION_KEY` (`openssl rand -base64 32`; cada uso deriva su propia clave a partir de ella), `CLOUDFLARE_ACCESS_KEY_ID`, `CLOUDFLARE_SECRET_ACCESS_KEY`, `CLOUDFLARE_R2_ENDPOINT`, `CLOUDFLARE_R2_BUCKET_NAME`, `CLOUDFLARE_R2_PUBLIC_URL`.
- En el portal de desarrolladores de Kick: Redirect URL = `https://<dominio>/api/v1/kick/oauth/callback` (debe coincidir con `KICK_REDIRECT_URI`) y Webhook URL = `https://<dominio>/api/v1/webhooks/kick`.
- Configurar **CORS en el bucket de R2** (Cloudflare → R2 → bucket → Settings → CORS policy), necesario para la subida directa desde el navegador:
  ```json
  [
    {
      "AllowedOrigins": ["https://daliahbanda.com", "http://localhost:3000"],
      "AllowedMethods": ["PUT"],
      "AllowedHeaders": ["content-type", "cache-control"],
      "ExposeHeaders": ["ETag"],
      "MaxAgeSeconds": 3600
    }
  ]
  ```
- Ejecutar `pnpm db:migrate`. Después, entrar como admin a `/dashboard/stream` y pulsar "Conectar con Kick".

### [0.0.1] - 2026-10-21

- Metadata y SEO (`src/frontend/seo/`, ver `ARCHITECTURE.md`): `metadataBase`, plantilla de título (`%s | Daliah Banda`), canonical, robots, Open Graph y Twitter en todas las páginas públicas, tomando como base el `meta/` del proyecto viejo. Las páginas sin contenido real (about-us, discografía, canciones, galería por filtro y evento, backstage) salen con `noindex` hasta publicarlas; las privadas solo llevan título.
- JSON-LD: `MusicGroup` en el inicio (miembros tomados de `shared/lib/intregantes.js`, redes sociales completas) y `VideoObject` en `/live` calculado al renderizar con el horario real y el estado en vivo del webhook (antes se congelaba al compilar).
- Cambios respecto al meta viejo: `og:type` `website` (`music.group` no existe) y `video.other` en `/live`; se descartan las etiquetas `music:*` (no son estándar); `og:video` apunta al reproductor de Kick.
- Pendiente: la imagen social sigue siendo el `.webp` de 1281×675 (conviene un JPG/PNG de 1200×630 en `site.js`) y `/albums` está en `sitemap.js` aunque ahora es `noindex`.

### [0.0.1] - 2026-10-22

- Galería en base de datos: tablas `gallery-images`, `gallery-events` y `gallery-people` (una migración cada una) y seeder idempotente con las 271 imágenes de `src/shared/lib/galleryImages.json` (17 eventos, 12 personas). Los títulos de los eventos pequeños se infirieron del texto alt de sus fotos (revisarlos en Galería > Eventos).
- Lecturas eficientes: paginación por cursor, 5 índices (incluido GIN para integrantes), contadores por filtro y cambios masivos en una sola sentencia. Con 61.000 filas sintéticas los listados públicos tardan menos de 0,1 ms y usan índice sin ordenar en memoria.
- Dashboard > Galería: listado con filtros (categoría, evento, integrantes todos/alguno, estado, fechas, texto, sin alt) y paginación; añadir, editar y eliminar (con opción de borrar también el archivo del bucket); activar, desactivar, eliminar y editar evento, categoría, fecha o integrantes en lote; subida en lote al bucket registrando las imágenes; gestión de eventos e integrantes. Botón "Añadir a galería" en Assets. Una imagen solo se puede publicar con texto alternativo.
- Galería pública (`/gallery`, `/gallery/<integrante>`, `/gallery/events/<evento>`, `/gallery/backstage`) lee de la base de datos con caché invalidada desde el dashboard, "Ver más" por cursor, 404 para slugs inexistentes y entradas en el sitemap. Se eliminó `FilterView.jsx` (usaba Firebase). `src/shared/lib/eventsFrames.js` ya no se usa.
- Correcciones: el cursor del listado del dashboard daba error por una columna ambigua con el JOIN; Postgres usa el código 23001 (no 23503) para `RESTRICT`; los formularios vaciaban lo escrito cuando el servidor rechazaba el envío.
- Datos: en el JSON los nombres de archivo de los eventos `grange` y `garage` parecen estar intercambiados respecto a su alt y evento (se respetó el evento y el alt).

