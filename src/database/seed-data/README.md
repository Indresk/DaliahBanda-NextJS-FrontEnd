# seed-data

Aquí se guardan los exports JSON del dashboard (por ejemplo `gallery.json`) que leen los
seeders de `../seeders-manual`. Se descargan desde el dashboard (Galería > "Exportar JSON").

Flujo para volver a sembrar con datos actualizados:

1. Dashboard > Galería > **Exportar JSON** → guardar el archivo como `gallery.json` aquí.
2. `pnpm db:seed:gallery`

Los seeders manuales **no** entran en `db:seed:all` ni en `db:build`: así no reinsertan lo que
se borre en producción. Son idempotentes: solo insertan lo que falta (por slug o URL).
