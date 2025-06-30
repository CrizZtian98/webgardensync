import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { FirebaseService } from '../../../firebase.service';
import Swal from 'sweetalert2';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ RouterLink, HeaderComponent,FooterComponent,ReactiveFormsModule,
    MatCardModule,FormsModule,MatProgressSpinnerModule,NgIf,NgFor,MatSnackBarModule,
        SnackbarCustomComponent, 
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  email: string = '';
  password: string = '';
  isLoading: boolean = false;
  loginError: boolean = false;           
  loginErrorMessage: string = '';        
  formularioLogin: FormGroup<{ correo: FormControl<string | null>; contrasena: FormControl<string | null>; }>;

  constructor(private authService: AuthService,public fb: FormBuilder, private router: Router,private firebaseService: FirebaseService,
    private snackBar: MatSnackBar) {

    this.formularioLogin = this.fb.group({
      'correo': new FormControl("", [Validators.required, Validators.email]),
      'contrasena': new FormControl("", [Validators.required])
    });
  }


  get correo() {
    return this.formularioLogin.get('correo');
  }

  get contrasena() {
    return this.formularioLogin.get('contrasena');
  }



  ngOnInit() {
    /*this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        if (!user.isAnonymous) {
          console.log('Usuario con cuenta, redirigiendo a home:', user);
          this.router.navigate(['/perfil']);
        } else {
          console.log('Usuario anónimo, puede registrarse o iniciar sesión');
        }
      } else {
        console.log('No hay usuario logueado');
      }
    });*/
  }


async onLogin() {
  if (!this.email || !this.password) {
    this.mostrarSnack('Ingresa tus credenciales para iniciar sesión', 'info');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.email)) {
    this.mostrarSnack('El correo es inválido o inexistente', 'error');
    return;
  }

  this.isLoading = true;

  try {
    const userCredential = await this.authService.login(this.email, this.password);

    if (userCredential && userCredential.user) {
      const uid = userCredential.user.uid;

      // ✅ Verificar si está baneado
      const estaBaneado = await this.firebaseService.verificarSiBaneado(uid);
      if (estaBaneado) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          html: 'Tu cuenta ha sido baneada por incumplir las normas de convivencia.',
          confirmButtonColor: '#5d4037',
          confirmButtonText: 'Aceptar',
          color: '#388e3c',
          background: 'white url("https://sweetalert2.github.io/images/trees.png")',
          customClass: {
            popup: 'mi-swal-popup',
            title: 'mi-swal-title',
            htmlContainer: 'mi-swal-text',
            confirmButton: 'mi-swal-button'
          }
        });

        await this.authService.logout();
        this.isLoading = false;
        return;
      }

      // ✅ Obtener nombre del usuario
      const datosUsuario: any = await this.firebaseService.obtenerDatosPersona();
      const nombre = datosUsuario?.nombreCompleto || 'Usuario';

      console.log('Usuario logueado:', userCredential.user);
      this.mostrarSnack(`¡Hola de nuevo "${nombre}"!`, 'saludo');

      this.router.navigate(['/']);
    } else {
      this.mostrarSnack('No se pudo autenticar el usuario', 'error');

    }
  } catch (error: any) {
    this.handleLoginError(error);
  } finally {
    this.isLoading = false;
  }
}



  handleLoginError(error: any) {
    switch (error.code) {
      case 'auth/user-not-found':
          this.mostrarSnack('El usuario no existe', 'error');
        break;
      case 'auth/wrong-password':
        this.mostrarSnack('Contraseña incorrecta', 'error');
        break;
      case 'auth/invalid-email':
        this.mostrarSnack('Correo inválido', 'error');
        break;
      case 'auth/invalid-credential':
        this.mostrarSnack('El correo o la contraseña son inválios', 'error');
        break;

      default:
        this.mostrarSnack('Error de inicio de sesión, intenta nuevamente', 'error');
        console.error(error);
        break;
    }
  }

  async loginInvitado() {
    try {
      const user = await this.authService.loginAnonimo();
      this.router.navigate(['/registro-hogar']);
    } catch (error) {
      console.error('Error en login invitado:', error);
    }
  }


  async cerrarSesion() {
    try {
      await this.authService.logout();
      console.log('Sesión cerrada correctamente');
      this.mostrarSnack('Sesión cerrada, ¡Hasta luego!', 'cierre');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
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
