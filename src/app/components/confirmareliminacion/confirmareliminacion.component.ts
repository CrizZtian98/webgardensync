import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmareliminacion',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirmareliminacion.component.html',
  styleUrl: './confirmareliminacion.component.css'
})
export class ConfirmareliminacionComponent {

    constructor(
    public dialogRef: MatDialogRef<ConfirmareliminacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string; textoBoton: string; colorBoton: string }
  ) {}

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}

