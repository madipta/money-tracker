import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IUser } from '@monic/libs/types';
import { BehaviorSubject, concatMap, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private createSuccessSubject = new Subject<IUser>();
  readonly onCreateSuccess$ = this.createSuccessSubject.asObservable();
  private errorSubject = new Subject<string>();
  readonly onErros$ = this.errorSubject.asObservable();
  private savingProcessSubject = new BehaviorSubject(false);
  readonly onSavingProcess$ = this.savingProcessSubject.asObservable();
  readonly user$ = this.auth.user.pipe(
    concatMap((authUser) =>
      this.afs.doc<IUser>(`users/${authUser?.uid}`).valueChanges()
    )
  );

  constructor(private afs: AngularFirestore, private auth: AngularFireAuth) {}

  create(user: IUser) {
    this.savingProcessSubject.next(true);
    this.afs
      .doc(`users/${this.afs.createId()}`)
      .set(user)
      .then(() => this.createSuccessSubject.next(user))
      .catch((err) => {
        this.errorSubject.next('Creating user data failed!');
        console.error(err);
      })
      .finally(() => this.savingProcessSubject.next(false));
  }

  update(user: IUser) {
    this.savingProcessSubject.next(true);
    this.auth.user.subscribe((authUser) => {
      this.afs
        .doc(`users/${authUser?.uid}`)
        .update(user)
        .then(() => this.createSuccessSubject.next(user))
        .catch((err) => {
          this.errorSubject.next('Updating user data failed!');
          console.error(err);
        })
        .finally(() => this.savingProcessSubject.next(false));
    });
  }
}
