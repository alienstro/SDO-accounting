import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Application, PaidApplication } from '../interface';
import { RequestService } from './request.service';
import { API_URL } from '../env';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {


  private _applications = new BehaviorSubject<Application[]>([])

  applications$ = this._applications.asObservable()

  private _paidApplications = new BehaviorSubject<PaidApplication[]>([])

  paidApplications$ = this._paidApplications.asObservable()

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) {
    this.initApplication()
    this.initPaidApplication()
  }

  initApplication() {
    this.requestService.get<Application[]>('/loanApplication').subscribe({
      next: res => {
        this._applications.next(res.message); // Assuming `message` is the correct property
      },
      error: err => this.snackbarService.showSnackbar(`Error fetching applications`)
    });
  }

  initPaidApplication() {
    this.requestService.get<PaidApplication[]>('/paidApplication').subscribe({
      next: res => {
        this._paidApplications.next(res.message); // Assuming `message` is the correct property
      },
      error: err => this.snackbarService.showSnackbar(`Error fetching paid applications`)
    });
  }


  setApplication(data: Application[]) {
    this._applications.next(data)
  }
}
