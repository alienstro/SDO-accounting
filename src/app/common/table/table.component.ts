import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { UtilsService } from '../../service/utils.service';
import { Application, LoanDetails, PaidApplication } from '../../interface';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../component/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
})
export class TableComponent {
  @Input() data: Application[] | PaidApplication[] | null = null;
  @Input() status = '';
  @Input() office = '';
  @Input() offices: string[] = [];

  searchTerm = '';
  readonly dialog = inject(MatDialog);

  header: string[] = [];
  rows: string[][] = [];
  baseRows: string[][] = [];
  constructor(private utilService: UtilsService, public router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      console.log('Change:');
      console.log(changes['data'].currentValue);

      const parseRes = this.utilService.parseData(
        changes['data'].currentValue,
        this.status,
        this.office,
        this.offices
      );
      this.header = parseRes.headers;
      this.rows = parseRes.rows;
      this.baseRows = parseRes.rows;
    }
  }

  navigateRoute(route: string, loan: any) {
    const currentUrl = this.router.url;

    console.log(currentUrl);

    if (currentUrl === '/application' || currentUrl === '/paid') {
      this.router.navigate([`/application/${route}`], {
        state: { loanDetails: loan },
      });
    } else if (currentUrl === '/assessment') {
      this.router.navigate([`/assessment/${route}`], {
        state: { loanDetails: loan },
      });
    } else if (currentUrl === '/forward') {
      this.router.navigate([`/forward/${route}`], {
        state: { loanDetails: loan },
      });
    }
  }

  openDialog(application_id: string, loan_amount: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: { application_id, loan_amount, view: 'payment' },
      width: '30%',
    });
  }

  searchEmployee() {
    const search = this.searchTerm.trim().toLowerCase();

    if (search) {
      this.rows = this.baseRows.filter((row) =>
        row.some(
          (cell) =>
            cell !== null &&
            cell !== undefined &&
            cell.toString().toLowerCase().includes(search)
        )
      );
    } else {
      this.rows = this.baseRows;
    }
  }

  getReasonFromData(rowIndex: number): string {
    // Get the reason directly from the original data array
    if (this.data && this.data[rowIndex]) {
      const item = this.data[rowIndex] as any;

      // Try different possible field names for the reason
      const reason =
        item.remarks_message ||
        item.reason ||
        item.remarks ||
        item.rejection_reason ||
        'No reason provided';

      return reason;
    }

    return 'No reason provided';
  }
}
