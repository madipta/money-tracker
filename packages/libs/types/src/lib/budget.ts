import { CategoryType } from './category';

export type IBudgetId = {
  id: string;
};

export type IBudgetCreate = {
  amount: number;
  category: CategoryType | string;
};

export type IBudgetUpdate = IBudgetId & {
  amount: number;
  category: CategoryType | string;
};

export type IBudgetUser = {
  userId: string;
};

export type IBudget = IBudgetUser & {
  amount: number;
  category: CategoryType;
};

export type IBudgetWithId = IBudgetId & IBudget;
