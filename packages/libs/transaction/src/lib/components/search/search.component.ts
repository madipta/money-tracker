import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormLayoutComponent, PageLayoutComponent } from '@monic/libs/ui/base';
import { Subject, takeUntil } from 'rxjs';
import { TransactionService } from '../../services/transaction-service';
import { Router } from '@angular/router';

type SearchForm = FormGroup<{
  month: FormControl<number>;
  type: FormControl<string | null>;
  word: FormControl<string | null>;
  year: FormControl<number>;
}>;

@Component({
  imports: [
    CommonModule,
    FormLayoutComponent,
    IonicModule,
    PageLayoutComponent,
    ReactiveFormsModule,
  ],
  selector: 'monic-search',
  standalone: true,
  template: `
    <monic-page-layout>
      <p pageTitle>Search</p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <monic-form-layout>
          <ng-container slot="header">
            <ion-list-header class="ion-no-padding">
              <ion-label>
                <ion-text>Filter Transaction</ion-text>
              </ion-label>
            </ion-list-header>
          </ng-container>
          <ion-item>
            <ion-label position="fixed">Word</ion-label>
            <ion-input formControlName="word"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Type</ion-label>
            <ion-select formControlName="type">
              <ion-select-option value="">All</ion-select-option>
              <ion-select-option value="expense">Expense</ion-select-option>
              <ion-select-option value="income">Income</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Year</ion-label>
            <ion-input
              formControlName="year"
              inputmode="numeric"
              maxlength="4"
              required
              style="appearance: none"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="fixed">Month</ion-label>
            <ion-select formControlName="month">
              <ion-select-option [value]="0">January</ion-select-option>
              <ion-select-option [value]="1">February</ion-select-option>
              <ion-select-option [value]="2">March</ion-select-option>
              <ion-select-option [value]="3">April</ion-select-option>
              <ion-select-option [value]="4">May</ion-select-option>
              <ion-select-option [value]="5">June</ion-select-option>
              <ion-select-option [value]="6">July</ion-select-option>
              <ion-select-option [value]="7">August</ion-select-option>
              <ion-select-option [value]="8">September</ion-select-option>
              <ion-select-option [value]="9">October</ion-select-option>
              <ion-select-option [value]="10">November</ion-select-option>
              <ion-select-option [value]="11">December</ion-select-option>
            </ion-select>
          </ion-item>
          <ng-container slot="footer">
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
          </ng-container>
        </monic-form-layout>
      </form>
    </monic-page-layout>
  `,
})
export class SearchComponent implements OnDestroy, OnInit {
  destroy$ = new Subject();
  form: SearchForm;
  isOnSavingProcess = this.transService.saveOnProcess$;
  maxYear = new Date().getFullYear();

  constructor(
    fb: FormBuilder,
    private router: Router,
    private transService: TransactionService
  ) {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.form = fb.nonNullable.group({
      word: fb.control(''),
      month: fb.nonNullable.control(currentMonth, [
        Validators.max(11),
        Validators.min(0),
      ]),
      year: fb.nonNullable.control(currentYear, [
        Validators.max(currentYear),
        Validators.min(1970),
      ]),
      type: fb.control(''),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.transService.filter$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filter) => {
        this.form.patchValue(filter);
      });
  }

  onSubmit() {
    if (this.form.invalid) {
      console.error('erros', this.form.errors);
      return;
    }
    this.transService.filter(this.form.getRawValue());
    this.router.navigate(['home/trans']);
  }
}
