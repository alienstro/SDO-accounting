import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-applicant',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-applicant.component.html',
  styleUrl: './add-applicant.component.css',
})
export class AddApplicantComponent {
  staffForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.staffForm = this.fb.group({
      first_name: ['', Validators.required],
      middle_name: [''],
      last_name: ['', Validators.required],
      ext_name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      department_id: [0, Validators.required],
      designation: ['', Validators.required],
      emp_status: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.staffForm.valid) {
      console.log('Staff to add:', this.staffForm.value);
      this.staffForm.reset();
    }
  }
}