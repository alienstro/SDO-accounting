import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../service/request.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-edit',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.css',
})
export class AccountEditComponent {
  staffForm: FormGroup;
  flag: string = '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private requestService: RequestService,
    public dialogRef: MatDialogRef<AccountEditComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.flag = data.flag;

    if (this.flag === 'applicant') {
      this.staffForm = this.fb.group({
        first_name: [data.account.first_name, Validators.required],
        middle_name: [data.account.middle_name],
        last_name: [data.account.last_name, Validators.required],
        ext_name: [data.account.ext_name],
        email: [data.account.email, [Validators.required, Validators.email]],
        password: [''],
        institution_name: [data.account.institution_name, Validators.required],
        designation: [data.account.designation, Validators.required],
      });

      console.log('applicant edit: ', data);
    } else {
      this.staffForm = this.fb.group({
        first_name: [data.account.first_name, Validators.required],
        middle_name: [data.account.middle_name],
        last_name: [data.account.last_name, Validators.required],
        ext_name: [data.account.ext_name],
        email: [data.account.email, [Validators.required, Validators.email]],
        password: [''],
        department_id: [data.account.department_id, Validators.required],
        designation: [data.account.designation, Validators.required],
      });

      console.log('staff edit: ', data);
    }
  }

  onSubmit() {
    console.log('Account to edit:', this.staffForm.value);

    if (this.flag === 'applicant') {
      const data = {
        account: this.staffForm.value,
        applicant_id: this.data.account.applicant_id,
      };

      this.requestService.editApplicantAccount(data).subscribe({
        next: (res) => {
          if (res.success) {
            this.snackBar.open('Applicant edited successfully!', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-success',
            });
            this.staffForm.reset();
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
      const data = {
        account: this.staffForm.value,
        staff_Id: this.data.account.staff_id,
      };

      this.requestService.editStaffAccount(data).subscribe({
        next: (res) => {
          if (res.success) {
            this.snackBar.open('Staff edited successfully!', 'Close', {
              duration: 3000,
              panelClass: 'snackbar-success',
            });
            this.staffForm.reset();
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
