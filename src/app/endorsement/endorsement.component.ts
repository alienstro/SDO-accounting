import { ChangeDetectorRef, Component } from '@angular/core';
import { ApplicationService } from '../service/application.service';
import { Application } from '../interface';
import { TitleViewComponent } from '../common/title-view/title-view.component';
import { TableComponent } from '../common/table/table.component';

@Component({
  selector: 'app-endorsement',
  standalone: true,
  imports: [TitleViewComponent, TableComponent],
  templateUrl: './endorsement.component.html',
  styleUrl: './endorsement.component.css'
})
export class EndorsementComponent {

  applications: Application[] = []
  constructor(private applicationService: ApplicationService, private cdr: ChangeDetectorRef) {
    this.applicationService.applications$.subscribe(res => {
      console.log(res)
      this.applications = res
      this.cdr.markForCheck(); // This helps notify Angular to check for changes
    })
  }
}
