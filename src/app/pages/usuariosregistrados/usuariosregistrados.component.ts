import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-usuariosregistrados',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, MatCardModule],
  templateUrl: './usuariosregistrados.component.html',
  styleUrl: './usuariosregistrados.component.css'
})
export class UsuariosregistradosComponent {

}
