import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableComponent } from '../common/table/table.component';
import { ApplicationService } from '../service/application.service';
import { Application } from '../interface';
import { TitleViewComponent } from '../common/title-view/title-view.component';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [CommonModule, TableComponent, TitleViewComponent],
  templateUrl: './application.component.html',
  styleUrl: './application.component.css'
})
export class ApplicationComponent implements OnInit{

  applications: Application[] = []
  constructor(private applicationService: ApplicationService, private cdr: ChangeDetectorRef) {
    // this.applicationService.applications$.subscribe(res => {
    //   console.log(res)
    //   this.applications = res
    //   this.cdr.markForCheck(); // This helps notify Angular to check for changes
    // })

    
  }

  ngOnInit(): void {
      this.applicationService.getApplication()

      this.applicationService.applications$.subscribe(applications => {
        this.applications = applications;
        console.log("application data: ", this.applications);
      })
  }
}
