import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Prueba2Component } from '../../components/prueba2/prueba2.component'; // ajusta la ruta
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-prueba1',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,MatCardModule, MatMenuModule,
            MatIconModule, MatButtonModule,NgIf,NgFor,MatGridListModule,MatDialogModule],
  templateUrl: './prueba1.component.html',
  styleUrls: ['./prueba1.component.css']
})
export class Prueba1Component {
  constructor(private dialog: MatDialog) {}

  abrirDialogo(): void {
    const dialogRef = this.dialog.open(Prueba2Component, {
      width: '300px',
      data: { mensaje: 'Hola desde la página Prueba1!' }
    });

    dialogRef.afterClosed().subscribe(resultado => {
      console.log('Resultado del modal:', resultado);
    });
  }
}
