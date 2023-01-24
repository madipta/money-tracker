import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'monic-page-layout',
  standalone: true,
  styles: [
    `
      ion-toolbar ion-title {
        padding-inline: 16px;
      }
    `,
  ],
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start" *ngIf="!hideBackButton">
          <ion-back-button defaultHref></ion-back-button>
        </ion-buttons>
        <ion-title *ngIf="!hidePageTitle">{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-grid class="ion-no-padding">
      <ion-row>
        <ion-col>
          <div class="form-title ion-padding" *ngIf="subTitle">{{subTitle}}</div>
        </ion-col>
      </ion-row>
      <ion-row>
        <ion-col
          class="ion-padding"
          sizeSm="8"
          offsetSm="2"
          sizeMd="6"
          offsetMd="3"
        >
          <ng-content></ng-content>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
})
export class PageLayoutComponent {
  @Input() defaultHref = 'home';
  @Input() pageTitle = 'Money Tracker';
  @Input() subTitle = '';
  hidePageTitle = false;
  hideBackButton = false;
}

@Directive({
  selector: 'monic-page-layout[monicHideBackButton]',
  standalone: true,
})
export class HideBackButtonDirective {
  constructor(private pageLayout: PageLayoutComponent) {
    this.pageLayout.hideBackButton = true;
  }
}

@Directive({
  selector: 'monic-page-layout[monicHidePageTitle]',
  standalone: true,
})
export class HidePageTitleDirective {
  constructor(private pageLayout: PageLayoutComponent) {
    this.pageLayout.hidePageTitle = true;
  }
}
