import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TokenService } from '../service/token.service';
import { RequestService } from '../service/request.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApplicationService } from '../service/application.service';
import SignaturePad from 'signature_pad';

@Component({
  selector: 'app-endorse',
  standalone: true,
  imports: [],
  templateUrl: './endorse.component.html',
  styleUrl: './endorse.component.css',
})
export class EndorseComponent {
  @ViewChild('signaturePad', { static: true })
  signaturePadElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('fileInput', { static: false })
  fileInput!: ElementRef<HTMLInputElement>;
  signaturePad!: SignaturePad;

  application_id!: number;
  staff_id!: number;
  department_id!: string;

  constructor(
    public dialogRef: MatDialogRef<EndorseComponent>,
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
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

  uploadSignature(): void {
    this.signaturePad.clear();
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const imageDataUrl = e.target?.result as string;
        this.loadImageToSignaturePad(imageDataUrl);
      };

      reader.readAsDataURL(file);
    }
  }

  loadImageToSignaturePad(imageDataUrl: string): void {
    const canvas = this.signaturePadElement.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const image = new Image();
      image.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        this.signaturePad.fromDataURL(canvas.toDataURL());
      };
      image.src = imageDataUrl;
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.signaturePadElement.nativeElement;

    canvas.width = 760;
    canvas.height = 145;

    this.signaturePad = new SignaturePad(canvas);
  }

  forwardToAccounting() {
    if (this.signaturePad.isEmpty()) {
      this.snackbar.open(
        'Please provide a signature before confirming.',
        'Close',
        { duration: 3000 }
      );
      return;
    }

    const department_id = this.department_id;
    const staff_id = this.staff_id;

    const signatureImage = this.signaturePad.toDataURL('image/png');

    const data = {
      is_approved_osds: 'Approved',
      application_id: this.application_id,
      signature: signatureImage,
      department_id: department_id,
      staff_id: staff_id,
    };

    const departmentId = parseInt(department_id);

    if (departmentId === 1) {
      console.log('Accounting');
      this.requestService.updateApprovalAccounting(data).subscribe({
        next: (res) => {
          console.log(res);

          if (res.success) {
            this.snackbar.open('Forwarded to Accounting successfully!', '', {
              duration: 3000,
            });
            // this.applicationService.updateDepartmentStatus(data.application_id)
            this.dialogRef.close();
            this.router.navigate(['/forward']);
          } else {
            this.snackbar.open(
              'Failed to forward to Accounting. Please try again.',
              '',
              {
                duration: 3000,
              }
            );
          }
        },
        error: (err) => {
          console.error(err);
          this.snackbar.open(
            'An error occurred while forwarding the application.',
            '',
            {
              duration: 3000,
            }
          );
        },
      });
    } else if (departmentId === 3) {
      console.log("Secretariat")
         this.requestService.updateApprovalSecretariat(data).subscribe({
        next: (res) => {
          console.log(res);

          if (res.success) {
            this.snackbar.open('Forwarded to Signature successfully!', '', {
              duration: 3000,
            });
            // this.applicationService.updateDepartmentStatus(data.application_id)
            this.dialogRef.close();
            this.router.navigate(['/forward']);
          } else {
            this.snackbar.open(
              'Failed to forward to Accounting. Please try again.',
              '',
              {
                duration: 3000,
              }
            );
          }
        },
        error: (err) => {
          console.error(err);
          this.snackbar.open(
            'An error occurred while forwarding the application.',
            '',
            {
              duration: 3000,
            }
          );
        },
      });
    }
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
