import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabContentLayoutComponent } from '@monic/libs/ui/base';
import { TransactionService } from '../../services/transaction-service';

@Component({
  imports: [AsyncPipe, DecimalPipe, IonicModule, NgIf, TabContentLayoutComponent],
  selector: 'monic-summary',
  standalone: true,
  styles: [],
  template: `
    <monic-tab-content-layout title="Summary">
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
    </monic-tab-content-layout>
  `,
})
export class SummaryComponent {
  sum$ = this.transService.sum$;

  constructor(private transService: TransactionService) {}
}
