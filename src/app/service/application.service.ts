import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
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
    private snackbarService: SnackbarService,
    private http: HttpClient
  ) {
    forkJoin({
      application: this.getApplication(),
      paidApplication: this.getPaidApplication()
    }).subscribe(({ application, paidApplication }) => {
      this._applications.next(application);
      this._paidApplications.next(paidApplication);
    })
    // this.initApplication()
    // this.initPaidApplication()

  }

  private apiLoanApplication = `${API_URL}/loanApplication`;

  // initApplication() {
  //   this.requestService.get<Application[]>('/loanApplication/getLoanApplicationAccounting').subscribe({
  //     next: res => {
  //       this._applications.next(res.message); // Assuming `message` is the correct property
  //     },
  //     error: err => this.snackbarService.showSnackbar(`Error fetching applications`)
  //   });
  // }

  getApplication(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiLoanApplication}/getLoanApplicationAccounting`);
  }

  // initPaidApplication() {
  //   this.requestService.get<PaidApplication[]>('/paidApplication').subscribe({
  //     next: res => {
  //       this._paidApplications.next(res.message); // Assuming `message` is the correct property
  //     },
  //     error: err => this.snackbarService.showSnackbar(`Error fetching paid applications`)
  //   });
  // }

  getPaidApplication(): Observable<PaidApplication[]> {
    return this.http.get<PaidApplication[]>(`${this.apiLoanApplication}/getPaidApplication`);
  }


  setApplication(data: Application[]) {
    this._applications.next(data)
  }

  updateStatus(application_id: string, status: string, office?: string) {
    let oldState = [...this._applications.getValue()]

    let currData = oldState.find(item => item.application_id === application_id)!
    currData = { ...currData, department_name: office ? office : currData.department_name, status: 'Pending' }

    oldState = oldState.filter(item => item.application_id !== application_id)

    const newState = [...oldState, currData]

    this._applications.next(newState)
  }

  updatePayment(application_id: string) {

    const date = new Date("2025-01-18T22:14:10");
    const formattedDate = date.toISOString().split('T')[0]; // "2025-01-18"
    const formattedTime = date.toTimeString().split(' ')[0]; // "22:14:10"

    const currDatetime = `${formattedDate} ${formattedTime}`

    let oldApplicationState = [...this._applications.getValue()]
    let currApplicationData = oldApplicationState.find(item => item.application_id === application_id) as PaidApplication

    let oldStatePaidApplication = [...this._paidApplications.getValue()]

    currApplicationData = { ...currApplicationData, status: 'Paid', paid_date: currDatetime }

    oldStatePaidApplication = oldStatePaidApplication.filter(item => item.application_id !== application_id)

    const newStatePaidApplication = [...oldStatePaidApplication, currApplicationData]

    const newStateApplication = oldApplicationState.filter(item => item.application_id !== application_id)

    this._paidApplications.next(newStatePaidApplication)
    this._applications.next(newStateApplication)
  }
}
