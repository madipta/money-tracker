import { AsyncPipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { numberShorten } from '@monic/libs/util';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { Subject, takeUntil } from 'rxjs';
import { SummaryService } from '../../services/summary.service';
import { TransactionService } from '../../services/transaction-service';
import { TransactionItemComponent } from '../transaction-item/transaction-item.component';
import { Router } from '@angular/router';

echarts.use([
  CanvasRenderer,
  DatasetComponent,
  GridComponent,
  LabelLayout,
  LegendComponent,
  LineChart,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
  UniversalTransition,
]);

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    DecimalPipe,
    IonicModule,
    NgFor,
    NgIf,
    TransactionItemComponent,
  ],
  selector: 'monic-summary',
  standalone: true,
  styleUrls: ['./summary.component.scss'],
  template: `
    <ion-content>
      <div class="total-saldo">
        <p>Current Balance</p>
        <h1>{{ sum$ | async | number }}</h1>
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
      <div class="sum-charts-outer">
        <div class="canvas" #sumEcharts></div>
      </div>
      <div class="history">
        <div class="header">Last Transactions</div>
        <button (click)="addNew()">
          <ion-icon name="add-circle-outline"></ion-icon>
          <span>AddNew</span>
        </button>
      </div>
      <ng-container *ngIf="transactions$ | async as transactions">
        <monic-transaction-item
          [transaction]="exp"
          *ngFor="let exp of transactions"
        ></monic-transaction-item>
      </ng-container>
    </ion-content>
  `,
})
export class SummaryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sumEcharts', { static: false }) private sumEcharts!: ElementRef;
  budgetChart!: echarts.ECharts;
  sumChart!: echarts.ECharts;
  destroy$ = new Subject<boolean>();
  sum$ = this.summaryService.sum$;
  transactions$ = this.transactionService.filteredTransactions$;

  constructor(
    private router: Router,
    private summaryService: SummaryService,
    private transactionService: TransactionService
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sumChart = echarts.init(this.sumEcharts.nativeElement);
    }, 100);
    this.summaryService.ioChartData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loadInOutcomeChart(data.months, data.incomes, data.outcomes);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(false);
    this.destroy$.unsubscribe();
  }

  addNew() {
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
          data: income,
          name: 'income',
          type: 'line',
          smooth: true,
        },
        {
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
