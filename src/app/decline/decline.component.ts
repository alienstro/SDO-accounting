import { ChangeDetectorRef, Component } from '@angular/core';
import { TableComponent } from '../common/table/table.component';
import { TitleViewComponent } from '../common/title-view/title-view.component';
import { Application } from '../interface';
import { ApplicationService } from '../service/application.service';

@Component({
  selector: 'app-decline',
  standalone: true,
  imports: [TableComponent, TitleViewComponent],
  templateUrl: './decline.component.html',
  styleUrl: './decline.component.css'
})
export class DeclineComponent {

  applications: Application[] = []
  constructor(private applicationService: ApplicationService, private cdr: ChangeDetectorRef) {
    this.applicationService.applications$.subscribe(res => {
      console.log(res)
      this.applications = res
      this.cdr.markForCheck(); // This helps notify Angular to check for changes
    })
  }
}
