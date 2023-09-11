import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

function useConvertToBuenosAiresTime(initialUtcDate) {
  const [buenosAiresDate, setBuenosAiresDate] = useState(null);

  useEffect(() => {
    if (initialUtcDate) {
      // Crear una instancia de DateTime a partir de la fecha UTC
      const utcDateTime = DateTime.fromISO(initialUtcDate, { zone: 'utc' });

      // Aplicar el desplazamiento de tiempo de Buenos Aires (GMT-3)
      const buenosAiresDateTime = utcDateTime.minus({ hours: 3 });

      // Formatear la fecha y hora en el formato deseado
      const formattedDateTime = buenosAiresDateTime.toFormat("ccc LLL dd yyyy HH:mm:ss 'GMT'ZZZZZ");

      // Establecer la fecha y hora en Buenos Aires como estado
      setBuenosAiresDate(formattedDateTime);
    }
  }, [initialUtcDate]);

  return buenosAiresDate;
}

export default useConvertToBuenosAiresTime;
