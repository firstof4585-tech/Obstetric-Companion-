import { ETHIOPIAN_MONTHS } from '../constants';

// A simplified Ethiopian calendar converter for demonstration.
// This is an approximation and might have inaccuracies.
// It assumes the Ethiopian leap year rule aligns with the Gregorian one for simplicity.

const GREGORIAN_TO_ETHIOPIAN_YEAR_DIFF = 8;
const ETHIOPIAN_NEW_YEAR_GREGORIAN_MONTH = 9; // September
const ETHIOPIAN_NEW_YEAR_GREGORIAN_DAY = 11;

export function gregorianToEthiopian(date: Date): { year: number; month: number; day: number; } {
  let gregYear = date.getFullYear();
  let gregMonth = date.getMonth() + 1;
  let gregDay = date.getDate();

  let ethiopianYear = gregYear - GREGORIAN_TO_ETHIOPIAN_YEAR_DIFF;

  // An Ethiopian leap year occurs in a Gregorian year preceding a Gregorian leap year.
  const isEthiopianLeap = new Date(gregYear, 1, 29).getDate() === 29;
  const newYearDay = isEthiopianLeap ? 12 : 11;

  if (gregMonth < ETHIOPIAN_NEW_YEAR_GREGORIAN_MONTH || (gregMonth === ETHIOPIAN_NEW_YEAR_GREGORIAN_MONTH && gregDay < newYearDay)) {
      ethiopianYear = gregYear - GREGORIAN_TO_ETHIOPIAN_YEAR_DIFF;
  } else {
      ethiopianYear = gregYear - (GREGORIAN_TO_ETHIOPIAN_YEAR_DIFF - 1);
  }
  
  let startOfEthiopianYear = new Date(gregYear, 8, newYearDay);
  if (date < startOfEthiopianYear) {
      const prevGregYear = gregYear -1;
      const isPrevEthiopianLeap = new Date(prevGregYear, 1, 29).getDate() === 29;
      const prevNewYearDay = isPrevEthiopianLeap ? 12:11;
      startOfEthiopianYear = new Date(prevGregYear, 8, prevNewYearDay);
  }

  const diffInDays = Math.floor((date.getTime() - startOfEthiopianYear.getTime()) / (1000 * 3600 * 24));
  
  let ethiopianMonth = Math.floor(diffInDays / 30) + 1;
  let ethiopianDay = (diffInDays % 30) + 1;
  
  if (ethiopianMonth > 13) {
      ethiopianMonth = 13;
      ethiopianDay = diffInDays - 360 + 1;
  }

  return { year: ethiopianYear, month: ethiopianMonth, day: ethiopianDay };
}


export function ethiopianToGregorian(year: number, month: number, day: number): Date {
  // Approximate conversion.
  const gregYear = year + GREGORIAN_TO_ETHIOPIAN_YEAR_DIFF - 1;
  const isLeap = (year % 4) === 3; // Simplified leap year rule for EC
  
  const ethiopianNewYearInGregorian = new Date(gregYear, 8, isLeap ? 12 : 11);

  const daysIntoEthiopianYear = (month - 1) * 30 + day;
  
  const resultDate = new Date(ethiopianNewYearInGregorian.getTime());
  resultDate.setDate(ethiopianNewYearInGregorian.getDate() + daysIntoEthiopianYear -1);

  return resultDate;
}

export function formatDate(date: Date | null, calendarType: 'GC' | 'EC' = 'GC'): string {
    if (!date) return 'N/A';
    if (calendarType === 'GC') {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    } else {
        const ecDate = gregorianToEthiopian(date);
        const monthName = ETHIOPIAN_MONTHS[ecDate.month - 1] || '';
        return `${ecDate.day} ${monthName} ${ecDate.year}`;
    }
}


export function formatDualDate(date: Date | null): string {
    if (!date) return 'N/A';
    const gcFormatted = formatDate(date, 'GC');
    const ecFormatted = formatDate(date, 'EC');
    return `${gcFormatted} (EC: ${ecFormatted})`;
}

export function calculateGa(lnmp: Date, today: Date): { weeks: number; days: number; } {
  const diffTime = Math.abs(today.getTime() - lnmp.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return {
    weeks: Math.floor(diffDays / 7),
    days: diffDays % 7,
  };
}

export function addWeeks(date: Date, weeks: number): Date {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + weeks * 7);
    return newDate;
}
