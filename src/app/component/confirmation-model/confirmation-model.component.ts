import { Component, inject, model } from '@angular/core';
import { RequestService } from '../../service/request.service';
import { SnackbarService } from '../../service/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-model',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-model.component.html',
  styleUrl: './confirmation-model.component.css'
})
export class ConfirmationModelComponent {

  readonly dialogRef = inject(MatDialogRef<ConfirmationModelComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) { }

  forwardApplication() {
    this.requestService.patch('/paid', { id: this.data.application_id }).subscribe({
      next: res => {
        this.snackbarService.showSnackbar('Payment confirmed')
        this.dialogRef.close()
      },
      error: error => {
        this.snackbarService.showSnackbar('Failed to forward')
        this.dialogRef.close()
      }
    })
  }

  close() {
    this.dialogRef.close()
  }
}
