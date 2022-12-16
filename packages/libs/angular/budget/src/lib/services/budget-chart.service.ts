import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IBudget } from '@monic/libs/types';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BudgetChartService {
  readonly budgetChart$ = this.fireauth.user.pipe(
    switchMap((user) =>
      this.firestore
        .collection<IBudget>('budgets', (ref) =>
          ref.where('userId', '==', user?.uid)
        )
        .valueChanges()
    ),
    map((result) =>
      result.map((budget) => ({ name: budget.category, value: budget.amount }))
    )
  );

  constructor(
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth
  ) {}
}
