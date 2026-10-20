# Daliah Banda Page - Pendientes

- implementar Rate limiter con LRU cache si es necesario | verificar viabilidad por metodo de despliegue | verificar si solo API o tambien SSR
- implementar logger con pino de ser necesario
- Rate limit para el webhook de Kick, el login y las acciones del dashboard
- Revisión periódica de la suscripción a Kick (hoy es manual desde /dashboard/stream) y, si se quiere, sincronizar el estado en vivo consultando la API de Kick
- Si algún día hay más de una instancia: la caché ISR de Next y el estado en memoria de la llave de Kick son por instancia
