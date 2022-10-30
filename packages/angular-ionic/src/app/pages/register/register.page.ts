import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  HideBackButtonDirective,
  PageLayoutComponent,
} from '@monic/libs/ui/base';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    HideBackButtonDirective,
    IonicModule,
    PageLayoutComponent,
  ],
  selector: 'monic-register',
  standalone: true,
  template: `
    <monic-page-layout monicHideBackButton>
      <p pageTitle>Register</p>
    </monic-page-layout>
  `,
})
export class RegisterPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
