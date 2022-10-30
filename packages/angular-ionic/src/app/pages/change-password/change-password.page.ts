import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [CommonModule, FormsModule, IonicModule, PageLayoutComponent],
  selector: 'monic-change-password',
  standalone: true,
  template: `
    <monic-page-layout>
      <p pageTitle>Change Password</p>
    </monic-page-layout>
  `,
})
export class ChangePasswordPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
