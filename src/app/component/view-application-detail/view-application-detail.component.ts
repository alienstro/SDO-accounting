import { Component, ElementRef, ViewChild } from '@angular/core';
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
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { HttpClient } from '@angular/common/http';
import { RejectDialogComponent } from '../reject-dialog/reject-dialog.component';

@Component({
  selector: 'app-view-application-detail',
  standalone: true,
  imports: [MatTabsModule, CommonModule, MatTabsModule],
  templateUrl: './view-application-detail.component.html',
  styleUrl: './view-application-detail.component.css',
})
export class ViewApplicationDetailComponent {
  @ViewChild('pdfPreview', { static: false })
  pdfPreview!: ElementRef<HTMLIFrameElement>;

  private formPdfBytes: ArrayBuffer | null = null;

  application_id!: any;
  applicant_id!: any;

  currentUrl = '';

  roleId: number = 0;

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
    private tokenService: TokenService,
    private http: HttpClient
  ) {
    this.roleId = Number(
      this.tokenService.userRoleToken(this.tokenService.decodeToken())
    );

    this.http
      .get('/Provident-Loan-Form_New-Template-2025-1.pdf', {
        responseType: 'arraybuffer',
      })
      .subscribe((bytes) => (this.formPdfBytes = bytes));
  }

  async generateAndPreviewPdf() {
    if (!this.formPdfBytes) {
      console.error('PDF template not loaded yet.');
      return;
    }

    const data = {
      date_submitted: '25/06/2025',
      loan_amount: '15000',
      term: '5',
      loan_application_number: '202500001',
      multi_purpose: true,
      multi_purpose_new: true,
      multi_purpose_renewal: true,
      additional: true,
      purpose_educational: true,
      purpose_hospitalization: true,
      purpose_long_medication: true,
      purpose_house_arrears: true,
      purpose_house_repair_major: true,
      purpose_house_repair_minor: true,
      purpose_payment: true,
      purpose_calamity: true,
      purpose_others: true,
      purpose_others_text: 'Car Payments',

      borrower_surname: 'Dela Cruz',
      borrower_first_name: 'Juan',
      borrower_mi: 'P',
      borrower_address: '123 Rizal St., Olongapo City',
      borrower_position: 'Teacher I',
      borrower_employee_no: '202210599',
      borrower_employment_status: 'Employed',
      borrower_office: 'Deped Olongapo',
      borrower_date_of_birth: 'Sept 1, 2003',
      borrower_age: '26',
      borrower_monthly_salary: '50000',
      borrower_office_tel_no: '213-2323',
      borrower_years_in_service: '10 years',
      borrower_mobile_no: '09563453334',
      borrower_specimen_signature_1: 'signature',
      borrower_specimen_signature_2: 'signature1',

      co_makers_surname: 'Dela Cruz',
      co_makers_first_name: 'Juan',
      co_makers_mi: 'P',
      co_makers_address: '123 Rizal St., Olongapo City',
      co_makers_position: 'Teacher I',
      co_makers_employee_no: '202210599',
      co_makers_employment_status: 'Employed',
      co_makers_office: 'Deped Olongapo',
      co_makers_date_of_birth: 'Sept 1, 2003',
      co_makers_age: '26',
      co_makers_monthly_salary: '50000',
      co_makers_office_tel_no: '213-2323',
      co_makers_years_in_service: '10 years',
      co_makers_mobile_no: '09563453334',
      co_makers_specimen_signature_1: 'signature',
      co_makers_specimen_signature_2: 'signature1',

      pesos_word: 'Fifteen Thousand',
      pesos_number: '15000',
      borrower_signature: 'borrower_signature',
      borrower_date: '25/06/2025',
      co_makers_signature: 'co_makers_signature',
      co_makers_date: '25/06/2025',

      personnel_signature: 'signature',
      personnel_designation: 'Teacher',
      personnel_date: '25/06/2025',
      permanent: true,
      net_pay: '18,500',
      year_of: 'June 2025',

      legal_signature: 'signature',
      legal_designation: 'Teacher',
      legal_date: '25/06/2025',
    };

    const fields = [
      { name: 'date_submitted', x: 145, y: 193, fontSize: 8 },
      { name: 'loan_amount', x: 165, y: 214, fontSize: 8 },
      { name: 'term', x: 272, y: 238, fontSize: 8 },
      { name: 'loan_application_number', x: 590, y: 194, fontSize: 8 },
      { name: 'multi_purpose', x: 85.3, y: 248.5, fontSize: 8, checkbox: true },
      {
        name: 'multi_purpose_new',
        x: 97.5,
        y: 261,
        fontSize: 8,
        checkbox: true,
      },
      {
        name: 'multi_purpose_renewal',
        x: 97.5,
        y: 273.5,
        fontSize: 8,
        checkbox: true,
      },
      { name: 'additional', x: 86.8, y: 285.7, fontSize: 8, checkbox: true },
      {
        name: 'purpose_educational',
        x: 501,
        y: 222.8,
        fontSize: 8,
        checkbox: true,
      },
      {
        name: 'purpose_hospitalization',
        x: 501,
        y: 232.8,
        fontSize: 8,
        checkbox: true,
      },
      {
        name: 'purpose_long_medication',
        x: 501,
        y: 243,
        fontSize: 8,
        checkbox: true,
      },
      {
        name: 'purpose_house_arrears',
        x: 501,
        y: 253.5,
        fontSize: 8,
        checkbox: true,
      },
      {
        name: 'purpose_house_repair_major',
        x: 501,
        y: 264,
        fontSize: 8,
        checkbox: true,
      },
      {
        name: 'purpose_house_repair_minor',
        x: 500.8,
        y: 274.5,
        fontSize: 8,
        checkbox: true,
      },
      {
        name: 'purpose_payment',
        x: 500.7,
        y: 285.5,
        fontSize: 8,
        checkbox: true,
      },
      {
        name: 'purpose_calamity',
        x: 500.5,
        y: 296.5,
        fontSize: 8,
        checkbox: true,
      },
      { name: 'purpose_others', x: 501, y: 307.5, fontSize: 8, checkbox: true },
      { name: 'purpose_others_text', x: 582, y: 307.5, fontSize: 8 },

      { name: 'borrower_surname', x: 78, y: 348, fontSize: 8 },
      { name: 'borrower_first_name', x: 230, y: 346, fontSize: 8 },
      { name: 'borrower_mi', x: 370, y: 348, fontSize: 8 },
      { name: 'borrower_address', x: 130, y: 378, fontSize: 8 },
      { name: 'borrower_position', x: 110, y: 405, fontSize: 8 },
      { name: 'borrower_employee_no', x: 120, y: 425, fontSize: 8 },
      { name: 'borrower_employment_status', x: 310, y: 425, fontSize: 8 },
      { name: 'borrower_office', x: 100, y: 443, fontSize: 8 },
      { name: 'borrower_date_of_birth', x: 120, y: 463, fontSize: 8 },
      { name: 'borrower_age', x: 310, y: 464, fontSize: 8 },
      { name: 'borrower_monthly_salary', x: 145, y: 483, fontSize: 8 },
      { name: 'borrower_office_tel_no', x: 285, y: 474, fontSize: 8 },
      { name: 'borrower_years_in_service', x: 130, y: 502, fontSize: 8 },
      { name: 'borrower_mobile_no', x: 280, y: 493, fontSize: 8 },
      { name: 'borrower_specimen_signature_1', x: 100, y: 530, fontSize: 8 },
      { name: 'borrower_specimen_signature_2', x: 300, y: 530, fontSize: 8 },

      { name: 'co_makers_surname', x: 420, y: 348, fontSize: 8 },
      { name: 'co_makers_first_name', x: 570, y: 346, fontSize: 8 },
      { name: 'co_makers_mi', x: 707, y: 348, fontSize: 8 },
      { name: 'co_makers_address', x: 480, y: 374, fontSize: 8 },
      { name: 'co_makers_position', x: 460, y: 405, fontSize: 8 },
      { name: 'co_makers_employee_no', x: 470, y: 425, fontSize: 8 },
      { name: 'co_makers_employment_status', x: 660, y: 425, fontSize: 8 },
      { name: 'co_makers_office', x: 450, y: 443, fontSize: 8 },
      { name: 'co_makers_date_of_birth', x: 470, y: 463, fontSize: 8 },
      { name: 'co_makers_age', x: 660, y: 463, fontSize: 8 },
      { name: 'co_makers_monthly_salary', x: 495, y: 483, fontSize: 8 },
      { name: 'co_makers_office_tel_no', x: 635, y: 473, fontSize: 8 },
      { name: 'co_makers_years_in_service', x: 480, y: 502, fontSize: 8 },
      { name: 'co_makers_mobile_no', x: 630, y: 493, fontSize: 8 },
      { name: 'co_makers_specimen_signature_1', x: 460, y: 530, fontSize: 8 },
      { name: 'co_makers_specimen_signature_2', x: 660, y: 530, fontSize: 8 },

      { name: 'pesos_word', x: 65, y: 584, fontSize: 8 },
      { name: 'pesos_number', x: 280, y: 584, fontSize: 8 },
      { name: 'borrower_signature', x: 100, y: 726, fontSize: 8 },
      { name: 'borrower_date', x: 320, y: 726, fontSize: 8 },
      { name: 'co_makers_signature', x: 450, y: 726, fontSize: 8 },
      { name: 'co_makers_date', x: 670, y: 726, fontSize: 8 },

      { name: 'permanent', x: 100, y: 838, fontSize: 8, checkbox: true },
      { name: 'net_pay', x: 150, y: 862.5, fontSize: 8 },
      { name: 'year_of', x: 65, y: 874, fontSize: 8 },
      { name: 'personnel_signature', x: 210, y: 920, fontSize: 8 },
      { name: 'personnel_designation', x: 205, y: 945, fontSize: 8 },
      { name: 'personnel_date', x: 180, y: 957, fontSize: 8 },
      { name: 'legal_signature', x: 560, y: 920, fontSize: 8 },
      { name: 'legal_designation', x: 555, y: 945, fontSize: 8 },
      { name: 'legal_date', x: 530, y: 957, fontSize: 8 },
    ];

    const pdfDoc = await PDFDocument.load(this.formPdfBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const scaleX = width / 800;
    const scaleY = height / 1100;

    fields.forEach((f) => {
      let val = (data as any)[f.name];
      if (f.checkbox) {
        if (!val) return;
        val = 'X';
      } else {
        if (!val) return;
      }

      const xPt = f.x * scaleX;
      const yPt = height - f.y * scaleY - f.fontSize * scaleY;

      page.drawText(val.toString(), {
        x: xPt,
        y: yPt,
        size: f.fontSize * scaleY,
        font,
      });
    });

    const pdfBytes = await pdfDoc.save();
    const buffer = pdfBytes.buffer as ArrayBuffer;
    const blob = new Blob([buffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // set iframe source
    this.pdfPreview.nativeElement.src = url;
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

  openReject(): void {
    this.dialog.open(RejectDialogComponent, {
      width: '50rem',
      maxWidth: '50rem',
      height: '16rem',
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
        console.log('department number', this.roleId);

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
