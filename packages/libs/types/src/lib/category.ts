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

export const CategoryIcons: Record<CategoryType, string> = {
  Clothing: 'shirt-outline',
  Education: 'school-outline',
  Entertainment: 'game-controller-outline',
  Food: 'fast-food-outline',
  'Gifts/Donations': 'gift-outline',
  'Household Items/Supplies': 'hammer-outline',
  Housing: 'home-outline',
  'Medical/Healthcare': 'medical-outline',
  Miscellaneous: 'receipt-outline',
  Personal: 'body-outline',
  Transportation: 'bus-outline',
  Utilities: 'construct-outline',
};
