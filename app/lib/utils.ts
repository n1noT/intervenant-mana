import moment from 'moment';
import 'moment-timezone';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

// Recupérer les heures au format HH:MM, la fonction attend une date au format YYYY-MM-DDTHH:MM:SS
export function formatHour (date: string) {
  const hours = date.split('T')[1].split(':')[0] + ':' + date.split('T')[1].split(':')[1];

  return hours;
}

// Recupérer le jour de la semaine en français, la fonction attend une date au format YYYY-MM-DDTHH:MM:SS
export function formatDay (date: string) {
  const engDay = moment(date).tz('Europe/Paris').format('dddd');
  let day = "";

  if(engDay == "Monday"){
    day = "lundi"
  }
  if(engDay == "Tuesday"){
    day = "mardi"
  } 
  if(engDay == "Wednesday"){
    day = "mercredi"
  }
  if(engDay == "Thursday"){
    day = "jeudi"
  }
  if(engDay == "Friday"){
    day = "vendredi"
  }
  if(engDay == "Saturday"){
    day = "samedi"
  }
  if(engDay == "Sunday"){
    day = "dimanche"
  }

  return day;
}

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const formatDateToNumber = (dateStr: string) => {
  return new Date(dateStr).toISOString().split('T')[0];
}

export const getDatesOfWeek = (year: number, weekNumber: number) => {
  // Calculer le premier jour de la semaine (dimanche)
  const startOfWeek = moment()
    .year(year)
    .isoWeek(weekNumber) // Récupère la semaine ISO spécifiée
    .startOf('isoWeek') // Début de la semaine (lundi)
    .subtract(1, 'days'); // Passer au dimanche

  // Générer toutes les dates de la semaine (dimanche -> samedi)
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    weekDates.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
  }

  return weekDates;
};

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};


