import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmarcierre',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirmarcierre.component.html',
  styleUrls: ['./confirmarcierre.component.css']
})
export class ConfirmarcierreComponent {
  mensaje: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmarcierreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mensaje = data.mensaje || '¿Está seguro?';
  }

  confirmar() {
    this.dialogRef.close(true);
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}

