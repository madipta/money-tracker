import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/angular/base';
import { Subject, takeUntil } from 'rxjs';
import { BudgetService } from '../../services/budget.service';

type BudgetForm = FormGroup<{
  amount: FormControl<number>;
  category: FormControl<string>;
}>;

@Component({
  imports: [
    CommonModule,
    IonicModule,
    PageLayoutComponent,
    ReactiveFormsModule,
  ],
  selector: 'monic-budget-form',
  standalone: true,
  styles: [
    `
      .budget-logo {
        margin: 48px 0 32px;
        text-align: center;

        ion-icon {
          color: var(--ion-color-tertiary);
          font-size: 128px;
        }
      }

      ion-select {
        max-width: none;
      }
    `,
  ],
  template: `
    <monic-page-layout subTitle="Edit Budget">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="budget-logo">
          <ion-icon name="calculator"></ion-icon>
        </div>
        <ion-list>
          <ion-item>
            <ion-label>Category</ion-label>
            <p>{{ form.value.category }}</p>
          </ion-item>
          <ion-item>
            <ion-label>Amount</ion-label>
            <ion-input
              formControlName="amount"
              slot="end"
              style="text-align: right"
            ></ion-input>
          </ion-item>
        </ion-list>
        <div class="ion-margin-top">
          <ion-button
            type="submit"
            color="success"
            expand="block"
            [disabled]="isOnSavingProcess | async"
          >
            <ion-text *ngIf="(isOnSavingProcess | async) === false">
              Submit
            </ion-text>
            <ion-spinner
              name="lines-small"
              *ngIf="isOnSavingProcess | async"
            ></ion-spinner>
          </ion-button>
        </div>
      </form>
    </monic-page-layout>
  `,
})
export class BudgetEditComponent implements OnDestroy, OnInit {
  destroy$ = new Subject<boolean>();
  form: BudgetForm;
  isOnSavingProcess = this.budgetService.saveOnProcess$;
  selectedId!: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private budgetService: BudgetService,
    fb: FormBuilder,
    private navController: NavController
  ) {
    this.form = fb.nonNullable.group({
      amount: fb.nonNullable.control(0, [Validators.required]),
      category: fb.nonNullable.control('', [Validators.required]),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.params['id'];
    this.selectedId = id;
    this.budgetService.select(id).subscribe((b) =>
      this.form.patchValue({
        amount: b?.amount,
        category: b?.category,
      })
    );
    this.budgetService.saveResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
        if (success) {
          this.navController.back();
        }
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.budgetService.update({
      ...this.form.getRawValue(),
      id: this.selectedId,
    });
  }
}
