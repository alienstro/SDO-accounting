import { Component, inject, model } from '@angular/core';
import { RequestService } from '../../service/request.service';
import { SnackbarService } from '../../service/snackbar.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../service/application.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-confirmation-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-model.component.html',
  styleUrl: './confirmation-model.component.css',
})
export class ConfirmationModelComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmationModelComponent>);
  readonly data = inject(MAT_DIALOG_DATA);

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService,
    private applicationService: ApplicationService,
    public router: Router
  ) {}

  payApplication() {
    this.requestService
      .patch('/paid', { application_id: this.data.application_id })
      .subscribe({
        next: (res) => {
          this.snackbarService.showSnackbar('Payment confirmed');

          this.applicationService
            .getPaidApplication()
            .pipe(take(1))
            .subscribe((paidApps) => {
              this.applicationService.setPaidApplications(paidApps); 
              this.applicationService.updatePayment(this.data.application_id);
              this.dialogRef.close();
            });
        },
        error: (error) => {
          this.snackbarService.showSnackbar('Failed to forward');
          this.dialogRef.close();
        },
      });
  }

  forwardApplication() {
    this.requestService
      .patch('/forward', { id: this.data.application_id })
      .subscribe({
        next: (res) => {
          this.snackbarService.showSnackbar('Forwarded to secretariat');
          this.applicationService.updateStatus(
            this.data.application_id,
            'Paid',
            'Secretariat'
          );
          this.dialogRef.close();
          this.router.navigate(['/forward']);
        },
        error: (error) => {
          this.snackbarService.showSnackbar('Failed to forward');
          this.dialogRef.close();
        },
      });
  }

  close() {
    this.dialogRef.close();
  }
}
