import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
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
} from '@monic/libs/ui/base';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  imports: [
    CommonModule,
    HideBackButtonDirective,
    IonicModule,
    PageLayoutComponent,
    ReactiveFormsModule,
  ],
  selector: 'monic-register-form',
  standalone: true,
  styles: [
    `
      .register-logo {
        text-align: center;

        ion-icon {
          color: var(--ion-color-tertiary);
          font-size: 128px;
          margin-top: 24px;
        }
      }
    `,
  ],
  template: `
    <monic-page-layout monicHideBackButton>
      <p pageTitle>Register</p>
      <div class="register-logo">
        <ion-icon name="sparkles-outline"></ion-icon>
      </div>
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
                [disabled]="isOnLoad | async"
              >
                <ion-text *ngIf="(isOnLoad | async) === false">
                  Submit
                </ion-text>
                <ion-spinner
                  name="lines-small"
                  *ngIf="isOnLoad | async"
                ></ion-spinner>
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
    </monic-page-layout>
  `,
})
export class RegisterFormComponent implements OnDestroy, OnInit {
  destroy$ = new Subject<boolean>();
  form: FormGroup;
  isOnLoad = this.authService.registerOnLoad$;

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.logout();
    this.authService.registerResult$
      .pipe(takeUntil(this.destroy$))
      .subscribe((uid) => {
        if (uid) {
          this.router.navigate(['auth/login']);
        }
      });
  }

  register() {
    if (!this.form.valid) {
      return;
    }
    this.authService.register(this.form.getRawValue());
  }
}
