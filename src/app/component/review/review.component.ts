import { ChangeDetectorRef, Component } from '@angular/core';
import { TitleViewComponent } from '../../common/title-view/title-view.component';
import { TableComponent } from '../../common/table/table.component';
import { ApplicationService } from '../../service/application.service';
import { Application } from '../../interface';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [TitleViewComponent, TableComponent],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {

  applications: Application[] = []
  constructor(private applicationService: ApplicationService, private cdr: ChangeDetectorRef) {
    this.applicationService.applications$.subscribe(res => {
      console.log(res)
      this.applications = res
      this.cdr.markForCheck(); // This helps notify Angular to check for changes
    })
  }
}
