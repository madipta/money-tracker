import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabContentLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [CommonModule, IonicModule, TabContentLayoutComponent],
  selector: 'monic-budget',
  standalone: true,
  template: `
    <monic-tab-content-layout title="Budget"></monic-tab-content-layout>
  `,
})
export class BudgetPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
