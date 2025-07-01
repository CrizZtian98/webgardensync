import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs/operators';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,NgIf,NgFor],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  ocultarBotones: boolean = false;

  constructor(private router: Router) {
    // Detectar cambios en la ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Si la ruta incluye "nueva-clave", oculta los botones
        this.ocultarBotones = event.url.includes('/nueva-clave');
      }
    });
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

