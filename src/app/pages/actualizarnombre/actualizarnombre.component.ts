import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../../firebase.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';

@Component({
  selector: 'app-actualizarnombre',
  standalone: true,
  imports: [
    RouterLink, HeaderComponent, FooterComponent, MatCardModule, ReactiveFormsModule, NgIf,
    MatProgressSpinnerModule, MatSnackBarModule, SnackbarCustomComponent
  ],
  templateUrl: './actualizarnombre.component.html',
  styleUrl: './actualizarnombre.component.css'
})
export class ActualizarnombreComponent implements OnInit {

  formularioActualizarNombre!: FormGroup;
  isLoading: boolean = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {
    this.formularioActualizarNombre = this.fb.group({
      nombre: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ])
    });
  }

  get nombre() {
    return this.formularioActualizarNombre.get('nombre');
  }

  async ngOnInit() {
    try {
      const datos = await this.firebaseService.obtenerDatosPersona();
      this.nombre?.setValue(datos['nombreCompleto']);
    } catch (error) {
      console.error('Error al obtener el nombre:', error);
    }
  }

  async ActualizarNombre() {
    this.submitted = true;

    if (this.formularioActualizarNombre.invalid) {
      return;
    }

    this.isLoading = true;
    try {
      const nuevoNombre = this.nombre?.value;

      const user = await this.authService.obtenerUsuarioActual();
      if (!user) throw new Error('No hay usuario autenticado');

      //Para actualizar los nombres en todos lados
      await this.firebaseService.actualizarNombreUsuario(user.uid, nuevoNombre);
      await this.firebaseService.actualizarNombreEnPublicaciones(nuevoNombre);
      await this.firebaseService.actualizarNombreEnComentarios(nuevoNombre);


      this.mostrarSnack('Nombre actualizado correctamente', 'exito');
      this.router.navigate(['/perfil']);
    } catch (error) {
      console.error('Error al actualizar nombre:', error);
      this.mostrarSnack('Error al actualizar el nombre', 'error');
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

