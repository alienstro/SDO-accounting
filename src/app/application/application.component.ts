import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableComponent } from '../common/table/table.component';
import { ApplicationService } from '../service/application.service';
import { Application } from '../interface';
import { TitleViewComponent } from '../common/title-view/title-view.component';
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, TableComponent, TitleViewComponent],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css',
  providers: [DatePipe]
})
export class ApplicationComponent implements OnInit {
  applications: Application[] = [];

  constructor(
    private applicationService: ApplicationService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.applicationService.getApplication().subscribe((res) => {
      this.applications = res;
    });
  }

 
}
