import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, HeaderComponent,FooterComponent,ReactiveFormsModule,
    MatCardModule,FormsModule
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

  constructor(private authService: AuthService,public fb: FormBuilder, private router: Router,) {

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
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        if (!user.isAnonymous) {
          console.log('Usuario con cuenta, redirigiendo a home:', user);
          this.router.navigate(['/home']);
        } else {
          console.log('Usuario anónimo, puede registrarse o iniciar sesión');
        }
      } else {
        console.log('No hay usuario logueado');
      }
    });
  }


  async onLogin() {
    if (!this.email || !this.password) {
      alert('Por favor, ingresa un correo y una contraseña.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      alert('el correo es inválido.');
      return;
    }
  
    this.isLoading = true; 
  
    try {
      const user = await this.authService.login(this.email, this.password);
  
      if (user && user.user) {
        console.log('Usuario logueado:', user.user);
        this.router.navigate(['/home']);
      } else {
        throw new Error('No se pudo autenticar el usuario.');
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
        alert('El usuario no existe.');
        break;
      case 'auth/wrong-password':
        alert('Contraseña incorrecta.');
        break;
      case 'auth/invalid-email':
        alert('Correo inválido.');
        break;
      case 'auth/invalid-credential':
      alert('El correo o la contraseña son inválidos.');
        break;

      default:
        alert('Error de login. Intenta nuevamente.');
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

}
