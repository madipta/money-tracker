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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ITransaction } from '@monic/libs/types';
import { of, Subject, switchMap, takeUntil } from 'rxjs';
import { TransactionService } from '../../services/transaction-service';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';

@Component({
  animations: [
    trigger('listAnimate', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger(200, [
            animate(
              '300ms ease-out',
              keyframes([
                style({ opacity: 0, transform: 'translateY(-24px)' }),
                style({ opacity: 0.3, transform: 'translateY(12px)' }),
                style({ opacity: 1, transform: 'translateY(0)' }),
              ])
            ),
          ]),
          {
            optional: true,
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
      <ion-list [@listAnimate]="transactions.length">
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
export class TransactionListComponent implements OnDestroy, OnInit {
  destroy$ = new Subject<boolean>();
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
  transOnLoad$ = this.transactionService.transOnLoad$;
  transactions: ITransaction[] = [];

  constructor(
    private transactionService: TransactionService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.transactionService.filteredTransactions$
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.transactions = val;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  current() {
    const current = new Date();
    this.transactions = [];
    this.transactionService.filter({
      month: current.getMonth(),
      year: current.getFullYear(),
    });
  }

  last() {
    const current = new Date();
    const last = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.transactions = [];
    this.transactionService.filter({
      month: last.getMonth(),
      year: last.getFullYear(),
    });
  }

  prev() {
    const current = new Date();
    const prev = new Date(current.getFullYear(), current.getMonth() - 2, 1);
    this.transactions = [];
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
