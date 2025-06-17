import { Injectable } from '@angular/core';
import { Auth, getAuth, signInAnonymously, signInWithEmailAndPassword, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { FirebaseInitService } from '../../firebase-init.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth
  constructor(private firebaseInitService: FirebaseInitService) {
    this.auth = firebaseInitService.auth;
  }

  async login(email: string, password: string) {
    const auth = getAuth();
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async loginAnonimo() {
    try {
      const userCredential = await signInAnonymously(this.auth);
      console.log('UID anónimo:', userCredential.user.uid);
      return userCredential.user;
    } catch (error) {
      console.error('Error login anónimo', error);
      throw error;
    }
  }

  async isAnonimo(): Promise<boolean> {
    const user = this.auth.currentUser;
    return user ? user.isAnonymous : false;
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user) => {
          observer.next(user);  // Emitir el usuario
        },
        (error) => {
          observer.error(error);  // Emitir el error
        },
        () => {
          observer.complete();  // Completar cuando termine
        }
      );

      // Limpiar la suscripción cuando se desuscriba el observable
      return unsubscribe;
    });
  }

  logout() {
    return this.auth.signOut();
  }
}
