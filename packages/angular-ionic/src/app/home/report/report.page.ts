import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabContentLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [CommonModule, IonicModule, TabContentLayoutComponent],
  selector: 'monic-report',
  standalone: true,
  template: `
    <monic-tab-content-layout title="Report"></monic-tab-content-layout>
  `,
})
export class ReportPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
