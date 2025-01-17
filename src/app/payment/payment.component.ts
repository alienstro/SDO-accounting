import { ChangeDetectorRef, Component } from '@angular/core';
import { ApplicationService } from '../service/application.service';
import { Application } from '../interface';
import { TableComponent } from '../common/table/table.component';
import { TitleViewComponent } from '../common/title-view/title-view.component';
@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [TableComponent, TitleViewComponent],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {

  applications: Application[] = []
  constructor(private applicationService: ApplicationService, private cdr: ChangeDetectorRef) {
    this.applicationService.applications$.subscribe(res => {
      console.log(res)
      this.applications = res
      this.cdr.markForCheck(); // This helps notify Angular to check for changes
    })
  }
}
