import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import {
  ITransaction,
  ITransactionCreateInput,
  ITransactionUpdateInput,
} from '@monic/libs/types';
import { AngularFireAuth } from '@angular/fire/compat/auth';

type TransactionFilter = {
  month: number;
  type: string | null;
  word: string | null;
  year: number;
};

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private addResultSubject = new Subject();
  readonly addResult$ = this.addResultSubject.asObservable();
  private deleteResultSubject = new Subject();
  readonly deleteResult$ = this.deleteResultSubject.asObservable();
  private deleteOnProcessSubject = new BehaviorSubject(false);
  readonly deleteOnProcess$ = this.deleteOnProcessSubject.asObservable();
  private updateResultSubject = new Subject();
  readonly updateResult$ = this.updateResultSubject.asObservable();
  private saveOnProcessSubject = new BehaviorSubject(false);
  readonly saveOnProcess$ = this.saveOnProcessSubject.asObservable();
  readonly sum$ = this.fireauth.user.pipe(
    switchMap((userAuth) =>
      of(
        this.firestore.collection<ITransaction>('transactions', (ref) =>
          ref.where('userId', '==', userAuth?.uid).orderBy('date', 'desc')
        )
      )
    ),
    switchMap((db) =>
      db.valueChanges().pipe(
        switchMap((trans) => {
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
          return of({
            sumIncome,
            sumExpense,
          });
        })
      )
    )
  );
  private filterValue: TransactionFilter = {
    month: new Date().getMonth(),
    type: '',
    word: '',
    year: new Date().getFullYear(),
  };
  private filterSubject = new BehaviorSubject<TransactionFilter>(
    this.filterValue
  );
  readonly filter$ = this.filterSubject
    .asObservable()
    .pipe(tap((v) => (this.filterValue = v)));

  private transDB = combineLatest([this.fireauth.user, this.filterSubject])
    .pipe(
      switchMap(([userAuth, filter]) => {
        const startDate = new Date(filter.year, filter.month, 1);
        const endDate = new Date(filter.year, filter.month + 1, 1);
        return of(
          this.firestore.collection<ITransaction>('transactions', (ref) =>
            ref
              .where('userId', '==', userAuth?.uid)
              .where('date', '>=', startDate)
              .where('date', '<', endDate)
              .orderBy('date', 'desc')
          )
        );
      })
    )
    .pipe(
      switchMap((db) =>
        db.snapshotChanges().pipe(
          map((changes) => {
            return changes.map((result) => {
              return {
                ...result.payload.doc.data(),
                id: result.payload.doc.id,
              };
            });
          })
        )
      )
    );
  readonly filteredTransactions$ = combineLatest([
    this.transDB,
    this.filterSubject,
  ]).pipe(
    switchMap(([transactions, filter]) => {
      const { type, word } = filter;
      return of(
        transactions.filter((t) => {
          const filterText =
            !word ||
            t.notes.toLocaleLowerCase().indexOf(word.toLocaleLowerCase()) > -1;
          const filterType = !type || t.type === type;
          return filterText && filterType;
        })
      );
    })
  );
  private selectedIdSubject = new BehaviorSubject('');
  readonly selectedTransaction$ = combineLatest([
    this.transDB,
    this.selectedIdSubject,
  ]).pipe(
    map(([trans, id]) => {
      return !id ? undefined : trans.find((t) => t.id === id);
    })
  );

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth
  ) {}

  add(trans: ITransactionCreateInput) {
    this.saveOnProcessSubject.next(true);
    this.firestore
      .collection('transactions')
      .doc(this.firestore.createId())
      .set(trans)
      .then(() => this.addResultSubject.next(true))
      .finally(() => this.saveOnProcessSubject.next(false));
  }

  delete(trans: ITransaction) {
    this.deleteOnProcessSubject.next(true);
    this.firestore
      .doc(`transactions/${trans.id}`)
      .delete()
      .then(() => {
        this.deleteResultSubject.next(true);
      })
      .finally(() => this.deleteOnProcessSubject.next(false));
  }

  filter(filter: Partial<TransactionFilter>) {
    this.filterSubject.next({ ...this.filterValue, ...filter });
  }

  select(id: string) {
    this.selectedIdSubject.next(id);
  }

  unselect() {
    this.selectedIdSubject.next('');
  }

  update(trans: ITransactionUpdateInput) {
    this.saveOnProcessSubject.next(true);
    this.firestore
      .doc(`transactions/${trans.id}`)
      .update(trans)
      .then(() => {
        this.updateResultSubject.next(true);
        this.saveOnProcessSubject.next(false);
      });
  }
}
