import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IUserLogin, IUserRegister } from '@monic/libs/types';
import { BehaviorSubject, Subject } from 'rxjs';

type uidType = string | undefined | null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private confirmPasswordResult = new Subject<boolean>();
  readonly confirmPasswordResult$ = this.confirmPasswordResult.asObservable();
  private confirmPasswordOnLoad = new BehaviorSubject(false);
  readonly confirmPasswordOnLoad$ = this.confirmPasswordOnLoad.asObservable();
  private sendResetEmailOnLoad = new BehaviorSubject(false);
  readonly sendResetEmailOnLoad$ = this.sendResetEmailOnLoad.asObservable();
  private sendResetEmailResult = new BehaviorSubject(false);
  readonly sendResetEmailResult$ = this.sendResetEmailResult.asObservable();
  private verifyCodeOnLoad = new BehaviorSubject(false);
  readonly verifyCodeOnLoad$ = this.verifyCodeOnLoad.asObservable();
  private verifyCodeResult = new BehaviorSubject(false);
  readonly verifyCodeResult$ = this.verifyCodeResult.asObservable();
  private loginOnLoad = new BehaviorSubject(false);
  readonly loginOnLoad$ = this.loginOnLoad.asObservable();
  private loginResult = new Subject<uidType>();
  readonly loginResult$ = this.loginResult.asObservable();
  private registerOnLoad = new BehaviorSubject(false);
  readonly registerOnLoad$ = this.registerOnLoad.asObservable();
  private registerResult = new Subject<uidType>();
  readonly registerResult$ = this.registerResult.asObservable();

  constructor(private auth: AngularFireAuth) {}

  confirmPassword(code: string, newPassword: string) {
    this.confirmPasswordOnLoad.next(true);
    this.auth
      .confirmPasswordReset(code, newPassword)
      .then(() => this.confirmPasswordResult.next(true))
      .catch(() => this.confirmPasswordResult.next(false))
      .finally(() => this.confirmPasswordOnLoad.next(false));
  }

  login(user: IUserLogin) {
    this.loginOnLoad.next(true);
    this.auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((val) => {
        this.loginResult.next(val.user?.uid);
      })
      .finally(() => this.loginOnLoad.next(false));
  }

  logout() {
    this.auth.signOut();
  }

  register(user: IUserRegister) {
    this.registerOnLoad.next(true);
    this.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((val) => this.registerResult.next(val.user?.uid))
      .finally(() => this.registerOnLoad.next(false));
  }

  sendResetEmail(email: string) {
    this.sendResetEmailOnLoad.next(true);
    this.auth
      .sendPasswordResetEmail(email)
      .then(() => this.sendResetEmailResult.next(true))
      .catch(() => this.sendResetEmailResult.next(false))
      .finally(() => this.sendResetEmailOnLoad.next(false));
  }

  verifyCode(code: string, email: string) {
    this.verifyCodeOnLoad.next(true);
    this.auth
      .verifyPasswordResetCode(code)
      .then((emailResult) =>
        this.verifyCodeResult.next(
          emailResult === email.toLocaleLowerCase().trim()
        )
      )
      .catch(() => this.verifyCodeResult.next(false))
      .finally(() => this.verifyCodeOnLoad.next(false));
  }
}
