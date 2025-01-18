import { CommonModule } from '@angular/common';
import { Component, inject, Input, SimpleChanges } from '@angular/core';
import { UtilsService } from '../../service/utils.service';
import { Application } from '../../interface';
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

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @Input() data: Application[] | null = null

  readonly dialog = inject(MatDialog);

  header: string[] = []
  rows: string[][] = []

  constructor(
    private utilService: UtilsService,
    public router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'].currentValue) {
      const parseRes = this.utilService.parseHeader(changes['data'].currentValue)
      this.header = parseRes.headers
      this.rows = parseRes.rows
      console.log(this.rows[0][0])
    }
  }

  navigateRoute(route: string) {
    this.router.navigate([`/forward/${route}`])
  }

  openDialog(application_id: string): void {
    const dialogRef = this.dialog.open(ConfirmationModelComponent, { data: { application_id, view: 'payment' } });

    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   if (result !== undefined) {
    //     this.animal.set(result);
    //   }
    // });
  }
}
