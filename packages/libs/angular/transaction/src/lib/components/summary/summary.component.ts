import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
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
import { numberShorten } from '@monic/libs/util';
import { SummaryService } from '../../services/summary.service';
import { Subject, takeUntil } from 'rxjs';

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
  imports: [AsyncPipe, DecimalPipe, IonicModule, NgIf],
  selector: 'monic-summary',
  standalone: true,
  styles: [
    `
      .total-saldo {
        align-items: center;
        display: flex;
        flex-direction: column;
        margin: 16px;
        min-height: 62px;

        p {
          color: rgba(var(--ion-color-secondary-rgb), 0.5);
          font-size: 0.78rem;
          margin: 0 0 4px;
        }

        h1 {
          color: rgba(var(--ion-color-primary-rgb), 0.8);
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          padding: 0;
        }
      }

      ion-segment-button {
        --indicator-height: 0;
        --padding-end: 10px;
        --padding-start: 10px;
        --border-radius: 16px;
        flex: none;
        font-size: 0.8rem;
        letter-spacing: normal;
        margin: 0 1px;
        min-height: 26px;
        min-width: 0;
        overflow: hidden;

        &.segment-button-checked {
          background-color: rgba(var(--ion-color-primary-rgb), 0.06);
          color: rgba(var(--ion-color-primary-rgb), 0.9);
        }

        ion-label {
          margin: 0;
          text-transform: none;
        }
      }

      .chart-outer {
        box-shadow: 1px 5px 50px rgba(var(--ion-color-primary-rgb), 0.15);
        border-radius: 24px;
        box-sizing: border-box;
        padding: 16px 0 0 16px;
        margin: 8px 16px;

        div.canvas {
          height: 70vw;
        }
      }
    `,
  ],
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
      <div class="chart-outer">
        <div class="canvas" #sumEcharts></div>
      </div>
    </ion-content>
  `,
})
export class SummaryComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sumEcharts', { static: false }) private sumEcharts!: ElementRef;
  chart!: echarts.ECharts;
  destroy$ = new Subject<boolean>();
  sum$ = this.summaryService.sum$;

  constructor(private summaryService: SummaryService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chart = echarts.init(this.sumEcharts.nativeElement);
    }, 100);
    this.summaryService.ioChartData$
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.loadChart(data.months, data.incomes, data.outcomes);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(false);
    this.destroy$.unsubscribe();
  }

  loadChart(months: string[], income: number[], outcome: number[]) {
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

    this.chart.setOption(option);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  periodeChange(e: any) {
    this.summaryService.ioChartFilterChange(e.detail.value);
  }
}
