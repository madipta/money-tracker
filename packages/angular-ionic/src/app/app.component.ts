import { Component, EnvironmentInjector } from '@angular/core';

@Component({
  selector: 'monic-root',
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
