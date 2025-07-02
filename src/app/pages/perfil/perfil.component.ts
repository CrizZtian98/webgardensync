import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { FirebaseService } from '../../../firebase.service';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarcierreComponent } from '../../components/confirmarcierre/confirmarcierre.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';

@Component({
  selector: 'app-perfil',
  
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent,ReactiveFormsModule,
      MatCardModule,FormsModule,MatListModule,MatProgressSpinnerModule,NgIf,NgFor,ConfirmarcierreComponent,MatSnackBarModule,
            SnackbarCustomComponent,
  ],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent {
  hogar: any;
  nombre: string = '';
  correo: string = '';
  esAnonimo = false;

  loadingNombre = true;
  loadingCorreo = true;
  loadingHogar = true;

  constructor(private firebaseService: FirebaseService, private router: Router, private authservice: AuthService,private dialog: MatDialog
    ,private snackBar: MatSnackBar
  ){}

  async ngOnInit() {
    this.cargarDatosPerfil();
    this.cargardatosHogar();
    /*this.authservice.getCurrentUser().subscribe((user) => {
      if (user) {
        console.log('Usuario ya logueado', user);
      } else {
        console.log('No hay usuario logueado');
        this.router.navigate(['/registro']);
      }
    });
    this.esAnonimo = await this.authservice.isAnonimo();*/
  }

  async cargarDatosPerfil() {
    this.loadingNombre = true;
    this.loadingCorreo = true;
    try {
      const datos = await this.firebaseService.obtenerDatosPersona();
      this.nombre = datos['nombreCompleto'];
      this.correo = datos['correo'];
    } catch (error) {
      console.error('Error al cargar el perfil:', error);
    } finally {
      this.loadingNombre = false;
      this.loadingCorreo = false;
    }
  }

  async cargardatosHogar() {
    this.loadingHogar = true;
    try {
      const datos = await this.firebaseService.obtenerHogarUsuario();
      this.hogar = datos;
    } catch (error) {
      console.error('Error al cargar los datos del hogar:', error);
    } finally {
      this.loadingHogar = false;
    }
  }

  async cerrarSesion() {
    const dialogRef = this.dialog.open(ConfirmarcierreComponent, {
      data: { mensaje: '¿Desea cerrar sesión?' }
    });

    dialogRef.afterClosed().subscribe(async (resultado) => {
      if (resultado) {
        try {
          await this.authservice.logout();
          console.log('Sesión cerrada correctamente');
          this.mostrarSnack('Sesión cerrada. ¡Hasta luego!', 'cierre');
          this.router.navigate(['/login']);
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
        }
      }
    });
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

  actualizarNombre(){
    this.router.navigate(['/actualizarnombre']);
  }

  actualizarClave(){
    this.router.navigate(['/actualizarclave']);
  }

  actualizarHogar(){
    this.router.navigate(['/actualizar-hogar']);
  }

}
