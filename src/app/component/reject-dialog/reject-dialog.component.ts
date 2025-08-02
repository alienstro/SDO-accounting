import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TokenService } from '../../service/token.service';
import { RequestService } from '../../service/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApplicationService } from '../../service/application.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reject-dialog',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './reject-dialog.component.html',
  styleUrl: './reject-dialog.component.css',
})
export class RejectDialogComponent {
  application_id!: number;
  staff_id!: number;
  department_id!: string;
  remarks_message!: string;

  constructor(
    public dialogRef: MatDialogRef<RejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private requestService: RequestService,
    private snackbar: MatSnackBar,
    private router: Router,
    private applicationService: ApplicationService
  ) {
    this.application_id = this.data.application_id;
    this.staff_id = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );
    this.department_id = this.tokenService.userRoleToken(
      this.tokenService.decodeToken()
    );

    console.log('department id: ', this.department_id);
  }

  rejectAccounting() {
    const department_id = this.department_id;
    const staff_id = this.staff_id;
    const departmentId = parseInt(department_id);
    const remarks = this.remarks_message;

    const data = {
      application_id: this.application_id,
      department_id: department_id,
      staff_id: staff_id,
      remarks: remarks,
    };

    if (departmentId === 5) {
      console.log('Accounting');
      this.requestService.rejectApprovalAccounting(data).subscribe({
        next: (res) => {
          console.log(res);

          if (res.success) {
            this.snackbar.open('Rejected Application Successfully!', '', {
              duration: 3000,
            });
            this.dialogRef.close();
            this.router.navigate(['/forward']);
          } else {
            this.snackbar.open('Failed to reject. Please try again.', '', {
              duration: 3000,
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.snackbar.open(
            'An error occurred while rejecting the application.',
            '',
            {
              duration: 3000,
            }
          );
        },
      });
    } else {
      this.snackbar.open('Error Department Role', 'Close', {
        duration: 3000,
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();

    const loanApplications = this.applicationService.getApplicationState();

    const application = loanApplications.find(
      (app) => Number(app.application_id) === Number(this.application_id)
    );

    console.log('current application: ', application);
  }
}
