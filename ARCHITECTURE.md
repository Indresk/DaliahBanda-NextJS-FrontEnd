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

- **Export y seed**: Dashboard > Galería > "Exportar JSON" (`galleryExport.service.js`, formato
  vía `jsonDownloadResponse`) referencia por slug, no por id. Se guarda en
  `src/database/seed-data/` y `pnpm db:seed:gallery` lo siembra con el seeder de
  `src/database/seeders-manual/` (idempotente y fuera de `db:seed:all`/`db:build`, para no
  reinsertar lo que se borre en producción).

## Miembros y flyers

- **Miembros** (`members`, `member-links`, `member-images`): una página personal por miembro. Son la
  entidad principal; `gallery-people` sigue siendo solo una etiqueta con estado para organizar fotos y
  se vincula con `gallery-people.memberId` (opcional, único, `ON DELETE SET NULL`).
- **Flyers** (`flyers`): url, alt, orden y activo (el carrusel usa `fill`, no guarda dimensiones).
- Lectura pública cacheada con `members.cache.js` / `flyers.cache.js` (etiquetas `members` y `flyers`);
  toda acción que los modifique invalida su etiqueta.
- Enlaces e imágenes de apoyo comparten operaciones (`childOperations` en el servicio,
  `childRepository` en el repositorio, `childActions` en las acciones).
- Todas las secciones exportables usan `createExportRoute(sección, build)` y los seeders de
  `seeders-manual/` comparten `seed-helpers.js`. La carga inicial de flyers y miembros es un seeder normal
  (se ejecuta una vez) que reutiliza el manual.

## Música

- Tablas: `albums` (incluye sencillos: `type` = album | ep | single; un sencillo es un álbum de una
  canción), `songs` (`albumId` obligatorio, `RESTRICT`), `album-links` / `song-links` (plataforma + URL,
  una por plataforma) y `song-resources` (stem | score | lyrics | video, con instrumento para los stems).
- Rutas públicas: `/albums` (álbumes y sencillos), `/albums/[album]` (pistas), `/albums/[album]/[song]`
  y `/albums/[album]/[song]/(stems|partituras|letra-y-acordes)`. Una canción es pública solo si ella y
  su álbum están activos.
- Consultas: el álbum se lee con 3 consultas (álbum + pistas + enlaces; las hijas con `separate`, sin
  producto cartesiano) y cada pista trae `resourceKinds` con una subconsulta (sin consultas por pista).
  Todas se cachean en `music.cache.js` (etiqueta `music`) y el layout y la página del álbum comparten
  la misma entrada. "Otros de nuestros trabajos" son 1 álbum + 2 canciones más recientes, automático.
- La canción recomendada del inicio es la `featured` más reciente. El reproductor recibe pistas con
  `toPlayerTrack` (`audioUrl`); `song.coverUrl` es opcional y si falta se usa la del álbum.
- Enlaces, imágenes y recursos usan `childRepository` / `childOperations` / `childActions`.
- Export: `/dashboard/music/export` (álbumes con canciones, enlaces y recursos anidados, por slug) y
  `pnpm db:seed:music`.

## Sobre nosotros, integrantes y migas

- `/about-us` (info general), `/about-us/members` (miembros activos + línea del tiempo de la
  formación) y `/about-us/members/[slug]` (página personal; 404 si no está activo). Lecturas
  cacheadas en `members.cache.js` (`getActiveMembers`, `getMember`, `getLineupTimeline`).
- La formación es la tabla `lineup-entries` (persona, rol, año de inicio y fin, `memberId`
  opcional que enlaza a su página) editable en `/dashboard/lineup`, con export y `pnpm db:seed:lineup`.
- **Migas de pan** con rutas paralelas: `app/albums/@breadcrumb` y `app/about-us/@breadcrumb`
  pintan `ui/Breadcrumb` en el servidor con los títulos reales. La lógica de las migas está en
  `_lib/breadcrumbs.js` de cada sección y la reutiliza el JSON-LD (`BreadcrumbList`). Una ruta
  nueva bajo esas secciones necesita su carpeta en `@breadcrumb` (si no, no muestra migas).

## Metadata y SEO

Todo vive en `src/frontend/seo/` (es de frontend: el backend no la necesita).

- `site.js`: datos del sitio (URL, nombre, @usuario, redes, imagen por defecto). Se escriben una vez.
- `pages/*.meta.js`: el contenido de cada página (título, descripción, ruta, keywords).
- `buildMetadata.js`: convierte ese contenido en el `metadata` de Next (canonical, robots,
  Open Graph y Twitter completos) y define `rootMetadata` (`metadataBase`, plantilla de título).
- `schema/*.js` + `JsonLd.jsx`: datos estructurados (schema.org) como JSON-LD: `MusicGroup` (home, con
  miembros, álbumes y canciones de la base), `MusicAlbum`, `MusicRecording`, `Person` y `BreadcrumbList`.
  Se enlazan entre sí con `@id` (`schema/ids.js`).

Reglas: una página pública **no** escribe `metadata` a mano; hace
`export const metadata = buildMetadata(xxxMeta)` (o `generateMetadata` si depende de la ruta).
Una página sin contenido real lleva `indexable: false` hasta publicarla. Las páginas privadas
solo declaran `export const metadata = { title }`. Los constructores de JSON-LD reciben los
datos ya calculados (fechas, estado en vivo) y no leen nada del servidor.

## Migraciones

El proyecto ya está en producción: **no se editan migraciones existentes**, cada cambio de esquema
es una migración nueva. En desarrollo se aplican con `pnpm db:migrate` (o se recrea la base con
`pnpm dev:db`: crea, migra, siembra y arranca).
