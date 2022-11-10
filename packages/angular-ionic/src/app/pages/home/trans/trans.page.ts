import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  TransactionItemComponent,
  TransactionService,
} from '@monic/libs/transaction';

@Component({
  imports: [CommonModule, IonicModule, TransactionItemComponent],
  selector: 'monic-trans',
  standalone: true,
  template: `
    <ion-content>
      <ion-list>
        <monic-transaction-item
          [transaction]="exp"
          *ngFor="let exp of transactions$ | async"
        ></monic-transaction-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="onAdd()" side="end">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class TransPage {
  transactions$ = this.transactionService.transactions$;

  constructor(
    private transactionService: TransactionService,
    public router: Router
  ) {}

  onAdd() {
    this.transactionService.unselect();
    this.router.navigate(['trans/edit']);
  }
}
