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
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule],
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

  // Pagination properties
  paginatedRows: string[][] = [];
  pageSize = 5;
  pageIndex = 0;
  totalItems = 0;
  pageSizeOptions = [5, 10, 20];

  constructor(private utilService: UtilsService, public router: Router) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      let sortedData = changes['data'].currentValue;

      if (
        Array.isArray(sortedData) &&
        sortedData.length > 0 &&
        sortedData[0].application_id !== undefined
      ) {
        sortedData = [...sortedData].sort(
          (a, b) => b.application_id - a.application_id
        );
      }

      const parseRes = this.utilService.parseData(
        sortedData,
        this.status,
        this.office,
        this.offices
      );
      this.header = parseRes.headers;
      this.rows = parseRes.rows;
      this.baseRows = parseRes.rows;
      this.updatePagination();
    }
    console.log('Table data:', this.data);
  }

  navigateRoute(route: string, loan: any) {
    const currentUrl = this.router.url;

    console.log(currentUrl);

    if (
      currentUrl === '/application' ||
      currentUrl === '/done' ||
      currentUrl === '/reject'
    ) {
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

    // Reset pagination after search
    this.pageIndex = 0;
    this.updatePagination();
  }

  // Pagination methods
  updatePagination() {
    this.totalItems = this.rows.length;
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedRows = this.rows.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePagination();
  }

  getReasonFromData(application_id: any): string {
    if (this.data) {
      const item = (this.data as any[]).find(
        (d) => d.application_id === application_id
      );
      if (item) {
        return (
          item.remarks_message ||
          item.reason ||
          item.remarks ||
          item.rejection_reason ||
          'No reason provided'
        );
      }
    }
    return 'No reason provided';
  }
}
