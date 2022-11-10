import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginFormComponent } from '@monic/libs/auth';
import {
  HideBackButtonDirective,
  PageLayoutComponent,
} from '@monic/libs/ui/base';

@Component({
  imports: [
    HideBackButtonDirective,
    IonicModule,
    LoginFormComponent,
    PageLayoutComponent,
  ],
  selector: 'monic-login',
  standalone: true,
  template: `
    <monic-page-layout monicHideBackButton>
      <p pageTitle>User Login</p>
      <monic-login-form></monic-login-form>
    </monic-page-layout>
  `,
})
export class LoginPage {}
