import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { RequestService } from '../../service/request.service';
import { BorrowersInformation, CoMakersInformation, LoanApplicant, LoanDetails } from '../../interface';
import { LoanDetailsComponent } from '../loan-details/loan-details.component';
import { EmployeeDetailsComponent } from '../employee-details/employee-details.component';
import { ComakerDetailsComponent } from '../comaker-details/comaker-details.component';
import { SnackbarService } from '../../service/snackbar.service';

@Component({
  selector: 'app-view-application-detail',
  standalone: true,
  imports: [
    MatTabsModule,
    LoanDetailsComponent,
    EmployeeDetailsComponent,
    ComakerDetailsComponent
  ],
  templateUrl: './view-application-detail.component.html',
  styleUrl: './view-application-detail.component.css'
})
export class ViewApplicationDetailComponent {

  applicationId: string
  applicantDetail!: LoanApplicant
  loanDetail!: LoanDetails
  coMakerInfo!: CoMakersInformation
  borrowerInfo!: BorrowersInformation

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) {
    this.applicationId = this.route.snapshot.paramMap.get('id') || "0"

    this.requestService.get<LoanApplicant>(`/applicantDetail/${this.applicationId}`).subscribe({
      next: res => this.applicantDetail = res.message,
      error: error => console.log(error)
    })

    this.requestService.get<LoanDetails>(`/applicationDetail/${this.applicationId}`).subscribe({
      next: res => this.loanDetail = res.message,
      error: error => console.log(error)
    })

    this.requestService.get<CoMakersInformation>(`/coMakersInformationById/${this.applicationId}`).subscribe({
      next: res => this.coMakerInfo = res as any,
      error: error => console.log(error)
    })

    this.requestService.get<BorrowersInformation>(`/borrowersInformationById/${this.applicationId}`).subscribe({
      next: res => this.borrowerInfo = res as any,
      error: error => console.log(error)
    })
  }


  get parseName() {
    const firstN = this.applicantDetail.first_name
    const lastN = this.applicantDetail.last_name
    const middleN = this.applicantDetail.middle_name ? this.applicantDetail.middle_name : ''
    const extN = this.applicantDetail.ext_name ? this.applicantDetail.ext_name : ''

    return firstN + ' ' + middleN + ' ' + lastN + ' ' + extN
  }

  forwardApplication() {
    this.requestService.patch('/forward', { id: this.applicationId }).subscribe({
      next: res => {
        this.snackbarService.showSnackbar('Forwarded to secretariat')
      },
      error: error => {
        this.snackbarService.showSnackbar('Failed to forward')
      }
    })
  }
}
