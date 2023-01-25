import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
  HideBackButtonDirective,
  PageLayoutComponent,
} from '@monic/libs/angular/base';
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [
    CommonModule,
    HideBackButtonDirective,
    IonicModule,
    PageLayoutComponent,
    ReactiveFormsModule,
  ],
  selector: 'monic-login-form',
  standalone: true,
  template: `
    <monic-page-layout logoIcon="finger-print-outline" subTitle="User Login" monicHideBackButton>
      <form [formGroup]="form" (ngSubmit)="login()">
        <ion-list>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input
              formControlName="email"
              placeholder="user@mail.com"
              required
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input
              formControlName="password"
              placeholder="123456"
              required
              type="password"
            ></ion-input>
          </ion-item>
        </ion-list>

        <ion-button
          type="submit"
          color="success"
          expand="block"
          [disabled]="isOnLoginProcess | async"
        >
          <ion-text *ngIf="(isOnLoginProcess | async) === false">
            Submit
          </ion-text>
          <ion-spinner
            name="lines-small"
            *ngIf="isOnLoginProcess | async"
          ></ion-spinner>
        </ion-button>
        <ion-button
          (click)="register()"
          color="tertiary"
          expand="block"
          fill="clear"
        >
          Register
        </ion-button>
      </form>
    </monic-page-layout>
  `,
})
export class LoginFormComponent implements OnInit {
  form: FormGroup;
  isOnLoginProcess = this.authService.loginOnLoad$;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      email: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  login() {
    if (!this.form.valid) {
      return;
    }
    this.authService.login(this.form.getRawValue());
  }

  ngOnInit(): void {
    this.authService.logout();
    this.authService.loginResult$.pipe(take(1)).subscribe(() => {
      this.router.navigate(['home'], { replaceUrl: true });
    });
  }

  register() {
    this.router.navigate(['auth/register']);
  }
}
