import { Timestamp } from 'firebase/firestore';

export type TransactionType = 'expense' | 'income';

export type ITransaction = {
  amount: number;
  type: TransactionType;
  notes: string;
  id: string;
  date: Timestamp;
};

export type ITransactionWithoutId = Omit<ITransaction, 'id'>;
