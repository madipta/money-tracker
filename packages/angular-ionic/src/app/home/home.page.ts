import { CommonModule } from '@angular/common';
import { Component, EnvironmentInjector, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TransactionService } from '@monic/libs/transaction';

@Component({
  imports: [CommonModule, IonicModule, RouterModule],
  selector: 'monic-home',
  standalone: true,
  styleUrls: ['./home.page.scss'],
  templateUrl: './home.page.html',
})
export class HomePage implements OnInit {
  transactions$ = this.dataService.transactions$;

  constructor(
    private dataService: TransactionService,
    public environmentInjector: EnvironmentInjector,
    public router: Router
  ) {}

  ngOnInit(): void {}
}
