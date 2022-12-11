import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  CategoryNames,
  IBudget,
  IBudgetCreate,
  IBudgetUpdate,
  IBudgetWithId,
} from '@monic/libs/types';
import { BehaviorSubject, combineLatest, of, Subject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private budgetDB = this.fireauth.user.pipe(
    switchMap((user) =>
      of(
        this.firestore.collection<IBudget>('budgets', (ref) =>
          ref.where('userId', '==', user?.uid)
        )
      )
    )
  );
  readonly budget$ = this.budgetDB.pipe(
    switchMap((budgets) => budgets.snapshotChanges()),
    map((changes) =>
      changes.map((b) => {
        return {
          ...b.payload.doc.data(),
          id: b.payload.doc.id,
        } as IBudgetWithId;
      })
    )
  );
  readonly allCategories = CategoryNames;
  readonly availableCategories$ = this.budget$.pipe(
    switchMap((budgets) =>
      of(
        CategoryNames.filter(
          (category) => !budgets.find((budget) => budget.category === category)
        )
      )
    )
  );
  private saveResultSubject = new Subject<boolean>();
  readonly saveResult$ = this.saveResultSubject.asObservable();
  private saveOnProcessSubject = new BehaviorSubject(false);
  readonly saveOnProcess$ = this.saveOnProcessSubject.asObservable();

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth
  ) {}

  create(budget: IBudgetCreate) {
    this.saveOnProcessSubject.next(true);
    combineLatest([
      this.fireauth.user,
      this.budget$.pipe(
        switchMap((budgets) =>
          of(budgets.find((b) => b.category === budget.category))
        )
      ),
    ])
      .pipe(take(1))
      .subscribe(([user, found]) => {
        if (!user || found) {
          this.saveResultSubject.next(false);
          this.saveOnProcessSubject.next(false);
        } else {
          this.firestore
            .collection('budgets')
            .doc(this.firestore.createId())
            .set({ ...budget, userId: user.uid })
            .then(() => this.saveResultSubject.next(true))
            .finally(() => this.saveOnProcessSubject.next(false));
        }
      });
  }

  remove(id: string) {
    this.saveOnProcessSubject.next(true);
    this.budget$
      .pipe(switchMap((budgets) => of(budgets.find((b) => b.id === id))))
      .pipe(take(1))
      .subscribe((found) => {
        if (!found) {
          this.saveResultSubject.next(false);
          this.saveOnProcessSubject.next(false);
        } else {
          this.firestore
            .doc(`budgets/${id}`)
            .delete()
            .then(() => this.saveResultSubject.next(true))
            .finally(() => this.saveOnProcessSubject.next(false));
        }
      });
  }

  select(id?: string) {
    return this.budget$.pipe(
      take(1),
      switchMap((budgets) => of(budgets.find((b) => b.id === id)))
    );
  }

  update(budget: IBudgetUpdate) {
    this.saveOnProcessSubject.next(true);
    this.budget$
      .pipe(switchMap((budgets) => of(budgets.find((b) => b.id === budget.id))))
      .pipe(take(1))
      .subscribe((found) => {
        if (!found) {
          this.saveResultSubject.next(false);
          this.saveOnProcessSubject.next(false);
        } else {
          this.firestore
            .doc(`budgets/${found.id}`)
            .update({
              amount: budget.amount,
            })
            .then(() => this.saveResultSubject.next(true))
            .finally(() => this.saveOnProcessSubject.next(false));
        }
      });
  }
}
