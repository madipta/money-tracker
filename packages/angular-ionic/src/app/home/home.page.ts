import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  imports: [CommonModule, IonicModule, RouterModule],
  selector: 'monic-home',
  standalone: true,
  styleUrls: ['./home.page.scss'],
  templateUrl: './home.page.html',
})
export class HomePage {
  constructor(
    public environmentInjector: EnvironmentInjector,
    public router: Router
  ) {}
}
