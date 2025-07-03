import { Injectable, OnDestroy } from '@angular/core';
import { Auth, User, signInAnonymously, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private unsubscribeBaneo: (() => void) | null = null;

  constructor(
    private auth: Auth,
    private db: Firestore,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.monitorBaneo();
  }

  ngOnDestroy() {
    this.clearBaneoListener();
  }

  // 🔥 Escucha en tiempo real el estado de baneo
  private monitorBaneo() {
    this.auth.onAuthStateChanged((user) => {
      this.clearBaneoListener();

      if (user) {
        const userDocRef = doc(this.db, 'Personas', user.uid);
        this.unsubscribeBaneo = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data['baneado'] === true) {
              Swal.fire({
                icon: 'error',
                title: 'Acceso denegado',
                html: 'Tu cuenta ha sido baneada por incumplir las normas de convivencia.',
                confirmButtonColor: '#5d4037',
                confirmButtonText: 'Aceptar',
                color: '#388e3c',
                customClass: {
                  popup: 'mi-swal-popup',
                  title: 'mi-swal-title',
                  htmlContainer: 'mi-swal-text',
                  confirmButton: 'mi-swal-button'
                }
              });

              this.logout();
              this.router.navigate(['/login']);
            }
          }
        });
      }
    });
  }

  // 🔥 Limpia el listener para evitar duplicados
  private clearBaneoListener() {
    if (this.unsubscribeBaneo) {
      this.unsubscribeBaneo();
      this.unsubscribeBaneo = null;
    }
  }

  get authInstance(): Auth {
    return this.auth;
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password);
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
        (user) => observer.next(user),
        (error) => observer.error(error),
        () => observer.complete()
      );
      return unsubscribe;
    });
  }

  async obtenerUsuarioActual(): Promise<User | null> {
    return this.auth.currentUser;
  }

  async logout() {
    this.clearBaneoListener();
    await this.auth.signOut();
  }
}




