import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  ocultarBotones: boolean = false;
  mostrarBotonesAdmin: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    // Detectar cambios en la ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.ocultarBotones = event.url.includes('/nueva-clave');
      }
    });
  }

  ngOnInit() {
    this.verificarSiEsAdmin();
  }

  async verificarSiEsAdmin() {
    const user = await this.authService.obtenerUsuarioActual();
    if (user && user.email === 'gardensync01@gmail.com') {
      this.mostrarBotonesAdmin = true;
    } else {
      this.mostrarBotonesAdmin = false;
    }
  }

  perfil() {
    this.router.navigate(['/perfil']);
  }

  usuarios() {
    this.router.navigate(['/usuariosregistrados']);
  }

  publicaciones() {
    this.router.navigate(['/publicaciones']);
  }
}


