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
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarCustomComponent } from '../../components/snackbar-custom/snackbar-custom.component';


@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [ HeaderComponent, FooterComponent, MatCardModule, MatMenuModule,
            MatIconModule, MatButtonModule,NgIf,NgFor,MatGridListModule,MatProgressSpinnerModule,FormsModule,
                MatSnackBarModule,SnackbarCustomComponent
          ],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css'
})
export class PublicacionesComponent{
  publicaciones: any[] = [];
  cargando = false;
  textoPublicacion = '';
  esAnonimo = false;
  terminoBusqueda = '';

  constructor(
    private firebaseService: FirebaseService, private auth: AuthService, private router: Router,private snackBar: MatSnackBar
  ) {}


  async ngOnInit() {
    this.cargando = true;  // Por si acaso aseguramos que arranque en true
    await this.cargarPublicaciones();  // Esperamos que cargue antes de seguir
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

  async crearPublicacion() {
    if (!this.textoPublicacion.trim()) return;

    await this.firebaseService.crearPublicacion(this.textoPublicacion);
    this.textoPublicacion = '';
    await this.cargarPublicaciones();
  }

  async cargarPublicaciones() {
    this.cargando = true;   // Arrancamos carga
    try {
      this.publicaciones = await this.firebaseService.obtenerPublicaciones();
    } catch (error) {
      console.error('Error cargando publicaciones:', error);
    } finally {
      this.cargando = false;  // Terminamos carga siempre
    }
  }

  async like(id: string) {
    await this.firebaseService.darLike(id);
    await this.cargarPublicaciones();
  }

  async dislike(id: string) {
    await this.firebaseService.darDislike(id);
    await this.cargarPublicaciones();
  }

  comentar(){
    this.router.navigate(['modalpublicacion'])
  }

  abrirPost(publicacion: any) {
    this.router.navigate(['/comentarios'], {
      state: { publicacion }
    });
  }

  async banear(uid: string) {
    try {
      await this.firebaseService.banearUsuario(uid);
      alert('Usuario baneado exitosamente');
    } catch (error) {
      console.error('Error al banear:', error);
      alert('Error al banear usuario');
    }
  }

  async eliminarPublicacion(id: string) {
  const confirmacion = confirm('¿Estás seguro de eliminar esta publicación?');

    if (confirmacion) {
      try {
        await this.firebaseService.eliminarPublicacion(id);
        console.log('Publicación eliminada');
        this.mostrarSnack('Publicación eliminada correctamente', 'exito');
        await this.cargarPublicaciones();
      } catch (error) {
        console.error('Error al eliminar la publicación:', error);
      }
    }
  }


  get publicacionesFiltradas() {
    if (!this.terminoBusqueda.trim()) {
      return this.publicaciones;
    }
    const termino = this.terminoBusqueda.toLowerCase();
    return this.publicaciones.filter(publi =>
      publi.nombre.toLowerCase().includes(termino)
    );
  }

  mostrarSnack(mensaje: string, tipo: 'exito' | 'error') {
    this.snackBar.openFromComponent(SnackbarCustomComponent, {
      data: { mensaje, tipo },
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['custom-snackbar']
    });
  }



}
