import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './user.service';
import { FirebaseUserModel } from '../classes/user.model';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  authStateUpdated$: EventEmitter<FirebaseUserModel> = new EventEmitter();

  constructor(
   private afAuth: AngularFireAuth,
   private userService: UserService,
   private messageService: MessageService,
   private router: Router
 ) {}

  /**
   * implements CanActivate /
   * app-routing.module 에서 사용예시 :
   * { path: 'login', component: LoginComponent, canActivate: [AuthService] }
   */
  canActivate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.userService.getCurrentUserRawInfo()
      .then(user => {
        this.router.navigate(['/user']);
        return resolve(false);
      }, err => {
        return resolve(true);
      });
    });
  }

  doFacebookLogin(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const provider =
        new firebase.auth.FacebookAuthProvider();
      this.afAuth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  doTwitterLogin(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const provider =
        new firebase.auth.TwitterAuthProvider();
      this.afAuth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  doGoogleLogin(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const provider =
        new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth
      .signInWithPopup(provider)
      .then(res => {
        this.log('Login Complete!! (with Google)');
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      });
    });
  }

  doRegister(value: { email: string; password: string; }): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // firebase.auth().
      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogin(value: { email: string; password: string; }) {
    return new Promise<any>((resolve, reject) => {
      // firebase.auth().
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err));
    });
  }

  doLogout() {
    return new Promise((resolve, reject) => {
      if (// firebase.auth().
      this.afAuth.currentUser) {
        this.afAuth.signOut().then(_ => this.authStateUpdated$.emit(new FirebaseUserModel()));
        this.router.navigate(['/']);
        this.log('Logout Complete!!');
        resolve();
      } else {
        reject();
      }
    });
  }

  private log(message: string) {
    this.messageService.add(`authService: ${message}`);
  }
}
