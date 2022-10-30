import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { ITransaction } from '@monic/libs/types';
import { TransactionService } from '../../services/transaction-service';

@Component({
  imports: [CommonModule, IonicModule],
  selector: 'monic-transaction',
  standalone: true,
  styleUrls: ['./transaction.component.scss'],
  templateUrl: './transaction.component.html',
})
export class TransactionComponent {
  @Input() transaction!: ITransaction;

  constructor(
    private alertController: AlertController,
    private router: Router,
    private transactionService: TransactionService
  ) {}

  edit() {
    this.router.navigate(['trans-edit']);
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
            this.transactionService.deleteTransaction(this.transaction.id);
          },
        },
      ],
    });

    await alert.present();
  }
}
