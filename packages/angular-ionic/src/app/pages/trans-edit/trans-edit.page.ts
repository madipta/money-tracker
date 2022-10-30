import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TransactionFormComponent } from '@monic/libs/transaction';
import { PageLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageLayoutComponent,
    TransactionFormComponent,
  ],
  selector: 'monic-trans-edit',
  standalone: true,
  template: `
    <monic-page-layout>
      <p pageTitle>Transaction</p>
      <monic-transaction-form></monic-transaction-form>
    </monic-page-layout>
  `,
})
export class TransEditPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
