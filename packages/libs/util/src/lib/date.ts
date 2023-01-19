export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function monthName(val: Date) {
  return MONTH_NAMES[val.getMonth()];
}

export function year(val: Date) {
  return val.getFullYear();
}

export function yearMonth(val: Date) {
  return `${year(val)} ${monthName(val)}`;
}
