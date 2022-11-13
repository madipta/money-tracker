import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [CommonModule, FormsModule, IonicModule, PageLayoutComponent],
  standalone: true,
  styles: [],
  template: `
    <monic-page-layout>
      <p pageTitle>Change Password</p>
      new
    </monic-page-layout>
  `,
})
export class ChangePasswordComponent {}
