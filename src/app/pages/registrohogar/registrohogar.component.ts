import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { FirebaseService } from '../../../firebase.service';
import { getAuth } from 'firebase/auth';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgFor, NgIf } from '@angular/common';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-registrohogar',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,ReactiveFormsModule,MatCardModule,FormsModule,MatProgressSpinnerModule,
            NgIf,NgFor
  ],
  templateUrl: './registrohogar.component.html',
  styleUrl: './registrohogar.component.css'
})
export class RegistrohogarComponent {
  nombreHogar: string = '';
  isLoading: boolean = false;

  constructor(private firebaseservice: FirebaseService, private router: Router,private snackBar: MatSnackBar){
    
  }

  async registrarHogar() {
    this.isLoading = true;
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const uid = user.uid;
      const hogarId = await this.firebaseservice.addHogar(uid, this.nombreHogar);
      console.log('Hogar registrado con ID:', hogarId);
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Error de registro:', error.message);
    }
    this.isLoading = false;
      const datosUsuario: any = await this.firebaseservice.obtenerDatosPersona();
      const nombre = datosUsuario?.nombreCompleto || 'Usuario';
      this.mostrarSnack(`¡Bienvenido a GardenSync "${nombre}"!`, 'saludo');
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
