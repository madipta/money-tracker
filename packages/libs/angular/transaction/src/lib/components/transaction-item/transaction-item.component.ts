import { DatePipe, DecimalPipe, NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { ITransaction } from '@monic/libs/types';
import { TransactionService } from '../../services/transaction-service';

@Component({
  imports: [DatePipe, DecimalPipe, IonicModule, NgClass, NgIf],
  selector: 'monic-transaction-item',
  standalone: true,
  styleUrls: ['./transaction-item.component.scss'],
  templateUrl: './transaction-item.component.html',
})
export class TransactionItemComponent {
  @Input() transaction!: ITransaction;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  edit(transaction: ITransaction) {
    this.transactionService.select(transaction.id);
    this.router.navigate(['trans/edit']);
  }

  async deleteAlert() {
    const alert = await this.alertController.create({
      header: 'Delete this transaction?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'confirm',
          handler: () => {
            this.transactionService.delete(this.transaction);
          },
        },
      ],
    });

    await alert.present();
  }
}
