import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { IonicModule, AlertController, NavController } from '@ionic/angular';
import { PageLayoutComponent } from '@monic/libs/ui/base';
import { Subject, take, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';

export type UserForm = FormGroup<{
  address: FormControl<string>;
  city: FormControl<string>;
  country: FormControl<string>;
  name: FormControl<string>;
  phone: FormControl<string>;
}>;

@Component({
  imports: [
    AsyncPipe,
    IonicModule,
    NgIf,
    PageLayoutComponent,
    ReactiveFormsModule,
  ],
  selector: 'monic-account-form',
  standalone: true,
  template: `
    <monic-page-layout>
      <p pageTitle>My Account</p>
      <form [formGroup]="form" (ngSubmit)="save()">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-list>
                <ion-item class="ion-margin-top">
                  <ion-label position="floating">Name</ion-label>
                  <ion-input formControlName="name" required></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Address</ion-label>
                  <ion-textarea formControlName="address"></ion-textarea>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">City</ion-label>
                  <ion-input formControlName="city"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Country</ion-label>
                  <ion-input formControlName="country"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-label position="floating">Phone</ion-label>
                  <ion-input formControlName="phone"></ion-input>
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
                [disabled]="onSavingProcess$ | async"
              >
                <ion-text *ngIf="(onSavingProcess$ | async) === false">
                  Submit
                </ion-text>
                <ion-spinner
                  name="lines-small"
                  *ngIf="onSavingProcess$ | async"
                ></ion-spinner>
              </ion-button>
              <ion-button
                (click)="cancel()"
                color="warning"
                expand="block"
                fill="clear"
              >
                Cancel
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </form>
    </monic-page-layout>
  `,
})
export class AccountFormComponent implements OnInit, OnDestroy {
  destroy = new Subject();
  form: UserForm;
  onSavingProcess$ = this.userService.onSavingProcess$;

  constructor(
    private alertCtrl: AlertController,
    fb: FormBuilder,
    private nav: NavController,
    private userService: UserService
  ) {
    this.form = fb.nonNullable.group({
      address: fb.nonNullable.control(''),
      city: fb.nonNullable.control(''),
      country: fb.nonNullable.control(''),
      name: fb.nonNullable.control('', [Validators.required]),
      phone: fb.nonNullable.control(''),
    });
  }

  ngOnDestroy(): void {
    this.destroy.next(true);
    this.destroy.unsubscribe();
  }

  ngOnInit(): void {
    this.userService.user$
      .pipe(take(1))
      .subscribe((u) => this.form.patchValue(u || {}));
    this.userService.onErros$
      .pipe(takeUntil(this.destroy))
      .subscribe((msg) => this.errorAlert(msg));
  }

  cancel() {
    this.nav.back();
  }

  async errorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      buttons: ['OK'],
      header: 'Error',
      message,
    });
    await alert.present();
  }

  save() {
    if (this.form.invalid) {
      this.errorAlert('Invalid input!');
      return;
    }
    this.userService.update(this.form.getRawValue());
  }
}
