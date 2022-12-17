import { AsyncPipe, DecimalPipe, NgFor } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { CategoryIcons, IBudgetWithId } from '@monic/libs/types';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  DatasetComponent,
  LegendComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { BudgetService } from '../../services/budget.service';
import { Subject, takeUntil } from 'rxjs';
import { BudgetChartService } from '../../services/budget-chart.service';

echarts.use([
  CanvasRenderer,
  DatasetComponent,
  LabelLayout,
  LegendComponent,
  PieChart,
  TooltipComponent,
  TransformComponent,
  UniversalTransition,
]);

@Component({
  imports: [AsyncPipe, DecimalPipe, IonicModule, NgFor],
  selector: 'monic-budget',
  standalone: true,
  styles: [
    `
      ion-content {
        --padding-bottom: 64px;
      }
      .charts-outer {
        box-shadow: 1px 5px 50px rgba(var(--ion-color-primary-rgb), 0.15);
        border-radius: 24px;
        box-sizing: border-box;
        margin: 16px;
        padding: 16px;

        div.canvas {
          height: 200px;
        }
      }
      .budget-amount {
        font-size: 0.9rem;
        text-align: right;
      }
    `,
  ],
  template: `
    <ion-content>
      <div class="form-title ion-padding">Budget</div>
      <div class="charts-outer">
        <div class="canvas" #canvas></div>
      </div>
      <ion-list>
        <ion-item-sliding *ngFor="let budget of budget$ | async">
          <ion-item>
            <ion-icon
              color="secondary"
              [name]="categoryIcons[budget.category]"
              slot="start"
            ></ion-icon>
            <ion-label>{{ budget.category }}</ion-label>
            <ion-text slot="end" class="budget-amount">
              {{ budget.amount | number }}
            </ion-text>
          </ion-item>
          <ion-item-options side="end">
            <ion-item-option
              (click)="onEdit(budget)"
              color="tertiary"
              title="Edit"
            >
              <ion-icon name="create-outline" slot="icon-only"></ion-icon>
            </ion-item-option>
            <ion-item-option
              (click)="deleteAlert(budget)"
              color="tertiary"
              title="Delete"
            >
              <ion-icon name="trash-outline" slot="icon-only"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>
      <ion-fab vertical="bottom" horizontal="center" slot="fixed">
        <ion-fab-button (click)="onAdd()" side="end">
          <ion-icon name="add-outline"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
})
export class BudgetListComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: false })
  canvas!: ElementRef;
  charts!: echarts.ECharts;
  budget$ = this.budgetService.budget$;
  categoryIcons = CategoryIcons;
  destroy$ = new Subject<boolean>();

  constructor(
    private alertController: AlertController,
    private chatService: BudgetChartService,
    private budgetService: BudgetService,
    public router: Router
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.charts = echarts.init(this.canvas.nativeElement);
    }, 100);
    this.chatService.budgetChart$
      .pipe(takeUntil(this.destroy$))
      .subscribe((budgets) => this.loadChart(budgets));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  async deleteAlert(budget: IBudgetWithId) {
    const alert = await this.alertController.create({
      header: `Delete ${budget.category} budget?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.budgetService.remove(budget.id);
          },
        },
      ],
    });

    await alert.present();
  }

  loadChart(data: { value: number; name: string }[]) {
    const option = {
      series: [
        {
          name: 'Budget',
          type: 'pie',
          radius: ['20%', '50%'],
          center: ['50%', '50%'],
          itemStyle: {
            borderRadius: 10,
          },
          avoidLabelOverlap: true,
          label: {
            show: true,
            formatter: '{name|{b}}',
            rich: {
              name: {
                color: '#96afb8'
              }
            }
          },
          data,
        },
      ],
    };

    this.charts.setOption(option);
  }

  onAdd() {
    this.router.navigate(['budget/add']);
  }

  onEdit(budget: IBudgetWithId) {
    this.router.navigate([`budget/edit/${budget.id}`]);
  }
}
