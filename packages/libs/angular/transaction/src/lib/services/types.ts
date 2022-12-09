export type TransactionFilter = {
  month: number;
  type: string | null;
  word: string | null;
  year: number;
};

export const getDefaultTransactionFilter = (): TransactionFilter => {
  return {
    month: new Date().getMonth(),
    type: '',
    word: '',
    year: new Date().getFullYear(),
  };
};

export const IOChartFilterValues = ['3', '6', '12'] as const;

export type IOChartFilterType = typeof IOChartFilterValues[number];

export const monthlyChartNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
