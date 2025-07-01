import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { ConfirmarcierreComponent } from '../../components/confirmarcierre/confirmarcierre.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../../firebase.service';
import { ActivatedRoute } from '@angular/router';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';


@Component({
  selector: 'app-nueva-clave',
  standalone: true,
  imports: [RouterLink,HeaderComponent,FooterComponent,ReactiveFormsModule,
      MatCardModule,FormsModule,MatListModule,MatProgressSpinnerModule,NgIf,NgFor,ConfirmarcierreComponent,MatSnackBarModule,
            SnackbarCustomComponent],
  templateUrl: './nueva-clave.component.html',
  styleUrl: './nueva-clave.component.css'
})
export class NuevaClaveComponent {

  formularioClaveNueva!: FormGroup;
  isLoading: boolean = false;
  submitted = false;
  passwordPattern: string = '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$';
  oobCode: string = '';
  emailVerificado: string = '';


  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router,private route: ActivatedRoute,private firebaseService: FirebaseService,private snackBar: MatSnackBar){

    this.oobCode = this.route.snapshot.queryParamMap.get('oobCode') || '';

      if (this.oobCode) {
        this.verificarCodigo();
      } else {
        this.mostrarSnack('Código inválido o faltante.', 'error');
        this.router.navigate(['/login']);
      }


    this.formularioClaveNueva= new FormGroup({
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

  get nuevaClave() {
    return this.formularioClaveNueva.get('nuevaClave');
  }

  get confirmarNuevaClave() {
    return this.formularioClaveNueva.get('confirmarNuevaClave');
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


  async verificarCodigo() {
    try {
      const email = await verifyPasswordResetCode(this.authService.authInstance, this.oobCode);
      this.emailVerificado = email;
      console.log('Email verificado:', email);
    } catch (error) {
      console.error('Código inválido o expirado', error);
      this.mostrarSnack('El enlace no es válido o ha expirado.', 'error');
      this.router.navigate(['/login']);
    }
  }



  async cambiarClave() {
    this.submitted = true;
    if (this.formularioClaveNueva.invalid) return;

    this.isLoading = true;
    const nuevaClave = this.formularioClaveNueva.get('nuevaClave')?.value;

    try {
      await confirmPasswordReset(this.authService.authInstance, this.oobCode, nuevaClave);
      this.mostrarSnack('Contraseña actualizada correctamente.', 'exito');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
      this.mostrarSnack('Error al actualizar la contraseña.', 'error');
    } finally {
      this.isLoading = false;
    }
  }


  volverLogin(){
    this.router.navigate(['/login']);
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
