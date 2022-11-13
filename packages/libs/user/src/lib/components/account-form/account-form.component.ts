import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PageLayoutComponent,
  ],
  selector: 'monic-account-form',
  standalone: true,
  template: `
    <monic-page-layout>
      <p pageTitle>My Account</p>
    </monic-page-layout>
  `,
})
export class AccountFormComponent {}
