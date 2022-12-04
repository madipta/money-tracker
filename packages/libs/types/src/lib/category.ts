export const CategoryNames = [
  'Clothing',
  'Education',
  'Entertainment',
  'Food',
  'Gifts/Donations',
  'Household Items/Supplies',
  'Housing',
  'Medical/Healthcare',
  'Miscellaneous',
  'Personal',
  'Transportation',
  'Utilities',
] as const;

export type CategoryType = typeof CategoryNames[number];

export type ICategory = {
  category: CategoryType;
};
