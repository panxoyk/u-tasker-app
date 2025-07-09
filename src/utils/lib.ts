export const formatDate = (isoString: string | null | undefined): string => {
  if (!isoString) {
    return 'No';
  }
  try {
    const date = new Date(isoString);

    // Opciones para el formato de fecha y hora
    // Puedes personalizar esto según lo que necesites
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long', // 'numeric', '2-digit', 'short', 'long'
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      // hour12: true, // Si quieres formato AM/PM (true) o 24 horas (false)
      // weekday: 'long', // Para incluir el día de la semana
      // timeZoneName: 'short', // Para mostrar la abreviatura de la zona horaria (ej. PST)
    };

    // 'es-CL' para español de Chile. Puedes usar 'es' para español genérico,
    // o navigator.language para la configuración del navegador del usuario.
    return new Intl.DateTimeFormat('es-CL', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'No';
  }
};
