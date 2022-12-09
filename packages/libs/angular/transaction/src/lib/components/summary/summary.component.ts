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
        margin: 24px 16px 48px;
        min-height: 62px;

        p {
          color: rgba(var(--ion-color-secondary-rgb), 0.6);
          font-size: 0.8rem;
          margin: 0 0 8px;
        }

        h1 {
          color: rgba(var(--ion-color-primary-rgb), 0.8);
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          padding: 0;
        }
      }

      .chart-outer {
        background-color: rgba(var(--ion-color-light-rgb), 0.6);
        border: 1px solid rgba(var(--ion-color-light-rgb), 0.9);
        border-radius: 16px;
        box-sizing: border-box;
        padding: 16px 0 0 16px;
        margin: 16px;

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
        console.log('====================================');
        console.log(data);
        console.log('====================================');
        this.loadChart(data.months, data.incomes, data.outcomes);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(false);
    this.destroy$.unsubscribe();
  }

  loadChart(
    months: string[],
    income: number[],
    outcome: number[]
  ) {
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
}
