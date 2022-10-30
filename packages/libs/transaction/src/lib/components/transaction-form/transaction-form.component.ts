import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [CommonModule, FormsModule, IonicModule, FormLayoutComponent],
  selector: 'monic-transaction-form',
  standalone: true,
  templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent {}
