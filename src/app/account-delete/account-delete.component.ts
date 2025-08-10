import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestService } from '../service/request.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-delete',
  standalone: true,
  imports: [],
  templateUrl: './account-delete.component.html',
  styleUrl: './account-delete.component.css',
})
export class AccountDeleteComponent {
  flag: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private requestService: RequestService,
    public dialogRef: MatDialogRef<AccountDeleteComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.flag = this.data.flag;

    console.log(data);
  }

  onSubmit() {
    if (this.flag === 'applicant') {
      const applicantId = Number(this.data.account.applicant_id);

      this.requestService.deleteApplicantAccount(applicantId).subscribe({
        next: (res) => {
          if (res.success) {
            this.snackBar.open('Applicant deleted successfully!', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-success',
            });
            this.dialogRef.close();
            this.router.navigate(['/accounts']);
          } else {
            this.snackBar.open('Failed to add. Please try again.', 'Close', {
              duration: 3000,
            });
          }
        },
        error: (err) => {
          this.snackBar.open('Failed to add. Please try again.', 'Close', {
            duration: 3000,
          });
        },
      });
    } else {
      const staffId = Number(this.data.account.staff_id);

      this.requestService.deleteStaffAccount(staffId).subscribe({
        next: (res) => {
          if (res.success) {
            this.snackBar.open('Staff deleted successfully!', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-success',
            });
            this.dialogRef.close();
            this.router.navigate(['/accounts']);
          } else {
            this.snackBar.open('Failed to add. Please try again.', 'Close', {
              duration: 3000,
            });
          }
        },
        error: (err) => {
          this.snackBar.open('Failed to add. Please try again.', 'Close', {
            duration: 3000,
          });
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
