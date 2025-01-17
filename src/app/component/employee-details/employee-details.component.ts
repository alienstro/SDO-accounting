import { Component, Input } from '@angular/core';
import { BorrowersInformation, CoMakersInformation } from '../../interface';
import { zip } from 'rxjs';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {

  @Input() borrowerInfo!: BorrowersInformation

  get parseName() {
    const firstN = this.borrowerInfo.first_name
    const lastN = this.borrowerInfo.last_name
    const middleN = this.borrowerInfo.middle_initial ? this.borrowerInfo.middle_initial : ''
    // const extN = this.borrowerInfo. ? this.borrowerInfo.ext_name : ''

    return firstN + ' ' + middleN + ' ' + lastN
  }

  get parseAddress() {
    const street = this.borrowerInfo.street ? this.borrowerInfo.street : ''
    const barangay = this.borrowerInfo.barangay ? this.borrowerInfo.barangay : ''
    const city = this.borrowerInfo.city ? this.borrowerInfo.city : ''
    const region = this.borrowerInfo.region ? this.borrowerInfo.region : ''
    const zipcode = this.borrowerInfo.zipcode ? this.borrowerInfo.zipcode : ''

    return street + ' ' + barangay + city + region + zipcode
  }

}
