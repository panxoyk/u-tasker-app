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

export const convertTimeToTimez = (timeString: string): string => {
  // Obtener la fecha actual. Necesitamos una fecha completa para construir un objeto Date válido.
  // La parte de la fecha no importa para la hora con zona horaria, pero es necesaria para el constructor de Date.
  const today = new Date();

  // Extraer horas y minutos de la cadena de hora
  const [hour, minute] = timeString.split(':').map(Number);

  // Crear un objeto Date con la fecha actual y la hora especificada.
  // Este objeto Date contendrá la hora en la zona horaria local del sistema.
  const dateTimeWithDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    hour,
    minute,
  );

  // Convertir el objeto Date a una cadena ISO 8601.
  // El formato ISO 8601 (ej: "YYYY-MM-DDTHH:mm:ss.sssZ" o "YYYY-MM-DDTHH:mm:ss.sss+HH:mm")
  // incluye la información de la zona horaria (la 'Z' para UTC o el desplazamiento '+HH:mm').
  const isoString = dateTimeWithDate.toISOString();

  // Obtener solo la parte de la hora con zona horaria de la cadena ISO 8601.
  // La parte después de la 'T' es la que necesitamos para 'timez'.
  const timezString = isoString.split('T')[1];

  return timezString;
};

export const convertDateTimeToTimestampz = (dateTimeString?: string): string => {
  // Verificar si la cadena de fecha está definida y no está vacía
  if (!dateTimeString) {
    return '';
  }
  try {
    // Crear un objeto Date a partir de la cadena de fecha.
    // new Date() interpretará la zona horaria local si no se especifica.
    const dateObj = new Date(dateTimeString);

    // Verificar si el objeto Date es válido (si la cadena pudo ser parseada)
    if (!isNaN(dateObj.getTime())) {
      // Convertir el objeto Date a una cadena ISO 8601.
      // Este formato incluye la información de la zona horaria (Z para UTC o desplazamiento).
      return dateObj.toISOString();
    } else {
      // Manejar el caso en que la cadena de fecha no es válida
      console.error(`Invalid date string provided: ${dateTimeString}`);
      return ''; // Devolver cadena vacía o lanzar un error, según la preferencia
    }
  } catch (error) {
    // Manejar errores durante la creación o conversión de Date
    console.error(`Error converting date string "${dateTimeString}" to ISOString:`, error);
    return ''; // Devolver cadena vacía en caso de error
  }
};
