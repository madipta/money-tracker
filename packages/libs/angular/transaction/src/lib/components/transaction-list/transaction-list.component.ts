import {
  animate,
  keyframes,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { of, Subject, switchMap } from 'rxjs';
import { TransactionService } from '../../services/transaction-service';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';

@Component({
  animations: [
    trigger('listAnimate', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger(80, [
            animate(
              '300ms ease-in',
              keyframes([
                style({ opacity: 0, transform: 'translateY(-24px)' }),
                style({ opacity: 0.3, transform: 'translateY(12px)' }),
                style({ opacity: 1, transform: 'translateY(0)' }),
              ])
            ),
          ]),
          {
            optional: true,
            limit: 12
          }
        ),
      ]),
    ]),
  ],
  imports: [CommonModule, IonicModule, TransactionItemComponent],
  selector: 'monic-transaction-list',
  standalone: true,
  styleUrls: ['./transaction-list.component.scss'],
  template: `
    <div class="tab-outer">
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
      </ion-segment>
      <ion-button (click)="search()" color="tertiary" fill="clear">
        <ion-icon name="search" slot="icon-only"></ion-icon>
      </ion-button>
    </div>
    <ion-content>
      <ion-list
        *ngIf="transService.filteredTransactions$ | async as transactions"
        [@listAnimate]="transactions.length"
      >
        <monic-transaction-item
          [transaction]="exp"
          *ngFor="let exp of transactions; trackBy: trackById"
        ></monic-transaction-item>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="onAdd()" side="end">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
    <div class="loading" *ngIf="transService.transOnLoad$ | async">
      <ion-spinner name="lines"></ion-spinner>
    </div>
  `,
})
export class TransactionListComponent {
  destroy$ = new Subject<boolean>();
  filter$ = this.transService.filter$.pipe(
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

  constructor(public transService: TransactionService, public router: Router) {}

  filter(date: Date) {
    this.transService.filter({
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }

  current() {
    this.filter(new Date());
  }

  last() {
    const current = new Date();
    const last = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.filter(last);
  }

  prev() {
    const current = new Date();
    const prev = new Date(current.getFullYear(), current.getMonth() - 2, 1);
    this.filter(prev);
  }

  search() {
    this.router.navigate(['trans/search']);
  }

  trackById(index: number, trans: { id: string; }) {
    return trans.id;
  }

  onAdd() {
    this.transService.unselect();
    this.router.navigate(['trans/edit']);
  }
}
