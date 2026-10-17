# Reproductor de audio: ajustes realizados

Fecha: 2026-10-15

El reproductor ya actualiza bien el tiempo, la duración y la barra de progreso, y los saltos con click, arrastre o teclado caen en el punto elegido. Además se le dieron estilos básicos con Tailwind.

## Problemas encontrados

| # | Síntoma | Causa |
| --- | --- | --- |
| 1 | Al pausar o reanudar, la canción volvía a 0 y el tiempo y la duración se reiniciaban. | El efecto de carga comparaba `audio.currentSrc` (URL absoluta, `http://localhost:3000/track-1.mp3`) con `track.src` (relativa, `/track-1.mp3`). Nunca coincidían, así que cada cambio de `isPlaying` volvía a ejecutar `audio.src = ...` y `audio.load()`. |
| 2 | La barra y el tiempo "saltaban" o no respetaban el punto elegido. | Había dos fuentes de verdad para el tiempo: el `<audio>` y el store. Un efecto reescribía `audio.currentTime` con el valor del store cada vez que la diferencia superaba 0,8 s, y competía con los eventos `timeupdate` y con la recarga del punto 1. |
| 3 | Arrastrar la barra producía saltos erráticos. | Cada movimiento del arrastre hacía un seek real mientras `timeupdate` seguía escribiendo el tiempo en el store y movía el control debajo del cursor. |
| 4 | La duración a veces quedaba en `0:00`. | Solo se escuchaba `loadedmetadata`. Si la duración cambiaba después (`durationchange`) o al cargar otra pista, no se reiniciaba. |
| 5 | Volver a pulsar la misma canción no la reiniciaba. | El store ponía `currentTime: 0`, pero el `<audio>` no se recargaba porque el `src` era el mismo. |
| 6 | El botón de play podía quedar desincronizado. | Si el navegador bloqueaba `play()` (política de autoplay) o se pausaba desde fuera (teclas multimedia), el store seguía con `isPlaying: true`. |
| 7 | "Anterior" con más de 3 s dependía del tiempo del store, que podía estar desfasado. | La lógica estaba en el store, sin acceso al tiempo real del `<audio>`. |
| 8 | Rendimiento y ruido. | `console.log(currentTime)` en cada actualización y suscripción a todo el store. |
| 9 | Sin estilos. | Las clases `player__*` no existían en ningún CSS. |

## Cambios por archivo

### `src/frontend/stores/playerStore.tsx`

- Nuevo campo `loadId`: se incrementa en `playTrack`, `playByIndex`, `setQueue`, `next` y `prev`. El reproductor carga la pista cuando cambia `loadId`, en lugar de comparar URLs. Esto resuelve los puntos 1 y 5.
- Nueva acción `setIsPlaying(boolean)` para que los eventos nativos `play` y `pause` del `<audio>` mantengan el store sincronizado (punto 6).
- `next` y `prev` usan `playByIndex` (reinician tiempo y duración e incrementan `loadId`). Al terminar la última pista, el reproductor se detiene.
- `prev` ya no decide si reiniciar la pista; eso pasó al componente (punto 7).
- `setVolume` limita el valor entre 0 y 1.

### `app/_components/global/AudioPlayer/AudioPlayer.jsx` (reescrito)

- **El `<audio>` es la única fuente de verdad del tiempo.** Se eliminó el efecto que escribía `audio.currentTime` desde el store (punto 2). El store solo refleja los eventos `timeupdate`, `seeked`, `loadedmetadata`, `durationchange` y `emptied` (punto 4).
- **Carga por `loadId`:** un efecto `[loadId, trackSrc]` hace `audio.src = ...` y `audio.load()`.
- **Play/pausa:** un efecto llama `play()` o `pause()` según `isPlaying` y el estado real de `audio.paused`. Si `play()` falla por algo distinto de `AbortError`, el store vuelve a `isPlaying: false`. El `AbortError` es esperado cuando una carga nueva interrumpe la anterior.
- **Seek en dos fases (punto 3):** mientras se arrastra, `onChange` solo actualiza un estado local `scrubTime`, que mueve la barra y el texto. El salto real (`audio.currentTime = valor`) se aplica en el evento nativo `change` del `<input type="range">`, que se dispara al soltar el mouse o con cada tecla (flechas, Inicio, Fin).
- **`<audio>` siempre montado** en la misma posición del árbol, aunque no haya pista, para no perder el elemento entre renders.
- **"Anterior":** si la pista lleva más de 3 s, o es la primera de la cola, se reinicia con `audio.currentTime = 0`; si no, se pasa a la pista anterior.
- **Botón "siguiente"** deshabilitado en la última pista.
- **Volumen** con botón de silenciar, que recuerda el último volumen.
- Suscripción al store con `useShallow` y sin `console.log` (punto 8).
- Accesibilidad: `aria-label` en todos los controles y `aria-valuetext` en la barra ("0:17 de 0:32").

### `app/_components/global/AudioPlayer/player.css` (nuevo)

- Estilos de los `<input type="range">` (barra de progreso y volumen): la parte recorrida se pinta con la variable CSS `--progress`, que actualiza el componente, y el thumb es blanco, con versiones para Chrome/Safari y Firefox.

### Estilos (punto 9)

- Barra inferior `sticky bottom-0` en lugar de `fixed`. Como es el último elemento del `<body>`, queda pegada abajo al hacer scroll pero no tapa el footer al llegar al final de la página.
- Escritorio: pista (portada, título, artista) | controles y barra | volumen.
- Móvil: pista y controles en la primera fila, barra en la segunda; el volumen se oculta (se usa el del dispositivo).
- Colores del tema (`bg-darkgray`, `bg-primary`, `primary-light`) e iconos de Material Symbols.
- La portada usa `next/image` con `unoptimized`, porque las portadas demo vienen de Unsplash, que no está en `remotePatterns`.

### `app/test-player/page.jsx` (nuevo, **temporal**)

- Página de prueba en `/test-player` con las dos pistas demo de `src/shared/lib/tracks.ts`. Tiene `robots: noindex`. **Borrar la carpeta `app/test-player` cuando ya no se necesite.**

## Verificación

Se probó en Chrome (headless) contra `pnpm dev`, en `/test-player`, sin errores en consola:

| Prueba | Resultado |
| --- | --- |
| Reproducir pista 1 | El tiempo avanza (0:02 → 0:04) y la duración muestra 0:32. |
| Pausar 1,5 s | El tiempo queda fijo en 0:04. |
| Reanudar | Continúa desde 0:04, no desde 0. |
| Click al 50 % de la barra | Salta a 0:17 (mitad de 32,6 s). |
| Arrastrar del 20 % al 75 % | Mientras se arrastra solo cambia la vista previa (0:24); al soltar salta a 0:25. |
| Tecla Inicio sobre la barra | Vuelve a 0:00. |
| Siguiente | Carga la pista 2 con su duración (1:21). |
| Anterior con más de 3 s | Reinicia la misma pista. |
| Anterior con menos de 3 s | Pasa a la pista anterior; en la primera, la reinicia. |
| Fin de la última pista | Se detiene; el botón vuelve a "Reproducir". |
| Play después del fin | Reinicia la pista desde 0. |
| Volver a pulsar la misma pista | Empieza desde 0. |

## Pendiente

- Conectar `PlayButton` en las páginas de álbum y canción cuando existan datos reales (ahora están comentados).
- Reemplazar las pistas demo de `tracks.ts` por las canciones de la banda.
- Opcional: Media Session API (título y portada en la pantalla de bloqueo y teclas multimedia del sistema).
