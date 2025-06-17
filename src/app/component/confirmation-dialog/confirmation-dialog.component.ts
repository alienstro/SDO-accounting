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
import { take } from 'rxjs';
import { SnackbarService } from '../../service/snackbar.service';

@Component({
  selector: 'app-endorse',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  application_id!: number;
  staff_id!: number;
  department_id!: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private tokenService: TokenService,
    private requestService: RequestService,
    private snackbar: MatSnackBar,
    private router: Router,
    private applicationService: ApplicationService,
    private snackbarService: SnackbarService
  ) {
    this.application_id = this.data.application_id;
    this.staff_id = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );
    this.department_id = this.tokenService.userRoleToken(
      this.tokenService.decodeToken()
    );
  }

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

  // confirm(): void {
  //   const department_id = this.department_id;
  //   const staff_id = this.staff_id;
  //   const approved = 'Approved';

  //   const data = {
  //     department_id: department_id,
  //     approved: approved,
  //     staff_id: staff_id,
  //     application_id: this.application_id
  //   }

  //   if (department_id === "7") {
  //     console.log("Department: ASDS")
  //     this.requestService.submitApprovalASDS(data).subscribe(
  //       (response) => {
  //         this.snackbar.open('Approval updated successfully.', '', {
  //           duration: 3000
  //         });
  //         this.applicationService.updateApprovalDetails(approved, this.application_id, department_id)
  //         this.dialogRef.close();
  //         this.router.navigate(['/forward-view']);
  //       },
  //       (error) => {
  //         console.error('Error uploading signature:', error);
  //         this.snackbar.open('Failed to upload signature.');
  //       }
  //     );
  //   } else if (department_id === '8') {
  //     console.log("Department: SDS")
  //     this.requestService.submitApprovalSDS(data).subscribe(
  //       (response) => {
  //         this.snackbar.open('Approval updated successfully.', '', {
  //           duration: 3000
  //         });
  //         this.applicationService.updateApprovalDetails(approved, this.application_id, department_id)
  //         this.dialogRef.close();
  //         this.router.navigate(['/forward-view']);
  //       },
  //       (error) => {
  //         console.error('Error uploading signature:', error);
  //         this.snackbar.open('Failed to upload signature.');
  //       }
  //     );
  //   } else {
  //     console.log('Unknown Error!')
  //   }
  // }

  cancel(): void {
    this.dialogRef.close();
  }
}
