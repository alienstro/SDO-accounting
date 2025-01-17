import { Component, Input } from '@angular/core';
import { CoMakersInformation } from '../../interface';

@Component({
  selector: 'app-comaker-details',
  standalone: true,
  imports: [],
  templateUrl: './comaker-details.component.html',
  styleUrl: './comaker-details.component.css'
})
export class ComakerDetailsComponent {

  @Input() comakerInfo!: CoMakersInformation

  get parseName() {
    const firstN = this.comakerInfo.co_first_name
    const lastN = this.comakerInfo.co_last_name
    const middleN = this.comakerInfo.co_middle_initial ? this.comakerInfo.co_middle_initial : ''
    // const extN = this.comakerInfo.co_ ? this.comakerInfo.co_ext_name : ''

    return firstN + ' ' + middleN + ' ' + lastN
  }

  get parseAddress() {
    const street = this.comakerInfo.co_street ? this.comakerInfo.co_street : ''
    const barangay = this.comakerInfo.co_barangay ? this.comakerInfo.co_barangay : ''
    const city = this.comakerInfo.co_city ? this.comakerInfo.co_city : ''
    const region = this.comakerInfo.co_region ? this.comakerInfo.co_region : ''
    const zipcode = this.comakerInfo.co_zipcode ? this.comakerInfo.co_zipcode : ''

    return street + ' ' + barangay + city + region + zipcode
  }
}
