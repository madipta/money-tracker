import { Component, EnvironmentInjector } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

@Component({
  imports: [IonicModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  selector: 'monic-root',
  standalone: true,
  template: `
    <ion-app>
      <ion-content>
        <ion-router-outlet
          [environmentInjector]="environmentInjector"
        ></ion-router-outlet>
      </ion-content>
    </ion-app>
  `,
})
export class AppComponent {
  constructor(public environmentInjector: EnvironmentInjector) {}
}
