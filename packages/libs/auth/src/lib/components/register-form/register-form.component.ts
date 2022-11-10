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
  selector: 'monic-register-form',
  standalone: true,
  template: `
    <form [formGroup]="form" (ngSubmit)="register()">
      <ion-grid>
        <ion-row class="ion-margin-top">
          <ion-col>
            <ion-list>
              <ion-item>
                <ion-label position="floating">Name</ion-label>
                <ion-input formControlName="name" required></ion-input>
              </ion-item>
              <ion-item>
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
            <ion-button
              type="submit"
              color="success"
              expand="block"
              (click)="register()"
            >
              Submit
            </ion-button>
            <ion-button
              color="danger"
              expand="block"
              fill="clear"
              (click)="login()"
            >
              Login
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>
    </form>
  `,
})
export class RegisterFormComponent implements OnInit {
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
      name: this.fb.nonNullable.control('', [Validators.required]),
      password: this.fb.nonNullable.control('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  login() {
    this.router.navigate(['auth/login']);
  }

  ngOnInit(): void {
    this.authService.logout();
    this.authService.onRegisterSuccess$.pipe(take(1)).subscribe(() => {
      this.router.navigate(['auth/login']);
    });
  }

  register() {
    if (!this.form.valid) {
      return;
    }
    this.authService.register(this.form.getRawValue());
  }
}
