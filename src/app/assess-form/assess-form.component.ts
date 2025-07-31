import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RequestService } from '../service/request.service';
import { SnackbarService } from '../service/snackbar.service';
import { Assessment } from '../interface';
import { TokenService } from '../service/token.service';
import { ApplicationService } from '../service/application.service';
import { Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-assess-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './assess-form.component.html',
  styleUrl: './assess-form.component.css',
})
export class AssessFormComponent {
  isLinear = true;
  // reviewedBy: string = '';
  application_id: number = 0;
  roleId: string = '';

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  thirdFormGroup!: FormGroup;
  fourthFormGroup!: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<AssessFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: FormBuilder,
    private requestService: RequestService,
    private snackbarService: SnackbarService,
    private tokenService: TokenService,
    private applicationService: ApplicationService,
    private router: Router
  ) {
    // this.reviewedBy =
    //   this.tokenService.firstNameToken(this.tokenService.decodeToken()) +
    //   ' ' +
    //   this.tokenService.lastNameToken(this.tokenService.decodeToken());


    this.application_id = data.loan.application_id;
    this.roleId = this.tokenService.userRoleToken(
      this.tokenService.decodeToken()
    );

    console.log(data)
  }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      loanApplicationForm: ['', Validators.required],
      authorizationToDeduct: ['', Validators.required],
      latestPaySlip: ['', Validators.required],
      photocopyDepEdId: ['', Validators.required],
      approvedAppointment: ['', Validators.required],
      proofCoTerminus: [''],
      othersSpecify: [''],
      letterOfRequest: ['', Validators.required],
      hospitalization: ['', Validators.required],
      medicalAbstract: ['', Validators.required],
      barangayCertificate: ['', Validators.required],
      reviewedBy: ['', Validators.required],
      reviewDate: [
        new Date().toISOString().substring(0, 16),
        Validators.required,
      ],
    });

    this.secondFormGroup = this._formBuilder.group({
      signedFilledLaf: ['', Validators.required],
      completeSupportingDocs: ['', Validators.required],
      authorizedSignatureLaf: ['', Validators.required],
      reviewedBy: ['', Validators.required],
      reviewDate: [
        new Date().toISOString().substring(0, 16),
        Validators.required,
      ],
    });

    this.thirdFormGroup = this._formBuilder.group({
      borrowerReachesRetirement: ['', Validators.required],
      borrowersAge: [0, Validators.required],
      comakersReachesRetirement: ['', Validators.required],
      comakersAge: [0, Validators.required],
      currentLoanBalance: [0, Validators.required],
      pastDueLoan: [0],
      numberOfYearsPastDue: [0],
      numberOfMonthsPastDue: [0],
      borrowersOutstandingPfLoan: ['', Validators.required],
      borrowersTakeHomePay: ['', Validators.required],
      paid30Percent: [''],
      percentageOfPrincipalPaid: [0],
      reviewedBy: ['', Validators.required],
      reviewDate: [
        new Date().toISOString().substring(0, 16),
        Validators.required,
      ],
    });

    this.fourthFormGroup = this._formBuilder.group({
      principalLoanAmount: [this.data.loan.loan_amount, Validators.required],
      principal: [0, Validators.required],
      interest: [0, Validators.required],
      netProceeds: [0, Validators.required],
      netTakeHomePayAfterAmortization: [0, Validators.required],
      monthlyAmortization: [this.computeMonthlyAmortization(this.data.loan.loan_amount, this.data.loan.term), Validators.required],
      periodOfLoan: [0, Validators.required],
      dateProcessed: [
        new Date().toISOString().substring(0, 16),
        Validators.required,
      ],
      processedBy: ['', Validators.required],
      reviewedBy: ['', Validators.required],
      remarks: [''],
    });
  }

  computeMonthlyAmortization(loan_amount: number, term: number) {
    const months = term * 12;

    const interest = loan_amount * term * 0.06;

    const total = interest + loan_amount;

    const monthlyAmortization = Number((total / months).toFixed(2));

    return monthlyAmortization;
  }

  computeNetTakeHomePay() {
    // const monthlyAmor = this.computeMonthlyAmortization()
  }

  closeDialog(): void {
    this.dialogRef.close();
    const loanApplications = this.applicationService.getApplicationState();
    console.log(loanApplications);
    
    const application = loanApplications.find((app) => Number(app.application_id) === this.application_id);

    console.log("current application: ", application);
  }

  confirmDialog(): void {
    const assessment: Assessment = {
      ...this.firstFormGroup.value,
      ...this.secondFormGroup.value,
      ...this.thirdFormGroup.value,
      ...this.fourthFormGroup.value,
      assessment_id: this.data?.assessment_id,
      application_id: this.application_id,
      department_id: this.roleId,
    };

    this.dialogRef.close(assessment);

    console.log(assessment);

    this.requestService.assessLoanApplication(assessment).subscribe({
      next: (res) => {
        console.log(res);

        if (res.success) {
          this.snackbarService.showSnackbar(
            'Assessed Loan Application Successfully!'
          );
          this.applicationService.updateAssessStatus(
            'Approved',
            this.application_id
          );
          this.dialogRef.close(assessment);
        } else {
          this.snackbarService.showSnackbar(
            'Failed to assess loan application. Please try again.'
          );
        }
      },
      error: (err) => {
        console.error(err);
        this.snackbarService.showSnackbar(
          'An error occurred while assessing the application.'
        );
      },
    });
  }
}
