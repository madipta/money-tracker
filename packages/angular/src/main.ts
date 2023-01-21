import { enableProdMode, importProvidersFrom } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AppRoutes } from './app/app-routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      AngularFireModule.initializeApp(environment.firebase),
      IonicModule.forRoot(),
      RouterModule.forRoot(AppRoutes)
    ),
    provideAnimations()
  ],
}).catch((err) => console.error(err));
