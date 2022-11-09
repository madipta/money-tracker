import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITransaction, ITransactionWithoutId } from '@monic/libs/types';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private onAddSuccessSubject = new Subject();
  readonly onAddSuccess$ = this.onAddSuccessSubject.asObservable();
  private onDeleteSuccessSubject = new Subject();
  readonly onDeleteSuccess$ = this.onDeleteSuccessSubject.asObservable();
  private onUpdateSuccessSubject = new Subject();
  readonly onUpdateSuccess$ = this.onUpdateSuccessSubject.asObservable();
  private onSavingProcessSubject = new BehaviorSubject(false);
  readonly onSavingProcess$ = this.onSavingProcessSubject.asObservable();
  private searchWordSubject = new BehaviorSubject('');
  private selectedIdSubject = new BehaviorSubject('');
  readonly selectedTransaction$: Observable<ITransaction | undefined>;
  private selectedTypeSubject = new BehaviorSubject('');
  readonly filteredTransactions$: Observable<ITransaction[]>;
  readonly transDb = this.afs.collection<ITransaction>('transactions', (ref) =>
    ref.orderBy('date', 'desc')
  );
  readonly transactions$ = this.transDb.snapshotChanges().pipe(
    map((changes) => {
      return changes.map((result) => {
        return {
          ...result.payload.doc.data(),
          id: result.payload.doc.id,
        };
      });
    })
  );

  constructor(private afs: AngularFirestore) {
    this.filteredTransactions$ = combineLatest([
      this.transactions$,
      this.searchWordSubject,
      this.selectedTypeSubject,
    ]).pipe(
      map(([transactions, searchText, transType]) =>
        transactions.filter((t) => {
          if (!searchText && !transType) {
            return true;
          }
          const isFilteredByType = !transType || t.type === transType;
          const isSearchByWord =
            !searchText || t.notes.indexOf(searchText) > -1;
          return isSearchByWord && isFilteredByType;
        })
      )
    );
    this.selectedTransaction$ = combineLatest([
      this.transactions$,
      this.selectedIdSubject,
    ]).pipe(
      map(([trans, id]) => {
        return !id ? undefined : trans.find((t) => t.id === id);
      })
    );
  }

  add(trans: ITransactionWithoutId) {
    const { date, ...nodate } = trans;
    this.onSavingProcessSubject.next(true);
    this.afs
      .collection('transactions')
      .doc(this.afs.createId())
      .set({ ...nodate, date: date.toDate() })
      .then(() => this.onAddSuccessSubject.next(true))
      .finally(() => this.onSavingProcessSubject.next(false));
  }

  delete(id: string) {
    this.afs
      .doc(`transactions/${id}`)
      .delete()
      .then(() => this.onDeleteSuccessSubject.next(true));
  }

  filterByType(type: string) {
    this.selectedTypeSubject.next(type);
  }

  filterByWord(word: string) {
    this.searchWordSubject.next(word);
  }

  select(id: string) {
    this.selectedIdSubject.next(id);
  }

  unselect() {
    this.selectedIdSubject.next('');
  }

  update(trans: ITransaction) {
    const { date, ...nodate } = trans;
    this.onSavingProcessSubject.next(true);
    this.afs
      .doc(`transactions/${trans.id}`)
      .set({ ...nodate, date: date.toDate() })
      .then(() => this.onUpdateSuccessSubject.next(true))
      .finally(() => this.onSavingProcessSubject.next(false));
  }
}
