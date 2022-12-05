import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/angular/ui-base';
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
    NgIf,
    ReactiveFormsModule,
  ],
  selector: 'monic-budget-form',
  standalone: true,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <monic-page-layout>
        <p pageTitle>Edit Budget</p>
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
      </monic-page-layout>
    </form>
  `,
})
export class BudgetEditComponent implements OnInit {
  form: BudgetForm;
  isOnSavingProcess = this.budgetService.saveOnProcess$;
  selectedId!: string;

  constructor(
    private activeRoute: ActivatedRoute,
    private budgetService: BudgetService,
    fb: FormBuilder
  ) {
    this.form = fb.nonNullable.group({
      amount: fb.nonNullable.control(0, [Validators.required]),
      category: fb.nonNullable.control('', [Validators.required]),
    });
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
