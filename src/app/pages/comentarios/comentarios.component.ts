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
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmareliminacionComponent } from '../../components/confirmareliminacion/confirmareliminacion.component';


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
    MatProgressSpinnerModule,
    MatSnackBarModule,
    SnackbarCustomComponent, 
    FormsModule,
    ConfirmareliminacionComponent
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
  comentarioEnviando = false;


  constructor(
    private firebaseService: FirebaseService,
    private router: Router, private snackBar: MatSnackBar,private dialog: MatDialog
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
    
    this.comentarioEnviando = true;
    
    try {
      await this.firebaseService.comentar(this.publicacion.id, this.nuevoComentario);
      this.nuevoComentario = '';
      await this.cargarComentarios();
    } catch (error) {
      console.error('Error al enviar comentario:', error);
    } finally {
      this.comentarioEnviando = false;
      this.mostrarSnack('Comentario subido ', 'exito');
    }
  }

  /*async like() {
    await this.firebaseService.darLike(this.publicacion.id);
  }

  async dislike() {
    await this.firebaseService.darDislike(this.publicacion.id);
  }*/

  cerrar(){
    this.router.navigate(['publicaciones'])
  }

  //Implementado recientemente
async eliminarPublicacion() {
  const dialogRef = this.dialog.open(ConfirmareliminacionComponent, {
    width: '300px',
    data: { 
      mensaje: '¿Seguro que quieres eliminar esta publicación?', 
      textoBoton: 'Eliminar',
      colorBoton: 'warn'  
    }
  });


  const confirmado = await dialogRef.afterClosed().toPromise();

  if (confirmado) {
    try {
      await this.firebaseService.eliminarPublicacion(this.publicacion.id);
      this.mostrarSnack('Publicación eliminada correctamente', 'exito');
      this.router.navigate(['/publicaciones']);
    } catch (error) {
      this.mostrarSnack('Error al eliminar la publicación', 'error');
      console.error(error);
    }
  }
}

async eliminarComentario(idComentario: string) {
  const dialogRef = this.dialog.open(ConfirmareliminacionComponent, {
    width: '300px',
    data: { 
      mensaje: '¿Seguro que quieres eliminar este comentario?', 
      textoBoton: 'Eliminar',
      colorBoton: 'warn'  
    }
  });


  const confirmado = await dialogRef.afterClosed().toPromise();

  if (confirmado) {
    try {
      await this.firebaseService.eliminarComentario(this.publicacion.id, idComentario);
      this.mostrarSnack('Comentario eliminado correctamente', 'exito');
      await this.cargarComentarios();
    } catch (error) {
      this.mostrarSnack('Error al eliminar comentario', 'error');
      console.error(error);
    }
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

