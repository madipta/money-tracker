import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { nanoid } from 'nanoid';
import { map, Observable } from 'rxjs';
import { ITransaction } from '@monic/libs/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  transColl: AngularFirestoreCollection<ITransaction>;
  transItems: Observable<ITransaction[]>;

  constructor(private firestore: AngularFirestore) {
    this.transColl = firestore.collection<ITransaction>('transactions', (ref) =>
      ref.orderBy('date', 'desc')
    );
    this.transItems = this.transColl.valueChanges();
  }

  addTransaction(trans: Omit<ITransaction, 'id'>) {
    this.transColl.add({ ...trans, id: nanoid() });
  }

  deleteTransaction(id: string) {
    this.firestore.doc(`transactions/${id}`).delete();
  }

  getTransaction(id: string): Observable<ITransaction | undefined> {
    return this.firestore
      .doc<ITransaction>(`transactions/${id}`)
      .get()
      .pipe(map((snap) => snap.data()));
  }

  getTransactions(): Observable<ITransaction[]> {
    return this.transItems;
  }

  updateTransaction(trans: ITransaction) {
    this.firestore.doc(`transactions/${trans.id}`).set(trans);
  }
}
