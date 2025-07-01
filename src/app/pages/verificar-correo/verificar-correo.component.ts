import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { ConfirmarcierreComponent } from '../../components/confirmarcierre/confirmarcierre.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../../firebase.service';

@Component({
  selector: 'app-verificar-correo',
  standalone: true,
  imports: [RouterLink,HeaderComponent,FooterComponent,ReactiveFormsModule,
      MatCardModule,FormsModule,MatListModule,MatProgressSpinnerModule,NgIf,NgFor,ConfirmarcierreComponent,MatSnackBarModule,
      SnackbarCustomComponent],
  templateUrl: './verificar-correo.component.html',
  styleUrl: './verificar-correo.component.css'
})
export class VerificarCorreoComponent {
    formularioCorreo!: FormGroup;
    submitted = false;
    correoPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    errorMessage: any;
    isLoading: boolean = false;

  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router,private firebaseService: FirebaseService,private snackBar: MatSnackBar){

    this.formularioCorreo = this.fb.group({
        'correo': new FormControl('', [
          Validators.required,
          Validators.pattern(this.correoPattern),               
          Validators.email                   
        ]),
    });
  }

  get correo() {
    return this.formularioCorreo.get('correo');
  }

async verificarCorreo() {
  this.isLoading = true;
  const correo = this.formularioCorreo.get('correo')?.value;

  try {
    const resultado = await this.firebaseService.enviarCorreoRecuperacion(correo);

    if (resultado.success) {
      this.mostrarSnack(resultado.message, 'exito');
    } else {
      this.mostrarSnack(resultado.message, 'error');
    }

  } catch (error) {
    console.error('Error al verificar correo:', error);
    this.mostrarSnack('Error inesperado', 'error');
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
