import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../../firebase.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, MatCardModule,HeaderComponent,FooterComponent,ReactiveFormsModule,NgIf,MatProgressSpinnerModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  formularioRegistro!: FormGroup;
  submitted = false;
  correoPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordPattern = '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$';
  errorMessage: any;
  isLoading: boolean = false;


  constructor(private fb: FormBuilder,private authService: AuthService,private router: Router,private firebaseService: FirebaseService) {

    this.formularioRegistro = this.fb.group({
        'nombre': new FormControl('', [
          Validators.required,               
          Validators.maxLength(50),
          Validators.minLength(6),
        ]),
        'correo': new FormControl('', [
          Validators.required,
          Validators.pattern(this.correoPattern),               
          Validators.email                   
        ]),
        'contrasena': new FormControl('', [
          Validators.required,               
          Validators.pattern(this.passwordPattern)  
        ]),
        'confirmarContrasena': new FormControl('', [
          Validators.required                
        ]),
        
    },{ validators: this.confirmarContrasenaValidator});
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        console.log('Usuario ya logueado', user);
        this.router.navigate(['/home']);
      } else {
        console.log('No hay usuario logueado');
      }
    });

  }

  get nombre() {
    return this.formularioRegistro.get('nombre');
  }

  get correo() {
    return this.formularioRegistro.get('correo');
  }

  get contrasena() {
    return this.formularioRegistro.get('contrasena');
  }

  get confirmarContrasena() {
    return this.formularioRegistro.get('confirmarContrasena');
  }

  confirmarContrasenaValidator(control: FormGroup) {
    const contrasena = control.get('contrasena');
    const confirmarContrasena = control.get('confirmarContrasena');

    if (contrasena?.value !== confirmarContrasena?.value) {
      confirmarContrasena?.setErrors({ noCoincide: true });
    } else {
      confirmarContrasena?.setErrors(null);
    }

    return null;
  }
  
async registrar() {
  console.log('registrar llamado');
  this.submitted = true;

  if (this.formularioRegistro.invalid) {
    return;
  }

  this.isLoading = true;  

  try {
    const { nombre, correo, contrasena } = this.formularioRegistro.value;
    await this.firebaseService['firebaseInitService'].whenReady();
    const uid = await this.firebaseService.registro(nombre, correo, contrasena);
    console.log('Usuario registrado con UID:', uid);
    this.router.navigate(['registrohogar']);
  } catch (error: any) {
    this.errorMessage = error.message; 
    console.error('Error de registro:', error.message);
  } finally {
    this.isLoading = false; 
  }



}

}

