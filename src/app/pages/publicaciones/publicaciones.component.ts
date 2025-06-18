import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { FirebaseService } from '../../../firebase.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModalController, IonButton } from '@ionic/angular/standalone';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [IonButton, HeaderComponent, FooterComponent, MatCardModule, MatMenuModule,
            MatIconModule, MatButtonModule,NgIf,NgFor,MatGridListModule],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css'
})
export class PublicacionesComponent{
  publicaciones: any[] = [];
  cargando = true;
  textoPublicacion = '';
  esAnonimo = false;

  constructor(
    private firebaseService: FirebaseService, private auth: AuthService, private router: Router
     
  ) {}


  async ngOnInit() {
    this.cargarPublicaciones();
    this.auth.getCurrentUser().subscribe((user) => {
      if (user) {
        console.log('Usuario ya logueado', user);
      } else {
        console.log('No hay usuario logueado');
        this.router.navigate(['/registro']);
      }
    });
    this.esAnonimo = await this.auth.isAnonimo();
  
  }

  async crearPublicacion() {
    if (!this.textoPublicacion.trim()) return;

    await this.firebaseService.crearPublicacion(this.textoPublicacion);
    this.textoPublicacion = '';
    await this.cargarPublicaciones();
  }

  async cargarPublicaciones() {
    this.cargando = true;
    this.publicaciones = await this.firebaseService.obtenerPublicaciones();
    this.cargando = false;
  }

  async like(id: string) {
    await this.firebaseService.darLike(id);
    await this.cargarPublicaciones();
  }

  async dislike(id: string) {
    await this.firebaseService.darDislike(id);
    await this.cargarPublicaciones();
  }


}
