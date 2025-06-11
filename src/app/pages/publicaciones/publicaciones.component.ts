import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, MatCardModule],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css'
})
export class PublicacionesComponent {

}
