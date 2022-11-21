import { Timestamp } from 'firebase/firestore';

export type TransactionType = 'expense' | 'income';

export type ITransactionId = {
  id: string;
};

export type ITransactionWithoutId = {
  amount: number;
  notes: string;
  type: TransactionType;
};

export type ITransactionDate = {
  date: Timestamp;
};

export type ITransactionUserId = {
  userId: string;
};

export type ITransactionDateInput = {
  date: Date;
};

export type ITransaction = ITransactionId &
  ITransactionWithoutId &
  ITransactionDate &
  ITransactionUserId;

export type ITransactionCreateInput = ITransactionWithoutId &
  ITransactionDateInput;

export type ITransactionUpdateInput = ITransactionId &
  ITransactionWithoutId &
  ITransactionDateInput;
