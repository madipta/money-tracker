import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { BudgetService } from '@monic/libs/angular/budget';
import {
  FormLayoutComponent,
  PageLayoutComponent,
} from '@monic/libs/angular/ui-base';
import { TransactionType } from '@monic/libs/types';
import { take } from 'rxjs';
import { TransactionService } from '../../services/transaction-service';

type TransactionForm = FormGroup<{
  amount: FormControl<number>;
  budget: FormControl<string>;
  date: FormControl<string>;
  notes: FormControl<string>;
  type: FormControl<TransactionType>;
}>;

@Component({
  imports: [
    AsyncPipe,
    DatePipe,
    FormLayoutComponent,
    IonicModule,
    NgFor,
    NgIf,
    PageLayoutComponent,
    ReactiveFormsModule,
  ],
  selector: 'monic-transaction-form',
  standalone: true,
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent implements OnInit {
  private alertController = inject(AlertController);
  private budgetService = inject(BudgetService);
  private navController = inject(NavController);
  private transactionService = inject(TransactionService);
  budgetCategories = this.budgetService.allCategories;
  isAdd = true;
  isOnSavingProcess = this.transactionService.saveOnProcess$;
  form: TransactionForm;
  selectedId = '';
  title = '';

  constructor(fb: FormBuilder) {
    this.form = fb.nonNullable.group({
      amount: fb.nonNullable.control(0),
      budget: fb.nonNullable.control(''),
      date: fb.nonNullable.control(''),
      notes: fb.nonNullable.control(''),
      type: fb.nonNullable.control<TransactionType>('expense'),
    });
  }

  async ngOnInit(): Promise<void> {
    this.transactionService.selectedTransaction$
      .pipe(take(1))
      .subscribe((trans) => {
        if (!trans) {
          this.isAdd = true;
          this.selectedId = '';
          this.title = 'Add new transaction';
          this.form.patchValue({
            amount: 0,
            date: new Date().toISOString(),
            notes: '',
            type: 'expense',
          });
        } else {
          this.isAdd = false;
          this.selectedId = trans.id;
          this.title = 'Edit transaction';
          const { date, ...tran } = trans;
          this.form.patchValue({
            ...tran,
            date: date.toDate().toISOString(),
          });
        }
      });
    this.transactionService.addResult$.pipe(take(1)).subscribe(() => {
      this.navController.back();
    });
    this.transactionService.updateResult$.pipe(take(1)).subscribe(() => {
      this.navController.back();
    });
  }

  async errorAlert(message: string) {
    const alert = await this.alertController.create({
      buttons: ['OK'],
      header: 'Error',
      message,
    });

    alert.onDidDismiss().then(() => this.navController.back());

    await alert.present();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.errorAlert('Invalid input!');
      return;
    }
    const { date, type, ...rest } = this.form.getRawValue();
    const dateToSave = new Date(date);
    if (this.isAdd) {
      this.transactionService.add({
        ...rest,
        date: dateToSave,
        type,
      });
    } else {
      let budget = rest.budget;
      if (type === 'income') {
        budget = '';
      }
      this.transactionService.update({
        ...rest,
        budget,
        date: dateToSave,
        id: this.selectedId,
        type,
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transDateChange(date: string | any) {
    if (!date) {
      return;
    }
    this.form.patchValue({ date });
  }
}
