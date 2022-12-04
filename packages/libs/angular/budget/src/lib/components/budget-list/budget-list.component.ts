import { AsyncPipe, DecimalPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IBudgetWithId } from '@monic/libs/types';
import { BudgetService } from '../../services/budget.service';

@Component({
  imports: [AsyncPipe, DecimalPipe, IonicModule, NgFor],
  selector: 'monic-budget',
  standalone: true,
  template: `
    <ion-content>
      <div class="form-title ion-padding">Budget</div>
      <ion-grid class="ion-padding-horizontal">
        <ion-row>
          <ion-col>
            <form>
              <ion-list>
                <ion-item
                  button
                  (click)="onEdit(budget)"
                  *ngFor="let budget of budget$ | async"
                >
                  <ion-label>{{ budget.category }}</ion-label>
                  <ion-text slot="end" class="ion-text-right">{{
                    budget.amount | number
                  }}</ion-text>
                </ion-item>
              </ion-list>
            </form>
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="onAdd()" side="end">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class BudgetListComponent {
  budget$ = this.budgetService.budget$;

  constructor(private budgetService: BudgetService, public router: Router) {}

  onAdd() {
    this.router.navigate(['budget/add']);
  }

  onEdit(budget: IBudgetWithId) {
    this.router.navigate([`budget/edit/${budget.id}`]);
  }
}
