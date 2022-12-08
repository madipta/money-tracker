import { AsyncPipe, DecimalPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
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
import { TransactionService } from '../../services/transaction-service';
import { abbreviate } from '../../services/util';

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
export class SummaryComponent implements AfterViewInit {
  @ViewChild('sumEcharts', { static: false }) private sumEcharts!: ElementRef;
  chart!: echarts.ECharts;
  sum$ = this.transService.sum$;

  constructor(private transService: TransactionService) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.chart = echarts.init(this.sumEcharts.nativeElement);
      this.loadChart();
    }, 100);
  }

  loadChart(
    months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    income = [2500000, 2800000, 3000000, 3000000, 3600000, 2900000],
    outcome = [1500000, 1400000, 2100000, 2600000, 1600000, 1800000]
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
            return abbreviate(+val);
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
