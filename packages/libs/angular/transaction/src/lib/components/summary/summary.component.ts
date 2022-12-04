import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TransactionService } from '../../services/transaction-service';

@Component({
  imports: [
    AsyncPipe,
    DecimalPipe,
    IonicModule,
    NgIf,
  ],
  selector: 'monic-summary',
  standalone: true,
  styles: [],
  template: `
    <ion-content>
      <div class="form-title ion-padding">Summary</div>
      <ng-container *ngIf="sum$ | async as sum">
        <ion-grid class="ion-margin">
          <ion-row>
            <ion-col>
              <ion-item>
                <ion-label>
                  <p><ion-text color="medium">Outflow</ion-text></p>
                </ion-label>
                <ion-label slot="end">
                  <p>
                    <ion-text color="danger">
                      {{ sum.sumExpense | number }}
                    </ion-text>
                  </p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <p><ion-text color="medium">Inflow</ion-text></p>
                </ion-label>
                <ion-label slot="end">
                  <p>
                    <ion-text color="primary">
                      {{ sum.sumIncome | number }}
                    </ion-text>
                  </p>
                </ion-label>
              </ion-item>
              <ion-item>
                <ion-label>
                  <p><ion-text color="medium">Total</ion-text></p>
                </ion-label>
                <ion-label slot="end">
                  <p>
                    <ion-text color="dark">
                      {{ sum.sumIncome - sum.sumExpense | number }}
                    </ion-text>
                  </p>
                </ion-label>
              </ion-item>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ng-container>
    </ion-content>
  `,
})
export class SummaryComponent {
  sum$ = this.transService.sum$;

  constructor(private transService: TransactionService) {}
}
