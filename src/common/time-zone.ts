import { formatInTimeZone } from 'date-fns-tz';
import { envs } from 'src/config';

//Cambia la fecha y la hora universal a la zona horaria establecida en las variables de entorno
export const changeTimeZone = (date: Date | string | number): string => {
  const dateObject = date ? new Date(date) : new Date();
  return formatInTimeZone(dateObject, envs.tz, 'yyyy-MM-dd HH:mm:ss');
};
