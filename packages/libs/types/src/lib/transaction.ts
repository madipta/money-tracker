import { Timestamp } from 'firebase/firestore';

export type TransactionType = 'expense' | 'income';

export type ITransactionId = {
  id: string;
};

export type ITransactionWithoutId = {
  amount: number;
  type: TransactionType;
  notes: string;
};

export type ITransactionDate = {
  date: Timestamp;
};

export type ITransactionDateInput = {
  date: Date;
};

export type ITransaction = ITransactionId &
  ITransactionWithoutId &
  ITransactionDate;

export type ITransactionCreateInput = ITransactionWithoutId &
  ITransactionDateInput;

export type ITransactionUpdateInput = ITransactionId &
  Partial<ITransactionWithoutId> &
  ITransactionDateInput;
