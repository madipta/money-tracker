import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/angular/base';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';

type ResetPasswordForm = FormGroup<{
  email: FormControl<string>;
}>;

@Component({
  imports: [
    AsyncPipe,
    IonicModule,
    NgIf,
    PageLayoutComponent,
    ReactiveFormsModule,
  ],
  selector: 'monic-reset-password',
  standalone: true,
  template: `
    <monic-page-layout>
      <p pageTitle>Password Reset</p>
      <form [formGroup]="form" (ngSubmit)="send()">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-label color="secondary">
                <small>Password reset request</small>
              </ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-list>
                <ion-item class="ion-margin-top">
                  <ion-label position="floating">Email Address</ion-label>
                  <ion-input formControlName="email" required></ion-input>
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
                [disabled]="onSendResetEmail$ | async"
              >
                <ion-text *ngIf="(onSendResetEmail$ | async) === false">
                  Send
                </ion-text>
                <ion-spinner
                  name="lines-small"
                  *ngIf="onSendResetEmail$ | async"
                ></ion-spinner>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </monic-page-layout>
  `,
})
export class ResetPasswordComponent implements OnDestroy, OnInit {
  destroy = new Subject();
  form: ResetPasswordForm;
  onSendResetEmail$ = this.authService.sendResetEmailOnLoad$;
  sendEmailResult$ = this.authService.sendResetEmailResult$;

  constructor(
    private authService: AuthService,
    fb: FormBuilder,
    private router: Router
  ) {
    this.form = fb.group({
      email: fb.nonNullable.control('', [
        Validators.required,
        Validators.email,
      ]),
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  ngOnInit(): void {
    this.authService.sendResetEmailResult$
      .pipe(takeUntil(this.destroy))
      .subscribe((val) => {
        if (val) {
          this.router.navigate(['auth/login'], { replaceUrl: true });
        }
      });
  }

  send() {
    if (this.form.invalid) {
      return;
    }
    this.authService.sendResetEmail(this.form.getRawValue().email);
  }
}
