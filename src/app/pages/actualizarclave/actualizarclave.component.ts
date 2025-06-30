import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FirebaseService } from '../../../firebase.service';

import { FirebaseInitService } from '../../../firebase-init.service';  // IMPORTA EL SERVICIO
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, User } from 'firebase/auth';

@Component({
  selector: 'app-actualizarclave',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MatCardModule,
    ReactiveFormsModule,
    NgIf,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SnackbarCustomComponent
  ],
  templateUrl: './actualizarclave.component.html',
  styleUrl: './actualizarclave.component.css'
})
export class ActualizarclaveComponent {

  formularioActualizarClave!: FormGroup;
  isLoading: boolean = false;
  submitted = false;
  passwordPattern: string = '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar,
    private firebaseInitService: FirebaseInitService  // INYECTA EL SERVICIO
  ) {
    this.formularioActualizarClave = new FormGroup({
      'claveActual': new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordPattern),
        Validators.minLength(8),
      ]),
      'nuevaClave': new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordPattern),
        Validators.minLength(8),
      ]),
      'confirmarNuevaClave': new FormControl('', [
        Validators.required
      ])
    }, [this.confirmarClaveValidator]);
  }

  get claveActual() {
    return this.formularioActualizarClave.get('claveActual');
  }

  get nuevaClave() {
    return this.formularioActualizarClave.get('nuevaClave');
  }

  get confirmarNuevaClave() {
    return this.formularioActualizarClave.get('confirmarNuevaClave');
  }

  confirmarClaveValidator: ValidatorFn = (control: AbstractControl) => {
    const nuevaClave = control.get('nuevaClave');
    const confirmarNuevaClave = control.get('confirmarNuevaClave');

    if (nuevaClave && confirmarNuevaClave) {
      if (nuevaClave.value !== confirmarNuevaClave.value) {
        confirmarNuevaClave.setErrors({ noCoincide: true });
      } else {
        confirmarNuevaClave.setErrors(null);
      }
    }

    return null;
  };

  async ActualizarClave() {
    this.submitted = true;

    if (this.formularioActualizarClave.invalid) {
      return;
    }

    this.isLoading = true;
    const claveActual = this.claveActual?.value;
    const nuevaClave = this.nuevaClave?.value;

    // OBTENER EL USER DEL auth DEL SERVICIO FIREBASEINIT
    const auth = this.firebaseInitService.auth;
    const user = auth.currentUser as User | null;

    if (!user || !user.email) {
      this.isLoading = false;
      this.mostrarSnack('No se encontró un usuario autenticado', 'error');
      return;
    }

    const credential = EmailAuthProvider.credential(
      user.email,
      claveActual
    );

    try {
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, nuevaClave);
      this.mostrarSnack('Contraseña actualizada correctamente', 'exito');
      this.router.navigate(['/perfil']);
    } catch (error: any) {
      console.error('Error al actualizar la contraseña:', error);
      if (error.code === 'auth/wrong-password') {
        this.mostrarSnack('La contraseña actual es incorrecta', 'error');
      } else if (error.code === 'auth/network-request-failed') {
        this.mostrarSnack('Error de red. Verifica tu conexión a internet.', 'error');
      } else {
        this.mostrarSnack('Error al actualizar la contraseña', 'error');
      }
    } finally {
      this.isLoading = false;
    }
  }

  volverPerfil() {
    this.router.navigate(['/perfil']);
  }

  mostrarSnack(mensaje: string, tipo: 'exito' | 'error' | 'info' | 'warning' | 'saludo' | 'cierre') {
    this.snackBar.openFromComponent(SnackbarCustomComponent, {
      data: { mensaje, tipo },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }
}
