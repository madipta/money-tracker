import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [CommonModule, FormsModule, IonicModule, PageLayoutComponent],
  selector: 'monic-search',
  standalone: true,
  template: `
    <monic-page-layout>
      <p pageTitle>Search</p>
    </monic-page-layout>
  `,
})
export class SearchPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
