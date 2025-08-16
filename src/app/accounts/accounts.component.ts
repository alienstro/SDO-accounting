import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TitleViewComponent } from '../common/title-view/title-view.component';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

import { Applicant, Staff } from '../interface';
import { ApplicationService } from '../service/application.service';
import { ConfirmationDialogComponent } from '../component/confirmation-dialog/confirmation-dialog.component';
import { AddApplicantComponent } from '../add-applicant/add-applicant.component';
import { AddStaffComponent } from '../add-staff/add-staff.component';
import { AccountEditComponent } from '../account-edit/account-edit.component';
import { AccountDeleteComponent } from '../account-delete/account-delete.component';
import { TokenService } from '../service/token.service';
import { ImportDialogComponent } from '../import-dialog/import-dialog.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    TitleViewComponent,
  ],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
  // Active tab: 0 = Applicants, 1 = Staff
  selectedIndex = 0;

  applicants: Applicant[] = [];
  staff: Staff[] = [];

  staff_id: number = 0;

  // Two separate data sources
  dataSourceApplicants = new MatTableDataSource<Applicant>([]);
  dataSourceStaff = new MatTableDataSource<Staff>([]);

  // Search + filter shared UI (applies to active tab)
  searchKey = '';
  filterStatus = '';

  // Columns (kept identical for visual consistency with ForwardView)
  displayedColumnsApplicants: string[] = [
    'email',
    'first_name',
    'last_name',
    'middle_name',
    'ext_name',
    'institution',
    'designation',
    // 'status',
    'action',
  ];
  displayedColumnsStaff: string[] = [
    'email',
    'first_name',
    'last_name',
    'middle_name',
    'ext_name',
    'designation',
    // 'status',
    'action',
  ];

  // ViewChilds per tab
  @ViewChild('paginatorApplicants') paginatorApplicants!: MatPaginator;
  @ViewChild('paginatorStaff') paginatorStaff!: MatPaginator;

  @ViewChild('sortApplicants') sortApplicants!: MatSort;
  @ViewChild('sortStaff') sortStaff!: MatSort;

  constructor(
    private applicationService: ApplicationService,
    public dialog: MatDialog,
    private tokenService: TokenService
  ) {
    this.staff_id = this.tokenService.userIDToken(
      this.tokenService.decodeToken()
    );
    console.log('staff_id: ', this.staff_id);
  }

  ngOnInit(): void {
    // Load Applicants
    this.applicationService.getAccountsApplicant().subscribe((res) => {
      this.applicants = res;
      this.dataSourceApplicants.data = this.applicants;
      this.setApplicantsFilterPredicate();
      this.applyFilter(); // apply current filter to active tab
    });

    // Load Staff
    this.applicationService.getAccountsStaff(this.staff_id).subscribe((res) => {
      this.staff = res;
      this.dataSourceStaff.data = this.staff;
      this.setStaffFilterPredicate();
      this.applyFilter(); // apply current filter to active tab
    });
  }

  ngAfterViewInit(): void {
    // Hook up sorts/paginators
    this.dataSourceApplicants.paginator = this.paginatorApplicants;
    this.dataSourceApplicants.sort = this.sortApplicants;

    this.dataSourceStaff.paginator = this.paginatorStaff;
    this.dataSourceStaff.sort = this.sortStaff;
  }

  // Filter logic per tab
  private setApplicantsFilterPredicate() {
    this.dataSourceApplicants.filterPredicate = (
      data: Applicant,
      filter: string
    ) => {
      const [searchValue, statusFilter] = filter.split('§§');
      const status = (data.emp_status || '').trim(); // <-- FIXED LINE
      const matchesSearch =
        (data.first_name || '').toLowerCase().includes(searchValue) ||
        (data.last_name || '').toLowerCase().includes(searchValue) ||
        (data.email || '').toLowerCase().includes(searchValue);
      const matchesStatus = !statusFilter || status === statusFilter;
      return matchesSearch && matchesStatus;
    };
  }

  private setStaffFilterPredicate() {
    this.dataSourceStaff.filterPredicate = (data: Staff, filter: string) => {
      const [searchValue, statusFilter] = filter.split('§§');
      const status = (data.emp_status || '').trim();
      const matchesSearch =
        (data.first_name || '').toLowerCase().includes(searchValue) ||
        (data.last_name || '').toLowerCase().includes(searchValue) ||
        (data.email || '').toLowerCase().includes(searchValue);
      const matchesStatus = !statusFilter || status === statusFilter;
      return matchesSearch && matchesStatus;
    };
  }

  // Applies to active tab only
  applyFilter(): void {
    const packed = `${this.searchKey.trim().toLowerCase()}§§${
      this.filterStatus
    }`;

    this.dataSourceApplicants.filter = packed;
    this.dataSourceApplicants.paginator?.firstPage();

    this.dataSourceStaff.filter = packed;
    this.dataSourceStaff.paginator?.firstPage();
  }

  onTabChange(index: number) {
    this.selectedIndex = index;
    this.applyFilter();
  }

  openCreateDialog() {
    let dialogRef;
    if (this.selectedIndex === 0) {
      dialogRef = this.dialog.open(AddApplicantComponent, {});
    } else {
      dialogRef = this.dialog.open(AddStaffComponent, {});
    }

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  importExcel() {
    const importType = this.selectedIndex === 0 ? 'applicant' : 'staff';

    const dialogRef = this.dialog.open(ImportDialogComponent, {
      data: { type: importType },
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh data if import was successful
        this.ngOnInit();
      }
    });
  }

  editAccount(account: any, flag: string) {
    let dialogRef;
    if (flag === 'applicant') {
      console.log('applicant: ', account);
      dialogRef = this.dialog.open(AccountEditComponent, {
        data: { account, flag },
      });
    } else {
      console.log('staff: ', account);
      dialogRef = this.dialog.open(AccountEditComponent, {
        data: { account, flag },
      });
    }

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  deleteAccount(account: any, flag: string) {
    let dialogRef;
    if (flag === 'applicant') {
      console.log('applicant: ', account);
      dialogRef = this.dialog.open(AccountDeleteComponent, {
        data: { account, flag },
      });
    } else {
      console.log('staff: ', account);
      dialogRef = this.dialog.open(AccountDeleteComponent, {
        data: { account, flag },
      });
    }

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }
}
