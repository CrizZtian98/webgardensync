import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseService } from '../../../firebase.service';
import { NgFor, NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-usuariosregistrados',
  standalone: true,
  imports: [
    RouterLink,
    HeaderComponent,
    FooterComponent,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    NgFor,
    MatProgressSpinnerModule
  ],
  templateUrl: './usuariosregistrados.component.html',
  styleUrl: './usuariosregistrados.component.css'
})
export class UsuariosregistradosComponent implements OnInit{
  usuarios: any[] = [];
  cargando = false;
  esAnonimo = false;
  constructor(private firebaseService: FirebaseService,private auth: AuthService, private router: Router,) {}
    
    async ngOnInit() {
    this.cargando = true;
    await this.obtenerUsuariosRegistrados();
    this.auth.getCurrentUser().subscribe((user) => {
      if (user) {
        console.log('Usuario ya logueado', user);
      } else {
        console.log('No hay usuario logueado');
        this.router.navigate(['/login']);
      }
    });
    this.esAnonimo = await this.auth.isAnonimo();
  }


  async obtenerUsuariosRegistrados(){
    this.cargando = true;
    try {
      this.usuarios = await this.firebaseService.obtenerUsuariosRegistrados();
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
    this.cargando = false; 
  }  

  //Añadido recientemente
  async banear(uid: string) {
    try {
      await this.firebaseService.banearUsuario(uid);
      alert('Usuario baneado exitosamente');
      this.obtenerUsuariosRegistrados(); // Refrescar lista
    } catch (error) {
      console.error('Error al banear:', error);
      alert('Error al banear usuario');
    }
  }

  //Añadido recientemente
  async desbanear(uid: string) {
    try {
      await this.firebaseService.desbanearUsuario(uid);
      alert('Usuario desbaneado correctamente');
      await this.obtenerUsuariosRegistrados(); // refresca lista
    } catch (error) {
      console.error(error);
      alert('Error al desbanear usuario');
    }
  }
}

