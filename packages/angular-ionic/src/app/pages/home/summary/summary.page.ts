import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TabContentLayoutComponent } from '@monic/libs/ui/base';

@Component({
  imports: [CommonModule, IonicModule, TabContentLayoutComponent],
  selector: 'monic-summary',
  standalone: true,
  template: `
    <monic-tab-content-layout title="Summary">
      <ion-grid class="ion-margin">
        <ion-row>
          <ion-col class="ion-padding-horizontal">
            <ion-item lines="none">
              <ion-label>
                <p><ion-text color="medium">Outflow</ion-text></p>
              </ion-label>
              <ion-label slot="end">
                <p><ion-text color="danger">8,900,000</ion-text></p>
              </ion-label>
            </ion-item>
            <ion-item>
              <ion-label>
                <p><ion-text color="medium">Inflow</ion-text></p>
              </ion-label>
              <ion-label slot="end">
                <p><ion-text color="primary">15,000,000</ion-text></p>
              </ion-label>
            </ion-item>
            <ion-item lines="none">
              <ion-label>
                <p><ion-text color="medium">Total</ion-text></p>
              </ion-label>
              <ion-label slot="end">
                <p><ion-text color="dark">14,110,000</ion-text></p>
              </ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>
    </monic-tab-content-layout>
  `,
})
export class SummaryPage implements OnInit {
  ngOnInit() {}
}
