import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { AlertController, IonicModule, NavController } from '@ionic/angular';
import { TransactionType } from '@monic/libs/types';
import { FormLayoutComponent, PageLayoutComponent } from '@monic/libs/ui/base';
import { take } from 'rxjs/operators';
import { TransactionService } from '../../services/transaction-service';

type TransactionForm = FormGroup<{
  amount: FormControl<number>;
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
    NgIf,
    PageLayoutComponent,
    ReactiveFormsModule,
  ],
  selector: 'monic-transaction-form',
  standalone: true,
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent implements OnInit {
  isAdd = true;
  isOnSavingProcess = this.transactionService.saveOnProcess$;
  form: TransactionForm;
  selectedId = '';
  title = '';

  constructor(
    private alertController: AlertController,
    private fb: FormBuilder,
    private navController: NavController,
    private transactionService: TransactionService
  ) {
    this.form = this.fb.nonNullable.group({
      amount: this.fb.nonNullable.control(0),
      date: this.fb.nonNullable.control(''),
      notes: this.fb.nonNullable.control(''),
      type: this.fb.nonNullable.control<TransactionType>('expense'),
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
    const { date, ...rest } = this.form.getRawValue();
    const dateToSave = new Date(date);
    if (this.isAdd) {
      this.transactionService.add({
        ...rest,
        date: dateToSave,
      });
    } else {
      this.transactionService.update({
        ...rest,
        date: dateToSave,
        id: this.selectedId,
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
