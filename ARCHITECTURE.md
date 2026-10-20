# Arquitectura

Dónde va cada cosa y qué puede importar a qué. Si dudas dónde poner código nuevo, sigue
la regla de la capa: cada archivo tiene **una** responsabilidad.

## Carpetas

```
app/                      Rutas (App Router). Solo orquestan: leen la petición, llaman a un
│                         servicio y devuelven la respuesta. Sin reglas de negocio.
├── (admin)/dashboard/    Dashboard protegido. `_components/` (específicos del dashboard),
│                         `_lib/` (config y helpers de vista), `<sección>/_lib/` (helpers de esa página)
├── api/                  Rutas API: webhooks, OAuth de Kick, API REST con API key
└── _components/          Componentes de página pública

src/
├── backend/              Solo servidor (`import 'server-only'`)
│   ├── actions/          Server Actions: un guard de rol + una llamada a un servicio
│   ├── config/           Variables de entorno (validadas al arrancar), base de datos, Auth.js
│   ├── errors/           AppError
│   ├── integrations/     Clientes de APIs externas (Kick, Cloudflare R2). Solo HTTP/SDK
│   ├── middlewares/      Autenticación de peticiones (API key, webhook de Kick, proxy)
│   ├── models/           Modelos de Sequelize
│   ├── repositories/     Acceso a datos (Postgres y R2). Sin reglas de negocio
│   ├── services/         Reglas de negocio. Usan repositorios, integraciones y utils
│   └── utils/            Funciones sin estado de negocio (cifrado, validación, firmas, CSV)
├── frontend/             Solo navegador/UI
│   ├── components/       `ui/` (Card, Badge...), `buttons/`, `util/`
│   ├── hooks/            Hooks (estado y flujos de cliente)
│   ├── seo/              Metadata y datos estructurados (ver "Metadata y SEO")
│   ├── stores/           Zustand
│   └── utils/            Utilidades de navegador (XHR con progreso...)
├── shared/               Importable desde servidor y navegador
│   ├── constants/        Un archivo por dominio (kick.js, assets.js...) + index.js
│   ├── errors/           Códigos y diccionario de errores
│   ├── schemas/          Schemas de zod por dominio. TODA validación de entrada va aquí
│   └── utils/            Funciones puras (fechas, formato)
└── database/             Migraciones y seeders de Sequelize
```

## Flujo de una operación

`Server Action / ruta API` → `servicio` → `repositorio` / `integración`

- La **action** solo comprueba el rol (`guardedRequest`) y llama al servicio.
- El **servicio** valida la entrada con un schema (`parseOrThrow(schema, valor)`), aplica
  las reglas y devuelve `successResponseWrapper(...)` o lanza `AppError`.
- El **repositorio** habla con Postgres o R2 y no conoce las reglas.
- Los **errores** salen siempre como `AppError(ERROR_CODES.X)`; el mensaje por defecto está
  en `shared/errors/error.dictionary.js`.

## Reglas

- **Validación**: nada de `typeof`/`Number.isInteger`/regex en línea dentro de servicios. Se
  define un schema en `shared/schemas/` y se usa `parseOrThrow`. Una regla puede indicar su
  código de error con `params: { code: ERROR_CODES.X }`.
- **Cifrado**: una sola `ENCRYPTION_KEY`, pero cada uso pasa un propósito
  (`ENCRYPTION_PURPOSES`) y deriva su propia clave. Un uso nuevo = un propósito nuevo.
- **Roles**: el proxy filtra con el rol del token; páginas y acciones vuelven a comprobarlo
  contra la base de datos (`requirePageRole` / `requireRole` / `guardedRequest`).
- **Caché del estado en vivo**: se lee con `getLiveStatus()` y solo se invalida con
  `invalidateLiveStatus()` (ambos en `services/liveStatus.cache.js`).
- **Componentes**: lo genérico va a `src/frontend/components/ui`; lo de una sola sección
  se queda en su carpeta `_components`. La lógica de cliente reutilizable va en un hook.
- **Constantes**: en `shared/constants/<dominio>.js` y re-exportadas en `index.js`.
- **Nombres**: `x.service.js`, `x.reposity.js`, `x.actions.js`, `x.middleware.js`, `x.client.js`,
  `x.schema.js`.

## Galería

Datos en tres tablas: `gallery-images`, `gallery-events` y `gallery-people`.

- **Integrantes como arreglo** (`memberSlugs TEXT[]` con índice GIN) y evento como clave
  foránea. Una sola tabla para filtrar y editar en lote; no hay clave foránea hacia
  `gallery-people`, así que el servicio valida los slugs (`assertPeopleExist`) y bloquea
  borrar una persona en uso.
- **Fecha de la foto** en `takenAt` (DATEONLY). El `createdAt` de Sequelize es la fecha de la fila.
- **Paginación por cursor** `(takenAt, id)` con comparación de filas: nunca `OFFSET`. Las
  columnas del cursor llevan el nombre de la tabla (el listado del dashboard hace JOIN).
- **Cada filtro nuevo** debe poder servirse por un índice: antes de añadirlo, revisar con
  `EXPLAIN` que no hay `Seq Scan` ni `Sort` (los índices están en la migración de imágenes).
- **Cambios masivos** en una sola sentencia (`WHERE id = ANY($1)`); publicar solo afecta a las
  imágenes con `alt`.
- **Lectura pública cacheada**: `gallery.cache.js` (`getGalleryPage`, `getGalleryEvents`...) con
  la etiqueta `gallery`; toda acción que modifique la galería llama a `invalidateGallery()`.
- **URLs de cualquier dominio https**: `isOptimizedImageUrl` decide si `next/image` optimiza o
  sirve sin optimizar (con un dominio no configurado `next/image` rompe la página).
- **Formularios**: `useFormAction` en vez de la prop `action` del `<form>`, porque React 19
  vacía los campos tras cada acción, incluso si falló.

## Metadata y SEO

Todo vive en `src/frontend/seo/` (es de frontend: el backend no la necesita).

- `site.js`: datos del sitio (URL, nombre, @usuario, redes, imagen por defecto). Se escriben una vez.
- `pages/*.meta.js`: el contenido de cada página (título, descripción, ruta, keywords).
- `buildMetadata.js`: convierte ese contenido en el `metadata` de Next (canonical, robots,
  Open Graph y Twitter completos) y define `rootMetadata` (`metadataBase`, plantilla de título).
- `schema/*.js` + `JsonLd.jsx`: datos estructurados (schema.org) como JSON-LD.

Reglas: una página pública **no** escribe `metadata` a mano; hace
`export const metadata = buildMetadata(xxxMeta)` (o `generateMetadata` si depende de la ruta).
Una página sin contenido real lleva `indexable: false` hasta publicarla. Las páginas privadas
solo declaran `export const metadata = { title }`. Los constructores de JSON-LD reciben los
datos ya calculados (fechas, estado en vivo) y no leen nada del servidor.

## Migraciones

Mientras el proyecto no esté en producción se editan las migraciones existentes en vez de
añadir nuevas (hay una por tabla). Para aplicar un cambio en desarrollo hay que recrear la
base: borrarla y correr `pnpm dev:db` (crea, migra, siembra y arranca).
