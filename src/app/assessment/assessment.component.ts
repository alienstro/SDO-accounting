import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TitleViewComponent } from '../common/title-view/title-view.component';
import { TableComponent } from '../common/table/table.component';
import { Application } from '../interface';
import { ApplicationService } from '../service/application.service';

@Component({
  selector: 'app-assessment',
  standalone: true,
  imports: [TitleViewComponent, TableComponent],
  templateUrl: './assessment.component.html',
  styleUrl: './assessment.component.css'
})
export class AssessmentComponent implements OnInit{

  applications: Application[] = []
  constructor(private applicationService: ApplicationService, private cdr: ChangeDetectorRef) {
    this.applicationService.applications$.subscribe(res => {
      console.log(res)
      this.applications = res
      this.cdr.markForCheck(); // This helps notify Angular to check for changes
    })
  }

  ngOnInit(): void {
      this.applicationService.getApplication().subscribe(res => {
        this.applications = res;
      })
  }
}
