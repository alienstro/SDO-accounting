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
import { ConfirmationModelComponent } from '../../component/confirmation-model/confirmation-model.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() data: Application[] | PaidApplication[] | null = null
  @Input() status = ''
  @Input() office = ''
  @Input() offices: string[] = []

  searchTerm = ''
  readonly dialog = inject(MatDialog);

  header: string[] = []
  rows: string[][] = []
  baseRows: string[][] = []
  constructor(
    private utilService: UtilsService,
    public router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      console.log('Change:')
      console.log(changes['data'].currentValue)

      const parseRes = this.utilService.parseData(changes['data'].currentValue, this.status, this.office, this.offices)
      this.header = parseRes.headers
      this.rows = parseRes.rows
      this.baseRows = parseRes.rows
    }
  }

  navigateRoute(route: string, loan: any) {
    this.router.navigate([`/forward/${route}`], { state: { loanDetails: loan } })
  }

  openDialog(application_id: string): void {
    const dialogRef = this.dialog.open(ConfirmationModelComponent, { data: { application_id, view: 'payment' } });
  }

  searchEmployee() {
    this.rows = this.baseRows

    if (this.searchTerm) {
      this.rows = this.rows.filter(item => item.includes(this.searchTerm))
    } else {
      this.rows = this.baseRows
    }
  }
}
