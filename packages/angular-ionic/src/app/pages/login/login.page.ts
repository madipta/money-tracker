import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import {
  HideBackButtonDirective,
  PageLayoutComponent,
} from '@monic/libs/ui/base';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    HideBackButtonDirective,
    IonicModule,
    PageLayoutComponent,
  ],
  selector: 'monic-login',
  standalone: true,
  styles: [
    `
      .ion-col-avatar {
        text-align: center;

        img {
          border-radius: 50%;
          max-height: 7rem;
          opacity: 0.9;
        }
      }
    `,
  ],
  template: `
    <monic-page-layout monicHideBackButton>
      <p pageTitle>User Authentication</p>
      <form>
        <ion-grid>
          <ion-row class="ion-margin-top">
            <ion-col class="ion-col-avatar">
              <img
                alt="Madipta"
                src="https://avatars.githubusercontent.com/u/475859?v=4"
              />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-list>
                <ion-item class="ion-margin-top">
                  <ion-label position="floating">Email</ion-label>
                  <ion-input required></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Password</ion-label>
                  <ion-input required type="password"></ion-input>
                </ion-item>
              </ion-list>
            </ion-col>
          </ion-row>
          <ion-row class="ion-margin-top">
            <ion-col>
              <ion-button type="submit" color="success" expand="block">
                Submit
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </monic-page-layout>
  `,
})
export class LoginPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
