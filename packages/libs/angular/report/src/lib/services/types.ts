export type ReportFilter = {
  month: number;
  year: number;
};

export const getDefaultReportFilter = (): ReportFilter => {
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() -1, 1);
  return {
    month: prevMonth.getMonth(),
    year: prevMonth.getFullYear(),
  };
};

export const monthNames = [
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
