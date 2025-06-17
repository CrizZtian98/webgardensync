import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { HeaderComponent } from '../../components/header/header.component';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-registrohogar',
  standalone: true,
  imports: [RouterLink, HeaderComponent,FooterComponent,ReactiveFormsModule,MatCardModule],
  templateUrl: './registrohogar.component.html',
  styleUrl: './registrohogar.component.css'
})
export class RegistrohogarComponent {

}
