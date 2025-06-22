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

  constructor(private firebaseservice: FirebaseService, private router: Router){
    
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
  }

}
