export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

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

export const getWeeksOfYear = (year: number) => {
  const weeks = [];
  let date = new Date(year, 0, 1);

  // Get the first Monday of the year
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() + 1);
  }

  let weekNumber = 1;

  // Loop through the year, week by week
  while (date.getFullYear() === year) {
    const startOfWeek = new Date(date);
    date.setDate(date.getDate() + 6);
    const endOfWeek = new Date(date);

    weeks.push({
        weekNumber,
        startOfWeek: startOfWeek.toISOString().split('T')[0],
        endOfWeek: endOfWeek.toISOString().split('T')[0],
    });

    date.setDate(date.getDate() + 1);
    weekNumber++;
  }

  return weeks;
};

export const getDatesOfWeek = (year: number, weekNumber: number) => {
  const firstDayOfYear = new Date(year, 0, 1);
  let daysOffset = (weekNumber - 1) * 7;

  // Adjust to the first Monday of the year
  while (firstDayOfYear.getDay() !== 1) {
    firstDayOfYear.setDate(firstDayOfYear.getDate() + 1);
  }

  // Calculate the start date of the specified week
  const startDate = new Date(firstDayOfYear);
  startDate.setDate(startDate.getDate() + daysOffset);

  // Get all days of the week
  const weekDates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    weekDates.push(date.toISOString().split('T')[0]);
  }

  // Handle the case where the week spans two years
  const lastDateOfWeek = new Date(startDate);
  lastDateOfWeek.setDate(startDate.getDate() + 6);
  if (lastDateOfWeek.getFullYear() !== year) {
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      if (date.getFullYear() !== year) {
        weekDates[i] = date.toISOString().split('T')[0];
      }
    }
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


