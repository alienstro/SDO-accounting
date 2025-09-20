import { Component } from '@angular/core';
import { ApplicationService } from '../service/application.service';
import { PaidApplication } from '../interface';
import { TitleViewComponent } from '../common/title-view/title-view.component';
import { TableComponent } from '../common/table/table.component';

@Component({
  selector: 'app-paid',
  standalone: true,
  imports: [TitleViewComponent, TableComponent],
  templateUrl: './paid.component.html',
  styleUrl: './paid.component.css',
})
export class PaidComponent {
  paidApplications: PaidApplication[] = [];

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.applicationService.getPaidApplication().subscribe((res) => {
      this.applicationService.setPaidApplications(res); 
      this.paidApplications = res; 
      console.log("paid: ", this.paidApplications)
    });
  }
}
