import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { IUserLogin, IUserRegister } from '@monic/libs/types';
import { BehaviorSubject, Subject } from 'rxjs';

type uidType = string | undefined | null;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private onLoginProcess = new BehaviorSubject(false);
  readonly onLoginProcess$ = this.onLoginProcess.asObservable();
  private onLoginSuccess = new Subject<uidType>();
  readonly onLoginSucccess$ = this.onLoginSuccess.asObservable();
  private onRegisterProcess = new BehaviorSubject(false);
  readonly onRegisterProcess$ = this.onRegisterProcess.asObservable();
  private onRegisterSuccess = new Subject<uidType>();
  readonly onRegisterSuccess$ = this.onRegisterSuccess.asObservable();

  constructor(private auth: AngularFireAuth) {}

  login(user: IUserLogin) {
    this.onLoginProcess.next(true);
    this.auth
      .signInWithEmailAndPassword(user.email, user.password)
      .then((val) => {
        this.onLoginSuccess.next(val.user?.uid);
      })
      .finally(() => this.onLoginProcess.next(false));
  }

  logout() {
    this.auth.signOut();
  }

  register(user: IUserRegister) {
    this.onRegisterProcess.next(true);
    this.auth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((val) => this.onRegisterSuccess.next(val.user?.uid))
      .finally(() => this.onRegisterProcess.next(false));
  }
}
