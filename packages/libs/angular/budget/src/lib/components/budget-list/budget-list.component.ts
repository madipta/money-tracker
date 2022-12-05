import { AsyncPipe, DecimalPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { IBudgetWithId } from '@monic/libs/types';
import { BudgetService } from '../../services/budget.service';

@Component({
  imports: [AsyncPipe, DecimalPipe, IonicModule, NgFor],
  selector: 'monic-budget',
  standalone: true,
  styles: [`
    .budget-amount {
      font-size: .9rem;
      text-align: right;
    }
  `],
  template: `
    <ion-content>
      <div class="form-title ion-padding">Budget</div>
      <ion-list>
        <ion-item-sliding *ngFor="let budget of budget$ | async">
          <ion-item>
            <ion-label>{{ budget.category }}</ion-label>
            <ion-text slot="end" class="budget-amount">{{
              budget.amount | number
            }}</ion-text>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option
              (click)="onEdit(budget)"
              color="tertiary"
              title="Edit"
            >
              <ion-icon name="create-outline" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option
              (click)="deleteAlert(budget)"
              color="tertiary"
              title="Delete"
            >
              <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
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

  constructor(
    private alertController: AlertController,
    private budgetService: BudgetService,
    public router: Router
  ) {}

  async deleteAlert(budget: IBudgetWithId) {
    const alert = await this.alertController.create({
      header: `Delete ${budget.category} budget?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.budgetService.remove(budget.id);
          },
        },
      ],
    });

    await alert.present();
  }

  onAdd() {
    this.router.navigate(['budget/add']);
  }

  onEdit(budget: IBudgetWithId) {
    this.router.navigate([`budget/edit/${budget.id}`]);
  }
}
