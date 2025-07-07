import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableComponent } from '../common/table/table.component';
import { ApplicationService } from '../service/application.service';
import { Application } from '../interface';
import { TitleViewComponent } from '../common/title-view/title-view.component';
@Component({
  selector: 'app-forward',
  standalone: true,
  imports: [TableComponent, TitleViewComponent],
  templateUrl: './forward.component.html',
  styleUrl: './forward.component.css'
})
export class ForwardComponent implements OnInit{


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
