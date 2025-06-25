import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router){

  }

  perfil(){
    this.router.navigate(['perfil'])
  }

  usuarios(){
    this.router.navigate(['usuariosregistrados'])
  }

  publicaciones(){
    this.router.navigate(['publicaciones'])
  }

}

