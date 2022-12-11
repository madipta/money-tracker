import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/angular/ui-base';
import { Subject, takeUntil } from 'rxjs';
import { BudgetService } from '../../services/budget.service';

type BudgetForm = FormGroup<{
  amount: FormControl<number>;
  category: FormControl<string>;
}>;

@Component({
  imports: [
    AsyncPipe,
    IonicModule,
    PageLayoutComponent,
    NgFor,
    NgIf,
    ReactiveFormsModule,
  ],
  selector: 'monic-budget-form',
  standalone: true,
  styles: [
    `
      ion-select {
        max-width: none;
      }
    `,
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <monic-page-layout>
        <p pageTitle>Create Budget</p>
        <div class="budget-logo">
          <ion-icon name="calculator"></ion-icon>
        </div>
        <ion-list>
          <ion-item>
            <ion-label>Category</ion-label>
            <ion-select formControlName="category">
              <ion-select-option
                [value]="category"
                *ngFor="let category of availableCategories$ | async"
              >
                {{ category }}
              </ion-select-option>
            </ion-select>
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
        <div class="form-buttons">
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
      </monic-page-layout>
    </form>
  `,
})
export class BudgetAddComponent implements OnDestroy, OnInit {
  availableCategories$ = this.budgetService.availableCategories$;
  destroy$ = new Subject<boolean>();
  form: BudgetForm;
  isOnSavingProcess = this.budgetService.saveOnProcess$;

  constructor(
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
    this.budgetService.create(this.form.getRawValue());
  }
}
