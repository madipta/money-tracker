import { Timestamp } from "firebase/firestore";

export type ITransaction = {
  amount: number;
  type: 'expense' | 'income';
  notes: string;
  id: string;
  date: Timestamp;
}
