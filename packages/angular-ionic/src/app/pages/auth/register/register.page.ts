import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RegisterFormComponent } from '@monic/libs/auth';
import {
  HideBackButtonDirective,
  PageLayoutComponent,
} from '@monic/libs/ui/base';

@Component({
  imports: [
    HideBackButtonDirective,
    IonicModule,
    PageLayoutComponent,
    RegisterFormComponent,
  ],
  selector: 'monic-register',
  standalone: true,
  template: `
    <monic-page-layout monicHideBackButton>
      <p pageTitle>Register</p>
      <monic-register-form></monic-register-form>
    </monic-page-layout>
  `,
})
export class RegisterPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
