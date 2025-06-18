import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgIf } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDialogModule } from '@angular/material/dialog';
@Component({
  selector: 'app-prueba2',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,MatCardModule, MatMenuModule,
            MatIconModule, MatButtonModule,NgIf,NgFor,MatGridListModule,MatDialogModule],
  templateUrl: './prueba2.component.html',
  styleUrls: ['./prueba2.component.css']
})
export class Prueba2Component {
  constructor(
    public dialogRef: MatDialogRef<Prueba2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  cerrar(): void {
    this.dialogRef.close('Modal cerrado desde Prueba2');
  }
}
