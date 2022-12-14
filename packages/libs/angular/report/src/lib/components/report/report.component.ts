import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { numberShorten } from '@monic/libs/util';
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
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
import { ReportService } from '../../services/report.service';

type ReportForm = FormGroup<{
  periode: FormControl<string>;
}>;

echarts.use([
  BarChart,
  CanvasRenderer,
  DatasetComponent,
  GridComponent,
  LabelLayout,
  LegendComponent,
  PieChart,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
  UniversalTransition,
]);

@Component({
  imports: [AsyncPipe, IonicModule, ReactiveFormsModule],
  selector: 'monic-report',
  standalone: true,
  styles: [
    `
      form {
        align-items: center;
        display: flex;
        flex-direction: column;
        font-size: 0.8rem;
        margin: 8px;
      }

      .chart-outer {
        box-shadow: 1px 5px 50px rgba(var(--ion-color-primary-rgb), 0.15);
        border-radius: 24px;
        box-sizing: border-box;
        margin: 16px 16px 24px;
        padding: 16px;
      }

      .pieCanvas {
        height: 200px;
      }

      .barCanvas {
        height: 600px;
      }
    `,
  ],
  template: `
    <ion-content>
      <div class="form-title ion-padding">Report</div>
      <form [formGroup]="form">
        <ion-datetime-button datetime="datetime"></ion-datetime-button>
        <ion-modal [keepContentsMounted]="true">
          <ng-template>
            <ion-datetime
              id="datetime"
              (ionChange)="periodeChange(periode.value)"
              presentation="month-year"
              [showDefaultButtons]="true"
              [value]="form.value.periode"
              #periode
            ></ion-datetime>
          </ng-template>
        </ion-modal>
      </form>
      <div class="chart-outer">
        <div class="pieCanvas" #pieCanvas></div>
      </div>
      <div class="chart-outer">
        <div class="barCanvas" #barCanvas></div>
      </div>
    </ion-content>
  `,
})
export class ReportComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild('barCanvas', { static: false }) barCanvas!: ElementRef;
  barChart!: echarts.ECharts;
  @ViewChild('pieCanvas', { static: false }) pieCanvas!: ElementRef;
  pieChart!: echarts.ECharts;
  destroy$ = new Subject<boolean>();
  form: ReportForm;

  constructor(fb: FormBuilder, private reportService: ReportService) {
    this.form = fb.nonNullable.group({
      periode: fb.nonNullable.control(new Date().toISOString()),
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.pieChart = echarts.init(this.pieCanvas.nativeElement);
      this.barChart = echarts.init(this.barCanvas.nativeElement);
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.reportService.summary$
      .pipe(takeUntil(this.destroy$))
      .subscribe((sum) =>
        this.loadPieChart(sum.income, sum.outcome, sum.budget)
      );
      this.reportService.expenseVsBudget$
        .pipe(takeUntil(this.destroy$))
        .subscribe((sum) =>
          this.loadBarChart(sum.categories, sum.expenses, sum.budgets)
        );
    this.periodeChange(new Date().toISOString());
  }

  loadBarChart(categories: string[], expenses: number[], budget: number[]) {
    const labelOption = {
      show: true,
      position: 'insideLeft',
      distance: 12,
      align: 'left',
      verticalAlign: 'middle',
      fontSize: 14
    };
    const option = {
      title: {
        text: 'Expense vs Budget',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '1%',
        right: '4%',
        bottom: '3%',
        containLabel: false,
      },
      xAxis: {
        type: 'value',
        axisLabel: {
          formatter: function (val: string | number) {
            return numberShorten(+val);
          },
        },
      },
      yAxis: {
        type: 'category',
        data: categories,
      },
      series: [
        {
          barGap: 0,
          color: '#ee399d',
          data: expenses,
          name: 'expense',
          type: 'bar',
        },
        {
          color: '#96afb8',
          data: budget,
          label: {
            ...labelOption,
            formatter: '{name|{b}}',
            rich: {
              name: {}
            }
          },
          name: 'budget',
          type: 'bar',
        },
      ],
    };

    this.barChart.setOption(option);
  }

  loadPieChart(income: number, outcome: number, budget: number) {
    const option = {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'all',
          type: 'pie',
          radius: ['20%', '75%'],
          color: ['#00a7dd', '#ee399d', '#96afb8'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 6,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: true,
            formatter: '{name|{b}}',
            rich: {
              name: {
                color: '#334a52',
              },
            },
          },
          data: [
            { value: income, name: 'Income' },
            { value: outcome, name: 'Outcome' },
            { value: budget, name: 'Budget' },
          ],
        },
      ],
    };

    this.pieChart.setOption(option);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  periodeChange(ev: string | any) {
    if (!ev) {
      return;
    }
    const date = new Date(ev);
    this.reportService.setFilter({
      month: date.getMonth(),
      year: date.getFullYear(),
    });
  }
}

