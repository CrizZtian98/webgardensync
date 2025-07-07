import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';
import { FirebaseService } from '../../../firebase.service';

@Component({
  selector: 'app-actualizar-hogar',
  standalone: true,
  imports: [
    RouterLink, HeaderComponent, FooterComponent, MatCardModule,
    ReactiveFormsModule, NgIf, MatProgressSpinnerModule,
    MatSnackBarModule, SnackbarCustomComponent
  ],
  templateUrl: './actualizar-hogar.component.html',
  styleUrl: './actualizar-hogar.component.css'
})
export class ActualizarHogarComponent implements OnInit {

  formularioActualizarHogar!: FormGroup;
  isLoading: boolean = false;
  submitted = false;
  idHogar!: string;

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.formularioActualizarHogar = this.fb.group({
      'hogar': new FormControl('', [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(30)
      ])
    });
  }

  ngOnInit() {
    this.cargarDatosHogar();
  }

  get hogar() {
    return this.formularioActualizarHogar.get('hogar');
  }

async cargarDatosHogar() {
  try {
    const datosHogar = await this.firebaseService.obtenerHogarUsuario();
    if (datosHogar) {
      this.idHogar = datosHogar.id;
      this.formularioActualizarHogar.patchValue({
        hogar: (datosHogar as any).nombreHogar || ''
      });
    } else {
      // No hay hogar → no hacemos nada especial
      this.idHogar = '';  // O null si prefieres
    }

  } catch (error) {
    console.warn('No se encontró hogar, puedes crear uno nuevo.');
    this.idHogar = '';  // Asegúrate de limpiar el id
  }
}


async actualizarHogar() {
  this.submitted = true;

  if (this.formularioActualizarHogar.invalid) {
    this.mostrarSnack('El nombre del hogar es inválido.', 'warning');
    return;
  }

  this.isLoading = true;
  const nuevoNombre = this.hogar?.value;

  try {
    if (this.idHogar) {
      // Si ya hay un hogar, actualizarlo
      await this.firebaseService.actualizarNombreHogar(this.idHogar, nuevoNombre);
      this.mostrarSnack('Hogar actualizado con éxito', 'exito');
    } else {
      // Si no hay hogar, crearlo
      const user = await this.firebaseService.obtenerDatosPersona();
      const uid = this.firebaseService['auth'].currentUser?.uid;  // Obtenemos UID actual

      if (!uid) throw new Error('Usuario no autenticado');

      const nuevoHogarId = await this.firebaseService.addHogar(uid, nuevoNombre);
      this.idHogar = nuevoHogarId;
      this.mostrarSnack('Hogar creado con éxito', 'exito');
    }

    this.router.navigate(['/perfil']);

  } catch (error) {
    console.error('Error al actualizar o crear hogar:', error);
    this.mostrarSnack('Error al actualizar o crear hogar', 'error');
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

