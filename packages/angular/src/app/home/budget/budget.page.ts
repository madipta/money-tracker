import { Component, OnInit } from '@angular/core';
import { TabContentLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [TabContentLayoutComponent],
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
