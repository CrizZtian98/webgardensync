import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { FirebaseService } from '../../../firebase.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgIf,
    NgFor,
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent {
  publicacion: any;
  nuevoComentario: string = '';
  cargandoComentarios: boolean = false;
  comentarios: any[] = [];
  menuMap: any = {};

  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.publicacion = history.state.publicacion;

    if (!this.publicacion) {
      // Si no viene la publicación, redirigimos o mostramos error
      console.error('No se recibió la publicación');
      this.router.navigate(['/publicaciones']);
      return;
    }

    await this.cargarComentarios();
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

  async like() {
    await this.firebaseService.darLike(this.publicacion.id);
  }

  async dislike() {
    await this.firebaseService.darDislike(this.publicacion.id);
  }

  cerrar(){
    this.router.navigate(['publicaciones'])
  }

  //Implementado recientemente
  async eliminarPublicacion() {
    if (!confirm('¿Seguro que quieres eliminar esta publicación?')) return;
    try {
      await this.firebaseService.eliminarPublicacion(this.publicacion.id);
      alert('Publicación eliminada');
      this.router.navigate(['/publicaciones']);
    } catch (error) {
      alert('Error al eliminar la publicación');
      console.error(error);
    }
  }

  //Implementado recientemente
  async eliminarComentario(idComentario: string) {
    if (!confirm('¿Seguro que quieres eliminar este comentario?')) return;
    try {
      await this.firebaseService.eliminarComentario(this.publicacion.id, idComentario);
      alert('Comentario eliminado');
      await this.cargarComentarios();
    } catch (error) {
      alert('Error al eliminar el comentario');
      console.error(error);
    }
  }

}

