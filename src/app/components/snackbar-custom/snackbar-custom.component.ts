import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-snackbar-custom',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './snackbar-custom.component.html',
  styleUrl: './snackbar-custom.component.css',
  encapsulation: ViewEncapsulation.None
})
export class SnackbarCustomComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}

