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
  noData: string = 'No Data Yet';

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

  numberToWords(num: number): string {
    const a = [
      '',
      'one',
      'two',
      'three',
      'four',
      'five',
      'six',
      'seven',
      'eight',
      'nine',
      'ten',
      'eleven',
      'twelve',
      'thirteen',
      'fourteen',
      'fifteen',
      'sixteen',
      'seventeen',
      'eighteen',
      'nineteen',
    ];
    const b = [
      '',
      '',
      'twenty',
      'thirty',
      'forty',
      'fifty',
      'sixty',
      'seventy',
      'eighty',
      'ninety',
    ];

    const g = ['', 'thousand', 'million', 'billion', 'trillion'];

    const makeGroup = ([ones, tens, huns]: number[]): string => {
      return [
        huns === 0 ? '' : a[huns] + ' hundred ',
        tens === 0
          ? ''
          : tens === 1
          ? a[10 + ones]
          : b[tens] + (ones === 0 ? '' : '-' + a[ones]),
        tens === 1 ? '' : ones === 0 ? '' : tens === 0 ? a[ones] : '',
      ].join('');
    };

    const chunk = (n: number): number[][] => {
      const result = [];
      while (n > 0) {
        result.push([n % 10, ((n % 100) / 10) | 0, ((n % 1000) / 100) | 0]);
        n = Math.floor(n / 1000);
      }
      return result;
    };

    if (num === 0) return 'zero';

    return chunk(num)
      .map(makeGroup)
      .map((str, i) => (str ? str + ' ' + g[i] : ''))
      .filter(Boolean)
      .reverse()
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  formatDateToLong(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  async convertBase64ToImage(pdfDoc: PDFDocument, base64: string) {
    if (!base64) return null;

    try {
      const imageData = base64.split(',')[1];
      const byteArray = Uint8Array.from(atob(imageData), (c) =>
        c.charCodeAt(0)
      );

      if (base64.includes('jpeg') || base64.includes('jpg')) {
        return await pdfDoc.embedJpg(byteArray);
      } else {
        return await pdfDoc.embedPng(byteArray);
      }
    } catch (error) {
      console.error('Error converting base64 to image:', error);
      return null;
    }
  }

  async generateAndPreviewPdf() {
    if (!this.formPdfBytes) {
      console.error('PDF template not loaded yet.');
      return;
    }

    const pdfDoc = await PDFDocument.load(this.formPdfBytes);
    const page = pdfDoc.getPages()[0];
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Embed images first - make sure to await and handle null values
    const borrowerSignature = this.borrowersInformation[0]?.signature;
    const coMakerSignature = this.coMakersInformation[0]?.co_signature;

    const borrowerSignatureImage = borrowerSignature
      ? await this.convertBase64ToImage(pdfDoc, borrowerSignature)
      : null;
    const coMakerSignatureImage = coMakerSignature
      ? await this.convertBase64ToImage(pdfDoc, coMakerSignature)
      : null;

    const data = {
      date_submitted: this.formatDateToLong(this.loanDetails[0].date_submitted),
      loan_amount: this.loanDetails[0].loan_amount,
      term: this.loanDetails[0].term,
      loan_application_number: this.loanDetails[0].loan_application_number,
      multi_purpose: this.loanDetails[0].type_of_loan.includes(
        'Multi-Purpose (new)'
      ),
      multi_purpose_new: this.loanDetails[0].type_of_loan.includes(
        'Multi-Purpose (new)'
      ),
      multi_purpose_renewal: this.loanDetails[0].type_of_loan.includes(
        'Multi-Purpose (renewal)'
      ),
      additional: this.loanDetails[0].type_of_loan.includes('Additional'),
      purpose_educational: this.loanDetails[0].purpose.includes('Educational'),
      purpose_hospitalization: this.loanDetails[0].purpose.includes(
        'Hospitalization/Medical'
      ),
      purpose_long_medication: this.loanDetails[0].purpose.includes(
        'Long Medication/Rehabilitation'
      ),
      purpose_house_arrears: this.loanDetails[0].purpose.includes(
        'House Repairs/Equity'
      ),
      purpose_house_repair_major: this.loanDetails[0].purpose.includes(
        'House Repair - Major'
      ),
      purpose_house_repair_minor: this.loanDetails[0].purpose.includes(
        'House Repair - Minor'
      ),
      purpose_payment: this.loanDetails[0].purpose.includes(
        'Payment of Loans from Private Institution'
      ),
      purpose_calamity: this.loanDetails[0].purpose.includes('Calamity'),
      purpose_others: this.loanDetails[0].purpose.includes('Others (specify)'),
      purpose_others_text: this.loanDetails[0].other_purpose,

      borrower_surname: this.borrowersInformation[0].last_name,
      borrower_first_name: this.borrowersInformation[0].first_name,
      borrower_mi: this.borrowersInformation[0].middle_initial,
      borrower_address:
        this.borrowersInformation[0].street +
        ', ' +
        this.borrowersInformation[0].province +
        ', ' +
        this.borrowersInformation[0].region,
      borrower_position: this.borrowersInformation[0].position,
      borrower_employee_no: this.borrowersInformation[0].employee_number,
      borrower_employment_status:
        this.borrowersInformation[0].employment_status,
      borrower_office: this.borrowersInformation[0].office,
      borrower_date_of_birth: this.borrowersInformation[0].date_of_birth,
      borrower_age: this.borrowersInformation[0].age,
      borrower_monthly_salary: this.borrowersInformation[0].monthly_salary,
      borrower_office_tel_no: this.borrowersInformation[0].office_tel_number,
      borrower_years_in_service: this.borrowersInformation[0].years_in_service,
      borrower_mobile_no: this.borrowersInformation[0].mobile_number,
      borrower_specimen_signature_1: borrowerSignatureImage,
      borrower_specimen_signature_2: borrowerSignatureImage,

      co_makers_surname: this.coMakersInformation[0].co_last_name,
      co_makers_first_name: this.coMakersInformation[0].co_first_name,
      co_makers_mi: this.coMakersInformation[0].co_middle_initial,
      co_makers_address:
        this.coMakersInformation[0].co_street +
        ', ' +
        this.coMakersInformation[0].co_province +
        ', ' +
        this.coMakersInformation[0].co_region,
      co_makers_position: this.coMakersInformation[0].position,
      co_makers_employee_no: this.coMakersInformation[0].co_employee_number,
      co_makers_employment_status:
        this.coMakersInformation[0].co_employment_status,
      co_makers_office: this.coMakersInformation[0].co_office,
      co_makers_date_of_birth: this.coMakersInformation[0].co_date_of_birth,
      co_makers_age: this.coMakersInformation[0].co_age,
      co_makers_monthly_salary: this.coMakersInformation[0].co_monthly_salary,
      co_makers_office_tel_no: this.coMakersInformation[0].co_office_tel_number,
      co_makers_years_in_service:
        this.coMakersInformation[0].co_years_in_service,
      co_makers_mobile_no: this.coMakersInformation[0].co_mobile_number,
      co_makers_specimen_signature_1: coMakerSignatureImage,
      co_makers_specimen_signature_2: coMakerSignatureImage,

      pesos_word: this.numberToWords(this.loanDetails[0].loan_amount),
      pesos_number: this.loanDetails[0].loan_amount,
      borrower_signature: borrowerSignatureImage,
      borrower_date: this.formatDateToLong(
        this.borrowersInformation[0]?.date.toString()
      ),
      co_makers_signature: coMakerSignatureImage,
      co_makers_date: this.coMakersInformation[0]?.co_date
        ? this.formatDateToLong(this.coMakersInformation[0].co_date.toString())
        : 'No Date Yet',

      personnel_signature: 'PLACEHOLDER',
      personnel_designation: 'PLACEHOLDER',
      personnel_date: 'PLACEHOLDER',
      permanent:
        this.borrowersInformation[0].employment_status.includes('Permanent'),
      co_terminus:
        this.borrowersInformation[0].employment_status.includes('Co-Terminus'),
      net_pay: 'PLACEHOLDER',
      year_of: 'PLACEHOLDER',

      legal_signature: 'PLACEHOLDER',
      legal_designation: 'PLACEHOLDER',
      legal_date: 'PLACEHOLDER',
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
      { name: 'borrower_first_name', x: 230, y: 348, fontSize: 8 },
      { name: 'borrower_mi', x: 370, y: 348, fontSize: 8 },
      { name: 'borrower_address', x: 130, y: 378, fontSize: 8 },
      { name: 'borrower_position', x: 110, y: 405, fontSize: 8 },
      { name: 'borrower_employee_no', x: 120, y: 425, fontSize: 8 },
      { name: 'borrower_employment_status', x: 310, y: 425, fontSize: 8 },
      { name: 'borrower_office', x: 100, y: 443, fontSize: 8 },
      { name: 'borrower_date_of_birth', x: 120, y: 463, fontSize: 8 },
      { name: 'borrower_age', x: 310, y: 464, fontSize: 8 },
      { name: 'borrower_monthly_salary', x: 145, y: 483, fontSize: 8 },
      { name: 'borrower_office_tel_no', x: 288, y: 474, fontSize: 8 },
      { name: 'borrower_years_in_service', x: 130, y: 502, fontSize: 8 },
      { name: 'borrower_mobile_no', x: 280, y: 493, fontSize: 8 },
      {
        name: 'borrower_specimen_signature_1',
        x: 90,
        y: 520,
        fontSize: 8,
        isImage: true,
      },
      {
        name: 'borrower_specimen_signature_2',
        x: 266,
        y: 520,
        fontSize: 8,
        isImage: true,
      },

      { name: 'co_makers_surname', x: 420, y: 348, fontSize: 8 },
      { name: 'co_makers_first_name', x: 570, y: 348, fontSize: 8 },
      { name: 'co_makers_mi', x: 707, y: 348, fontSize: 8 },
      { name: 'co_makers_address', x: 480, y: 378, fontSize: 8 },
      { name: 'co_makers_position', x: 460, y: 405, fontSize: 8 },
      { name: 'co_makers_employee_no', x: 472, y: 425, fontSize: 8 },
      { name: 'co_makers_employment_status', x: 660, y: 425, fontSize: 8 },
      { name: 'co_makers_office', x: 450, y: 443, fontSize: 8 },
      { name: 'co_makers_date_of_birth', x: 470, y: 463, fontSize: 8 },
      { name: 'co_makers_age', x: 662, y: 464, fontSize: 8 },
      { name: 'co_makers_monthly_salary', x: 497, y: 482, fontSize: 8 },
      { name: 'co_makers_office_tel_no', x: 638, y: 473, fontSize: 8 },
      { name: 'co_makers_years_in_service', x: 480, y: 502, fontSize: 8 },
      { name: 'co_makers_mobile_no', x: 630, y: 493, fontSize: 8 },
      {
        name: 'co_makers_specimen_signature_1',
        x: 450,
        y: 520,
        fontSize: 8,
        isImage: true,
      },
      {
        name: 'co_makers_specimen_signature_2',
        x: 625,
        y: 520,
        fontSize: 8,
        isImage: true,
      },

      { name: 'pesos_word', x: 65, y: 584, fontSize: 8 },
      { name: 'pesos_number', x: 280, y: 584, fontSize: 8 },
      { name: 'borrower_signature', x: 95, y: 715, fontSize: 8, isImage: true },
      { name: 'borrower_date', x: 310, y: 726, fontSize: 8 },
      { name: 'co_makers_signature', x: 440, y: 715, fontSize: 8 },
      { name: 'co_makers_date', x: 665, y: 728, fontSize: 8 },

      { name: 'permanent', x: 100, y: 838, fontSize: 8, checkbox: true },
      { name: 'co-terminus', x: 175, y: 838, fontSize: 8, checkbox: true },
      { name: 'net_pay', x: 150, y: 862.5, fontSize: 8 },
      { name: 'year_of', x: 65, y: 874, fontSize: 8 },
      {
        name: 'personnel_signature',
        x: 190,
        y: 910,
        fontSize: 8,
        isImage: true,
      },
      { name: 'personnel_designation', x: 205, y: 945, fontSize: 8 },
      { name: 'personnel_date', x: 180, y: 957, fontSize: 8 },
      { name: 'legal_signature', x: 545, y: 910, fontSize: 8, isImage: true },
      { name: 'legal_designation', x: 555, y: 945, fontSize: 8 },
      { name: 'legal_date', x: 530, y: 957, fontSize: 8 },
    ];

    const scaleX = width / 800;
    const scaleY = height / 1100;

    fields.forEach((f) => {
      let val = (data as any)[f.name];

      // HANDLE IMAGE EMBEDDING FOR SIGNATURE AND ADJUST HEIGHT AND WIDTH
      if (f.isImage && val) {
        const xPt = f.x * scaleX;
        const yPt = height - f.y * scaleY - 20;

        if (typeof val !== 'object' || typeof val.embed !== 'function') {
          console.warn(`Expected PDFImage for ${f.name}, but got`, val);
          return;
        }

        page.drawImage(val, {
          x: xPt,
          y: yPt,
          width: 80 * 0.8,
          height: 30 * 0.8,
        });
        return;
      }

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
