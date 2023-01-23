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
  TitleComponent,
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
  TitleComponent,
  TooltipComponent,
  TransformComponent,
  UniversalTransition,
]);

@Component({
  animations: [
    trigger('chartAnimate', [
      transition(':enter', [
        style({ left: '100%' }),
        animate('1000ms ease-out', style({ left: '0' })),
      ]),
    ]),
    trigger('listAnimate', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':self', style({ opacity: 0, top: '100%' }), { optional: true }),
        query(':self', animate('1000ms ease-out', style({ opacity: 1, top: '0' })), { optional: true }),
        query(
          ':enter',
          stagger(200, [
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
            limit: 12,
          }
        ),
      ]),
    ]),
  ],
  imports: [CommonModule, IonicModule],
  selector: 'monic-budget',
  standalone: true,
  styleUrls: ['./budget-list.component.scss'],
  template: `
    <ion-content>
      <div class="form-title ion-padding">Budget</div>
      <div class="charts-outer" @chartAnimate>
        <div class="canvas" #canvas></div>
      </div>
      <div
        class="budget-list"
        *ngIf="budgetService.budget$ | async as budgets"
        [@listAnimate]="budgets.length"
      >
        <ion-list>
          <ion-item-sliding *ngFor="let budget of budgets; trackBy: trackById">
            <ion-item>
              <ion-icon
                color="secondary"
                [name]="categoryIcons[budget.category]"
                slot="start"
              ></ion-icon>
              <ion-label>{{ budget.category }}</ion-label>
              <ion-text slot="end">
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
      </div>
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
  categoryIcons = CategoryIcons;
  destroy$ = new Subject<boolean>();

  constructor(
    private alertController: AlertController,
    private chatService: BudgetChartService,
    public budgetService: BudgetService,
    public router: Router,
    private zone: NgZone
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.zone.runOutsideAngular(() => {
        this.charts = echarts.init(this.canvas.nativeElement);
        this.chatService.budgetChart$
          .pipe(takeUntil(this.destroy$))
          .subscribe((budgets) => this.loadChart(budgets));
      });
    }, 100);
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
    let sum = 0;
    data.forEach((d) => {
      sum += +d.value;
    });
    const option = {
      title: {
        text: sum.toLocaleString(),
        left: 'center',
        top: 'center',
      },
      series: [
        {
          name: 'Budget',
          type: 'pie',
          radius: ['52%', '73%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: true,
            formatter: '{name|{b}}',
            rich: {
              name: {
                color: '#467f98',
              },
            },
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

  trackById(index: number, trans: { id: string }) {
    return trans.id;
  }
}
