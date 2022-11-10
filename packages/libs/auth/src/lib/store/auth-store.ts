import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { Observable } from 'rxjs';

export interface IAuthState {
  email?: string | undefined | null;
  isAuthenticated: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthStore extends ComponentStore<IAuthState> {
  constructor() {
    super({ isAuthenticated: false });
  }

  readonly isAuthenticated$: Observable<boolean> = this.select(
    ({ isAuthenticated }) => isAuthenticated
  );

  login(email: string) {
    this.set({ email, isAuthenticated: true });
  }

  logout() {
    this.set({ email: null, isAuthenticated: false });
  }

  set(state: IAuthState) {
    this.setState(state);
  }
}
