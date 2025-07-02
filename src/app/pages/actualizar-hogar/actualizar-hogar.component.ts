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
      this.idHogar = datosHogar.id;
      this.formularioActualizarHogar.patchValue({
        hogar: (datosHogar as any).nombreHogar
      });

    } catch (error) {
      console.error('Error al cargar datos del hogar:', error);
      this.mostrarSnack('Error al cargar datos del hogar', 'error');
    }
  }

  async actualizarHogar() {
    this.submitted = true;

    if (this.formularioActualizarHogar.invalid) {
      return;
    }

    this.isLoading = true;
    const nuevoNombre = this.hogar?.value;

    try {
      await this.firebaseService.actualizarNombreHogar(this.idHogar, nuevoNombre);
      this.mostrarSnack('Hogar actualizado con éxito', 'exito');
      this.router.navigate(['/perfil']);
    } catch (error) {
      console.error('Error al actualizar hogar:', error);
      this.mostrarSnack('Error al actualizar hogar', 'error');
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

