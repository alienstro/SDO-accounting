import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RequestService } from '../service/request.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-applicant',
  standalone: true,
  imports: [ReactiveFormsModule, MatSnackBarModule, CommonModule],
  templateUrl: './add-applicant.component.html',
  styleUrl: './add-applicant.component.css',
})
export class AddApplicantComponent {
  applicantForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private requestService: RequestService,
    public dialogRef: MatDialogRef<AddApplicantComponent>,
    private router: Router
  ) {
    this.applicantForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      ext_name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      institution_name: ['', Validators.required],
      designation: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.applicantForm.valid) {
      console.log('Applicant to add:', this.applicantForm.value);

      this.requestService
        .addApplicantAccount(this.applicantForm.value)
        .subscribe({
          next: (res) => {
            if (res.success) {
              this.snackBar.open('Applicant added successfully!', 'Close', {
                duration: 3000,
                panelClass: 'snackbar-success',
              });
              this.applicantForm.reset();
              this.dialogRef.close();
              this.router.navigate(['/accounts']);
            } else {
              this.snackBar.open('Failed to add. Please try again.', 'Close', {
                duration: 3000,
              });
            }
          },
          error: (err) => {
            if (err.status === 409) {
              this.snackBar.open(
                'Email already exists. Please use a different email.',
                'Close',
                {
                  duration: 3000,
                  panelClass: 'snackbar-error',
                }
              );
            } else {
              this.snackBar.open('Failed to add. Please try again.', 'Close', {
                duration: 3000,
              });
            }
          },
        });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
