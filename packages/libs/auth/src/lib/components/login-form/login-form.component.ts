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
import { take } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  selector: 'monic-login-form',
  standalone: true,
  template: `
    <form [formGroup]="form" (ngSubmit)="login()">
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-list>
              <ion-item class="ion-margin-top">
                <ion-label position="floating">Email</ion-label>
                <ion-input formControlName="email" required></ion-input>
              </ion-item>
              <ion-item>
                <ion-label position="floating">Password</ion-label>
                <ion-input
                  formControlName="password"
                  required
                  type="password"
                ></ion-input>
              </ion-item>
            </ion-list>
          </ion-col>
        </ion-row>
        <ion-row class="ion-margin-top">
          <ion-col>
            <ion-button type="submit" color="success" expand="block">
              Submit
            </ion-button>
            <ion-button
              color="warning"
              expand="block"
              fill="clear"
              (click)="register()"
            >
              Register
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </form>
  `,
})
export class LoginFormComponent implements OnInit {
  form: FormGroup;

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
    this.authService.onLoginSucccess$.pipe(take(1)).subscribe(() => {
      this.router.navigate(['home']);
    });
  }

  register() {
    this.router.navigate(['auth/register']);
  }
}
