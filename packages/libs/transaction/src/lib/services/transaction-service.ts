import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';
import {
  ITransaction,
  ITransactionCreateInput,
  ITransactionUpdateInput,
  TransactionType,
} from '@monic/libs/types';

type sumTransactionType = {
  sumIncome: number;
  sumExpense: number;
};

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
  private sum: sumTransactionType = {
    sumIncome: 0,
    sumExpense: 0,
  };
  private sumSubject = new BehaviorSubject<sumTransactionType>(this.sum);
  readonly sum$ = this.sumSubject.asObservable();

  constructor(private afs: AngularFirestore) {
    this.filteredTransactions$ = combineLatest([
      this.transactions$,
      this.searchWordSubject,
      this.selectedTypeSubject,
    ]).pipe(
      map(([transactions, searchWord, transType]) =>
        transactions.filter((t) => {
          if (!searchWord && !transType) {
            return true;
          }
          const isFilteredByType = !transType || t.type === transType;
          const isSearchByWord =
            !searchWord || t.notes.indexOf(searchWord) > -1;
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
    this.transactions$.pipe(take(1)).subscribe((trans) => {
      let sumIncome = 0;
      let sumExpense = 0;
      trans.forEach((t) => {
        const amount = Number(t.amount);
        if (t.type === 'expense') {
          sumExpense += amount;
        } else {
          sumIncome += amount;
        }
      });
      this.sum = {
        sumIncome,
        sumExpense,
      };
      this.sumSubject.next(this.sum);
    });
  }

  add(trans: ITransactionCreateInput) {
    this.onSavingProcessSubject.next(true);
    this.afs
      .collection('transactions')
      .doc(this.afs.createId())
      .set(trans)
      .then(() => {
        this.onAddSuccessSubject.next(true);
        this.calculateSum(trans.type, Number(trans.amount));
      })
      .finally(() => this.onSavingProcessSubject.next(false));
  }

  private calculateSum(transType: TransactionType, amount: number) {
    const sum = this.sum;
    if (transType === 'expense') {
      sum.sumExpense += amount;
    } else {
      sum.sumIncome += amount;
    }
    this.sumSubject.next(sum);
    return sum;
  }

  delete(trans: ITransaction) {
    this.afs
      .doc(`transactions/${trans.id}`)
      .delete()
      .then(() => {
        this.onDeleteSuccessSubject.next(true);
        this.calculateSum(trans.type, Number(trans.amount) * -1);
      });
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

  update(trans: ITransactionUpdateInput) {
    this.onSavingProcessSubject.next(true);
    this.afs
      .doc(`transactions/${trans.id}`)
      .get()
      .pipe(take(1))
      .subscribe((old) => {
        const oldTrans = old.data() as ITransaction;
        this.calculateSum(oldTrans.type, Number(oldTrans.amount) * -1);
        this.afs
          .doc(`transactions/${trans.id}`)
          .update(trans)
          .then(() => {
            this.calculateSum(trans.type, Number(trans.amount));
            this.onUpdateSuccessSubject.next(true);
            this.onSavingProcessSubject.next(false);
          });
      });
  }
}
