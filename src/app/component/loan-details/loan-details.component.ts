import { Component, Input } from '@angular/core';
import { LoanDetails } from '../../interface';

@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.css'
})
export class LoanDetailsComponent {

  @Input() loanDetail!: LoanDetails

}
