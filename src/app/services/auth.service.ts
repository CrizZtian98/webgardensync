import { Injectable } from '@angular/core';
import { Auth, User, signInAnonymously, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  

  constructor(private auth: Auth) {}

  // Iniciar sesión con correo y contraseña
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
  }

  // Iniciar sesión anónima
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

  // Verifica si el usuario actual es anónimo
  async isAnonimo(): Promise<boolean> {
    const user = this.auth.currentUser;
    return user ? user.isAnonymous : false;
  }

  // Obtener el usuario autenticado actual como observable
  getCurrentUser(): Observable<User | null> {
    return new Observable((observer) => {
      const unsubscribe = this.auth.onAuthStateChanged(
        (user) => observer.next(user),
        (error) => observer.error(error),
        () => observer.complete()
      );
      return unsubscribe;
    });
  }

  // Cerrar sesión
  logout() {
    return this.auth.signOut();
  }
}

