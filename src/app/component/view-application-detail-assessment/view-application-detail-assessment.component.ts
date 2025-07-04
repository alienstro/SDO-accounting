import { Component } from '@angular/core';
import {
  Applicant,
  Assessment,
  BorrowersInformation,
  CoMakersInformation,
  LoanDetails,
} from '../../interface';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationService } from '../../service/application.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DOC_URL } from '../../env';
import { EndorseComponent } from '../../endorse/endorse.component';
import { MatTab, MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AssessFormComponent } from '../../assess-form/assess-form.component';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-view-application-detail-application',
  standalone: true,
  imports: [MatTabsModule, CommonModule, MatTabsModule],
  templateUrl: './view-application-detail-assessment.component.html',
  styleUrl: './view-application-detail-assessment.component.css',
})
export class ViewApplicationDetailComponentAssessment {
  application_id!: any;
  applicant_id!: any;
  roleId: number = 0;

  currentUrl = '';

  loanDetails?: any;
  borrowersInformation: BorrowersInformation[] = [{} as BorrowersInformation];
  coMakersInformation: CoMakersInformation[] = [{} as CoMakersInformation];
  assessmentDetails: Assessment[] = [{} as Assessment];
  applicantDetails: Applicant[] = [{} as Applicant];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private applicationService: ApplicationService,
    private domSanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {
    const id = this.tokenService.userRoleToken(
      this.tokenService.decodeToken()
    );
    this.roleId = Number(id)
    
  }

  goBack(): void {
    this.router.navigate(['/forward']);
  }

  openEndorse(): void {
    this.dialog.open(EndorseComponent, {
      width: '50rem',
      maxWidth: '50rem',
      height: '21.5rem',
      data: { application_id: this.application_id },
    });
  }

  transform(url: string) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(url);
  }

  url: {
    authorityToDeduct: SafeResourceUrl;
    csc: SafeResourceUrl;
    emergency: SafeResourceUrl;
    idApplicant: SafeResourceUrl;
    idComaker: SafeResourceUrl;
    payslipApplicant: SafeResourceUrl;
    payslipComaker: SafeResourceUrl;
  } = {
    authorityToDeduct: '',
    csc: '',
    emergency: '',
    idApplicant: '',
    idComaker: '',
    payslipApplicant: '',
    payslipComaker: '',
  };

  openAssessmentForm(): void {
    this.dialog.open(AssessFormComponent, {
      width: '90rem',
      maxWidth: '90rem',
      height: '55rem',
      data: { loan: this.loanDetails[0] },
    });
  }

  ngOnInit(): void {
    this.currentUrl = this.router.url;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });

    this.application_id = this.route.snapshot.paramMap.get('id');

    this.applicationService
      .getLoanDetailsById(this.application_id)
      .subscribe((loanDetails) => {
        // this.loanDetails = Array.isArray(loanDetails) ? loanDetails : [loanDetails];
        this.loanDetails = Array.isArray(loanDetails)
          ? loanDetails
          : [loanDetails];
        // this.loanDetails = this.loanDetails[0];
        console.log('loan details: ', this.loanDetails);
        this.applicant_id = this.loanDetails[0].applicant_id;
        console.log(this.applicant_id);

        const baseUrl = `${DOC_URL}/${this.applicant_id}/documents/${this.application_id}`;

        this.url = {
          authorityToDeduct: this.transform(`${baseUrl}/authorityToDeduct.pdf`),
          csc: this.transform(`${baseUrl}/csc.pdf`),
          emergency: this.transform(`${baseUrl}/emergency.pdf`),
          idApplicant: this.transform(`${baseUrl}/idApplicant.pdf`),
          idComaker: this.transform(`${baseUrl}/idComaker.pdf`),
          payslipApplicant: this.transform(`${baseUrl}/payslipApplicant.pdf`),
          payslipComaker: this.transform(`${baseUrl}/payslipComaker.pdf`),
        };

        console.log('view application: ', this.application_id);

        this.applicationService
          .getBorrowersInformationById(this.application_id)
          .subscribe((borrowers) => {
            this.borrowersInformation = Array.isArray(borrowers)
              ? borrowers
              : [borrowers];
          });

        this.applicationService
          .getCoMakersInformationById(this.application_id)
          .subscribe((comakers) => {
            this.coMakersInformation = Array.isArray(comakers)
              ? comakers
              : [comakers];
          });

        console.log(this.assessmentDetails[0]);
      });
  }
}
