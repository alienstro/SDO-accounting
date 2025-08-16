import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExcelimportService } from '../service/excelimport.service';
import { RequestService } from '../service/request.service';

@Component({
  selector: 'app-import-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule],
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css']
})
export class ImportDialogComponent {
  selectedFile: File | null = null;
  isLoading = false;
  importType: 'applicant' | 'staff';

  constructor(
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { type: 'applicant' | 'staff' },
    private excelImportService: ExcelimportService,
    private requestService: RequestService,
    private snackBar: MatSnackBar
  ) {
    this.importType = data.type;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                 file.type === 'application/vnd.ms-excel')) {
      this.selectedFile = file;
    } else {
      this.snackBar.open('Please select a valid Excel file (.xlsx or .xls)', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error'
      });
    }
  }

  async importData(): Promise<void> {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a file first', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error'
      });
      return;
    }

    this.isLoading = true;

    try {
      const data = await this.excelImportService.parseExcelFile(this.selectedFile);
      
      if (this.importType === 'applicant') {
        await this.importApplicants(data);
      } else {
        await this.importStaff(data);
      }
    } catch (error) {
      console.error('Import error:', error);
      this.snackBar.open('Failed to import data. Please check your file format.', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error'
      });
    } finally {
      this.isLoading = false;
    }
  }

  private async importApplicants(data: any[]): Promise<void> {
    const { valid, errors } = this.excelImportService.validateApplicantData(data);

    if (errors.length > 0) {
      this.snackBar.open(`Validation errors: ${errors.join(', ')}`, 'Close', {
        duration: 5000,
        panelClass: 'snackbar-error'
      });
      return;
    }

    if (valid.length === 0) {
      this.snackBar.open('No valid data found in the file', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error'
      });
      return;
    }

    // Import each applicant
    let successCount = 0;
    let errorCount = 0;

    for (const applicant of valid) {
      try {
        const response = await this.requestService.addApplicantAccount(applicant).toPromise();
        if (response?.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error: any) {
        errorCount++;
        console.error('Error importing applicant:', error);
      }
    }

    this.snackBar.open(`Import completed: ${successCount} successful, ${errorCount} failed`, 'Close', {
      duration: 3000,
      panelClass: successCount > 0 ? 'snackbar-success' : 'snackbar-error'
    });

    if (successCount > 0) {
      this.dialogRef.close(true);
    }
  }

  private async importStaff(data: any[]): Promise<void> {
    const { valid, errors } = this.excelImportService.validateStaffData(data);

    if (errors.length > 0) {
      this.snackBar.open(`Validation errors: ${errors.join(', ')}`, 'Close', {
        duration: 5000,
        panelClass: 'snackbar-error'
      });
      return;
    }

    if (valid.length === 0) {
      this.snackBar.open('No valid data found in the file', 'Close', {
        duration: 3000,
        panelClass: 'snackbar-error'
      });
      return;
    }

    // Import each staff member
    let successCount = 0;
    let errorCount = 0;

    for (const staff of valid) {
      try {
        const response = await this.requestService.addStaffAccount(staff).toPromise();
        if (response?.success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error: any) {
        errorCount++;
        console.error('Error importing staff:', error);
      }
    }

    this.snackBar.open(`Import completed: ${successCount} successful, ${errorCount} failed`, 'Close', {
      duration: 3000,
      panelClass: successCount > 0 ? 'snackbar-success' : 'snackbar-error'
    });

    if (successCount > 0) {
      this.dialogRef.close(true);
    }
  }

  downloadTemplate(): void {
    if (this.importType === 'applicant') {
      this.excelImportService.generateApplicantTemplate();
    } else {
      this.excelImportService.generateStaffTemplate();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}