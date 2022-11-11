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
      <ion-list style="padding-bottom: 72px;">
        <ng-container
          *ngIf="transactions$ | async as transactions; else skeleton"
        >
          <monic-transaction-item
            [transaction]="exp"
            *ngFor="let exp of transactions"
          ></monic-transaction-item>
        </ng-container>
        <ng-template #skeleton>
          <ion-item>
            <ion-grid>
              <ion-row *ngFor="let s of skeletons">
                <ion-col>
                  <ion-skeleton-text
                    [animated]="true"
                    class="ion-padding-vertical"
                  ></ion-skeleton-text
                ></ion-col>
                <ion-col size="10">
                  <ion-skeleton-text
                    [animated]="true"
                    class="ion-padding-vertical"
                  ></ion-skeleton-text
                ></ion-col>
              </ion-row>
            </ion-grid>
          </ion-item>
        </ng-template>
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
  skeletons = new Array(10);

  constructor(
    private transactionService: TransactionService,
    public router: Router
  ) {}

  onAdd() {
    this.transactionService.unselect();
    this.router.navigate(['trans/edit']);
  }
}
