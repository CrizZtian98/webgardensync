import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, MatCardModule,HeaderComponent,FooterComponent,ReactiveFormsModule,NgIf],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  formularioRegistro!: FormGroup;
  submitted = false;
  correoPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  passwordPattern = '^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z0-9!@#$%^&*(),.?":{}|<>]{8,}$';

  constructor(private fb: FormBuilder) {

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
    const contrasenaa = control.get('contrasenaa');
    const confirmarContrasena = control.get('confirmarContrasena');

    if (contrasenaa?.value !== confirmarContrasena?.value) {
      confirmarContrasena?.setErrors({ noCoincide: true });
    } else {
      confirmarContrasena?.setErrors(null);
    }

    return null;
  }
  
  async registrar() {
    this.submitted = true; 
  

    if (this.formularioRegistro.invalid) {
      return;
      }
  }





}

