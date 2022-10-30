import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, IonicModule],
  selector: 'monic-form-layout',
  standalone: true,
  template: `
    <ion-grid>
      <ion-row>
        <ion-col>
          <ng-content select="[slot=header]"></ng-content>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col>
          <ion-list>
            <ng-content></ng-content>
          </ion-list>
        </ion-col>
      </ion-row>
      <ion-row class="ion-margin-top">
        <ion-col>
          <ng-content select="[slot=footer]"></ng-content>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
})
export class FormLayoutComponent {}
