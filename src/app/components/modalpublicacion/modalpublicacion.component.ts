import { Component, Input } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { FirebaseService } from '../../../firebase.service';

@Component({
  selector: 'app-modalpublicacion',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,MatCardModule, MatMenuModule,
            MatIconModule, MatButtonModule,NgIf,NgFor,MatGridListModule],
  templateUrl: './modalpublicacion.component.html',
  styleUrl: './modalpublicacion.component.css'
})
export class ModalpublicacionComponent {
    @Input() publicacion: any;
    nuevoComentario: string = '';
    cargandoComentarios: boolean = false;
    comentarios: any[] = [];

  constructor(
    private firebaseService: FirebaseService
  ) {}

  async ngOnInit() {
    await this.cargarComentarios();
  }

  cerrar() {
    
  }

  async cargarComentarios() {
    this.cargandoComentarios = true;
    this.comentarios = await this.firebaseService.obtenerComentarios(this.publicacion.id);
    this.cargandoComentarios = false;
  }

  async enviarComentario() {
    if (!this.nuevoComentario.trim()) return;

    await this.firebaseService.comentar(this.publicacion.id, this.nuevoComentario);
    this.nuevoComentario = '';
    await this.cargarComentarios();
  }

  /*async like() {
    await this.firebaseService.darLike(this.publicacion.id);
  }

  async dislike() {
    await this.firebaseService.darDislike(this.publicacion.id);
  }*/
}
