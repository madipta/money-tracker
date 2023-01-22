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
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { numberShorten } from '@monic/libs/util';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Subject, takeUntil } from 'rxjs';
import { SummaryService } from '../../services/summary.service';
import { TransactionService } from '../../services/transaction-service';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { ITransaction } from '@monic/libs/types';

echarts.use([
  CanvasRenderer,
  DatasetComponent,
  GridComponent,
  LabelLayout,
  LegendComponent,
  LineChart,
  TransformComponent,
  UniversalTransition,
]);

@Component({
  animations: [
    trigger('totalSaldoAnimate', [
      transition(
        '* => *',
        animate(
          '1200ms ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateY(-24px)' }),
            style({ opacity: 0.3, transform: 'translateY(12px)' }),
            style({ opacity: 1, transform: 'translateY(0)' }),
          ])
        )
      ),
    ]),
    trigger('sumChartAnimate', [
      transition(':enter', [
        style({ left: '100%' }),
        animate('1000ms ease-out', style({ left: '0' })),
      ]),
    ]),
    trigger('historyAnimate', [
      transition(':enter', [
        style({ top: '70%' }),
        animate(
          '1200ms 200ms ease-out',
          keyframes([
            style({ top: '-50%' }),
            style({ top: '25%' }),
            style({ top: '0' }),
          ])
        ),
      ]),
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(
          ':enter',
          stagger(600, [
            animate(
              '1s ease-in',
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
  selector: 'monic-summary',
  standalone: true,
  styleUrls: ['./summary.component.scss'],
  template: `
    <ion-content>
      <div class="total-saldo">
        <p>Current Balance</p>
        <h1 [@totalSaldoAnimate]="totalSaldoState" *ngIf="!!sum && sum >= 0">
          {{ sum | number }}
        </h1>
      </div>
      <ion-segment value="6" (ionChange)="periodeChange($event)">
        <ion-segment-button value="3">
          <ion-label>3 month</ion-label>
        </ion-segment-button>
        <ion-segment-button value="6">
          <ion-label>6 month</ion-label>
        </ion-segment-button>
        <ion-segment-button value="12">
          <ion-label>1 year</ion-label>
        </ion-segment-button>
      </ion-segment>
      <div class="sum-charts-outer" @sumChartAnimate>
        <div class="canvas" #sumEcharts></div>
      </div>
      <div class="trans">
        <div class="header">Last Transactions</div>
        <button (click)="addNew()">
          <ion-icon name="add-circle-outline"></ion-icon>
          <span>AddNew</span>
        </button>
      </div>
      <div class="history" [@historyAnimate]="transactions.length">
        <monic-transaction-item
          [transaction]="exp"
          *ngFor="let exp of transactions"
        ></monic-transaction-item>
      </div>
    </ion-content>
  `,
})
export class SummaryComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('sumEcharts', { static: false }) private sumEcharts!: ElementRef;
  sumChart!: echarts.ECharts;
  destroy$ = new Subject<boolean>();
  sum: number | undefined;
  transactions: ITransaction[] = [];
  transactions$ = this.summaryService.last3$;
  totalSaldoState = '';

  constructor(
    private router: Router,
    private summaryService: SummaryService,
    private transService: TransactionService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.summaryService.sum$.pipe(takeUntil(this.destroy$)).subscribe((sum) => {
      this.sum = sum;
      this.totalSaldoState = 'anim';
    });
    this.summaryService.last3$
      .pipe(takeUntil(this.destroy$))
      .subscribe((trans) => {
        this.transactions = trans;
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.zone.runOutsideAngular(() => {
        this.sumChart = echarts.init(this.sumEcharts.nativeElement);
        this.summaryService.ioChartData$
          .pipe(takeUntil(this.destroy$))
          .subscribe((data) => {
            this.loadInOutcomeChart(data.months, data.incomes, data.outcomes);
          });
      });
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next(false);
    this.destroy$.unsubscribe();
  }

  addNew() {
    this.transService.unselect();
    this.router.navigate(['trans/edit']);
  }

  loadInOutcomeChart(months: string[], income: number[], outcome: number[]) {
    const option = {
      legend: {
        data: ['income', 'outcome'],
      },
      xAxis: {
        data: months,
        type: 'category',
      },
      yAxis: {
        axisLabel: {
          formatter: function (val: string | number) {
            return numberShorten(+val);
          },
        },
      },
      series: [
        {
          color: ['#00a7dd'],
          data: income,
          name: 'income',
          type: 'line',
          smooth: true,
        },
        {
          color: ['#ee399d'],
          data: outcome,
          name: 'outcome',
          type: 'line',
          smooth: true,
        },
      ],
    };

    this.sumChart.setOption(option);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  periodeChange(e: any) {
    this.summaryService.ioChartFilterChange(e.detail.value);
  }
}
