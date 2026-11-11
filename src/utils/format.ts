const dateFormat = new Intl.DateTimeFormat('es-PE', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function formatDateTime(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** Convierte el valor de un <input type="datetime-local"> a ISO-8601 (o undefined si está vacío). */
export function toIso(localValue: string): string | undefined {
  return localValue ? new Date(localValue).toISOString() : undefined;
}
