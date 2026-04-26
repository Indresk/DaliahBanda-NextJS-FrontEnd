const BOGOTA_OFFSET_MS = -5 * 60 * 60 * 1000;

export function getCurrentDateBogota() {
  return new Date(Date.now() + BOGOTA_OFFSET_MS);
}

export function getStreamingStart() {
  const nowBogota = Date.now() + BOGOTA_OFFSET_MS;
  const todayBogota = new Date(nowBogota);
  const daysToSunday = (7 - todayBogota.getDay()) % 7;
  
  return new Date(Date.UTC(
    todayBogota.getUTCFullYear(),
    todayBogota.getUTCMonth(),
    todayBogota.getUTCDate() + daysToSunday,
    21, 0, 0
  ));
}

export function getStreamingEnd() {
  const sunday = getStreamingStart();
  const end = new Date(sunday);
  end.setUTCHours(sunday.getUTCHours() + 2);
  return end;
}

export function getPreviousStreaming(){
  const futureDate = getStreamingEnd();
  const previousDate = new Date(futureDate);
  previousDate.setUTCDate(futureDate.getUTCDate() - 8);
  return previousDate; 
}

export function DateToESString(dateUTC, options = {}) {
  const { hours = false, day = false, all = true } = options;
  
  const dateBogota = new Date(dateUTC.getTime() + BOGOTA_OFFSET_MS);
  
  const dayStr = new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(dateBogota);
  
  const timeStr = new Intl.DateTimeFormat('es-CO', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'UTC'
  }).format(dateBogota).replace(' ', ' - ');
  
  if (day) return dayStr;
  if (hours) return timeStr;
  if (all) return `${dayStr} ${timeStr}`;
  
  return dateBogota.toISOString();
}