import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [IonicModule],
  selector: 'monic-report',
  standalone: true,
  template: `
    <ion-content>
      <div class="form-title ion-padding">Report</div>
    </ion-content>
  `,
})
export class ReportPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
