import {
  animate,
  keyframes,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  animations: [
    trigger('iconEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '1000ms 100ms ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateY(-100%)' }),
            style({ opacity: 0.2, transform: 'translateY(5%)' }),
            style({ opacity: 1, transform: 'translateY(0)' }),
          ])
        ),
      ]),
    ]),
    trigger('contentEnter', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(
          '600ms 300ms ease-out',
          keyframes([
            style({ opacity: 0, transform: 'translateX(-100%)' }),
            style({ opacity: 0.2, transform: 'translateX(10%)' }),
            style({ opacity: 1, transform: 'translateX(0)' }),
          ])
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'monic-page-layout',
  standalone: true,
  styles: [
    `
      ion-header {
        ion-toolbar ion-title {
          padding-inline: 0;
        }

        &.noBackButton ion-toolbar ion-title {
          padding-inline: 16px;
        }
      }
      .logo-icon {
        margin: 32px 0 32px;
        text-align: center;

        ion-icon {
          color: var(--ion-color-tertiary);
          font-size: 100px;
        }
      }
      .content {
        position: relative;
      }
    `,
  ],
  imports: [CommonModule, IonicModule],
  template: `
    <ion-header [class]="{ noBackButton: hideBackButton }">
      <ion-toolbar color="primary">
        <ion-buttons slot="start" *ngIf="!hideBackButton">
          <ion-back-button defaultHref></ion-back-button>
        </ion-buttons>
        <ion-title>{{ pageTitle }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-grid class="ion-no-padding">
      <ion-row>
        <ion-col>
          <div class="form-title ion-padding" *ngIf="subTitle">
            {{ subTitle }}
          </div>
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
          <div class="logo-icon" *ngIf="logoIcon" @iconEnter>
            <ion-icon [name]="logoIcon"></ion-icon>
          </div>
          <div class="content" @contentEnter>
            <ng-content></ng-content>
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
  `,
})
export class PageLayoutComponent {
  @Input() defaultHref = 'home';
  @Input() logoIcon = '';
  @Input() pageTitle = 'Money Tracker';
  @Input() subTitle = '';
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
