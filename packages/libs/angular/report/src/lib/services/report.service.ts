import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IBudget, ITransaction } from '@monic/libs/types';
import { combineLatest, of, Subject, switchMap } from 'rxjs';
import { ReportFilter } from './types';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private filterSubject = new Subject<ReportFilter>();
  private budget$ = this.fireauth.user.pipe(
    switchMap((user) => {
      return this.firestore
        .collection<IBudget>('budgets', (ref) =>
          ref.where('userId', '==', user?.uid)
        )
        .valueChanges();
    })
  );
  private db$ = combineLatest([this.fireauth.user, this.filterSubject]).pipe(
    switchMap(([user, filter]) => {
      const thisYear = filter.year;
      const thisMonth = filter.month;
      const startDate = new Date(thisYear, thisMonth, 1);
      const endDate = new Date(thisYear, thisMonth + 1, 1);
      return this.firestore
        .collection<ITransaction>('transactions', (ref) =>
          ref
            .where('userId', '==', user?.uid)
            .where('date', '>=', startDate)
            .where('date', '<', endDate)
            .orderBy('date', 'asc')
        )
        .valueChanges();
    })
  );
  readonly summary$ = combineLatest([this.budget$, this.db$]).pipe(
    switchMap(([budgets, trans]) => {
      let income = 0;
      let outcome = 0;
      let budget = 0;
      trans.forEach((trans) => {
        const amount = Number(trans.amount);
        if (trans.type === 'income') {
          income += amount;
        } else {
          outcome += amount;
        }
      });
      budgets.forEach((b) => (budget += +b.amount));
      return of({
        income,
        outcome,
        budget,
      });
    })
  );
  readonly expenseVsBudget$ = combineLatest([this.budget$, this.db$]).pipe(
    switchMap(([budgets, trans]) => {
      const categories: string[] = [];
      const expenses: number[] = [];
      const budgetAmounts: number[] = [];
      budgets.forEach((b) => {
        categories.push(b.category);
        budgetAmounts.push(Number(b.amount));
        let ex = 0;
        trans
          .filter((t) => t.budget === b.category)
          .forEach((t) => {
            ex += Number(t.amount);
          });
        expenses.push(ex);
      });
      return of({
        categories,
        expenses,
        budgets: budgetAmounts,
      });
    })
  );

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth
  ) {}

  setFilter(filter: ReportFilter) {
    this.filterSubject.next(filter);
  }
}
