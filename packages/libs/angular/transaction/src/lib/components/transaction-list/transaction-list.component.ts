import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of, switchMap } from 'rxjs';
import { TransactionService } from '../../services/transaction-service';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';

@Component({
  imports: [AsyncPipe, IonicModule, NgFor, NgIf, TransactionItemComponent],
  selector: 'monic-transaction-list',
  standalone: true,
  styleUrls: ['./transaction-list.component.scss'],
  template: `
    <ion-segment [value]="filter" *ngIf="filter$ | async as filter">
      <ion-segment-button value="current" (click)="current()">
        <ion-label>This Month</ion-label>
      </ion-segment-button>
      <ion-segment-button value="last" (click)="last()">
        <ion-label>Last Month</ion-label>
      </ion-segment-button>
      <ion-segment-button value="prev" (click)="prev()">
        <ion-label>Previous</ion-label>
      </ion-segment-button>
      <ion-button (click)="search()" color="tertiary" fill="clear">
        <ion-icon name="search" slot="icon-only"></ion-icon>
      </ion-button>
    </ion-segment>
    <ion-content>
      <ion-list *ngIf="transactions$ | async as transactions">
        <monic-transaction-item
          [transaction]="exp"
          *ngFor="let exp of transactions"
        ></monic-transaction-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="onAdd()" side="end">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <div class="loading" *ngIf="transOnLoad$ | async">
      <ion-spinner name="lines"></ion-spinner>
    </div>
  `,
})
export class TransactionListComponent {
  filter$ = this.transactionService.filter$.pipe(
    switchMap((f) => {
      const current = new Date();
      const currentMonth = current.getMonth();
      const currentYear = current.getFullYear();
      const last = new Date(currentYear, currentMonth - 1, 1);
      const lastMonth = last.getMonth();
      const lastYear = last.getFullYear();
      if (f.year === currentYear && f.month === currentMonth) {
        return of('current');
      } else if (f.year === lastYear && f.month === lastMonth) {
        return of('last');
      }
      return of('prev');
    })
  );
  skeletons = new Array(10);
  transactions$ = this.transactionService.filteredTransactions$;
  transOnLoad$ = this.transactionService.transOnLoad$;

  constructor(
    private transactionService: TransactionService,
    public router: Router
  ) {}

  current() {
    const current = new Date();
    this.transactionService.filter({
      month: current.getMonth(),
      year: current.getFullYear(),
    });
  }

  last() {
    const current = new Date();
    const last = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.transactionService.filter({
      month: last.getMonth(),
      year: last.getFullYear(),
    });
  }

  prev() {
    const current = new Date();
    const prev = new Date(current.getFullYear(), current.getMonth() - 2, 1);
    this.transactionService.filter({
      month: prev.getMonth(),
      year: prev.getFullYear(),
    });
  }

  search() {
    this.router.navigate(['trans/search']);
  }

  onAdd() {
    this.transactionService.unselect();
    this.router.navigate(['trans/edit']);
  }
}
