import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [CommonModule, FormsModule, IonicModule, PageLayoutComponent],
  selector: 'monic-my-account',
  standalone: true,
  template: `
    <monic-page-layout>
      <p pageTitle>My Account</p>
    </monic-page-layout>
  `,
})
export class MyAccountPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
