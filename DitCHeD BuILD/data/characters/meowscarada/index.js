import { meowscaradaData } from './meowscarada';
import { restaurantDate } from './dates/restaurantDate';

export const meowscaradaCharacter = {
  ...meowscaradaData,
  dates: [restaurantDate],
};
