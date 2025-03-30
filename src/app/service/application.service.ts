import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { Applicant, Application, ApprovalDetails, Assessment, BorrowersInformation, CoMakersInformation, DepartmentStatus, LoanApplication, LoanDetails, MergedLoanApplicationDetails, PaidApplication, SignatureDetails } from '../interface';
import { RequestService } from './request.service';
import { API_URL } from '../env';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {


  private _applications = new BehaviorSubject<Application[]>([])
  private _paidApplications = new BehaviorSubject<PaidApplication[]>([])
  private _loanApplication = new BehaviorSubject<LoanApplication[]>([]);
  private _loanDetails = new BehaviorSubject<LoanDetails[]>([]);
  private _coMakersInformation = new BehaviorSubject<CoMakersInformation[]>([]);
  private _borrowersInformation = new BehaviorSubject<BorrowersInformation[]>([]);
  private _mergedLoanApplicationDetails = new BehaviorSubject<MergedLoanApplicationDetails[]>([]);
  private _assessmentForm = new BehaviorSubject<Assessment[]>([]);
  private _signatureDetails = new BehaviorSubject<SignatureDetails[]>([]);
  private _approvalDetails = new BehaviorSubject<ApprovalDetails[]>([]);
  private _departmentStatus = new BehaviorSubject<DepartmentStatus[]>([]);

  paidApplications$ = this._paidApplications.asObservable()
  applications$ = this._applications.asObservable()
  loanApplication$ = this._loanApplication.asObservable();
  loanDetails$ = this._loanDetails.asObservable();
  coMakersInformation$ = this._coMakersInformation.asObservable();
  borrowersInformation$ = this._borrowersInformation.asObservable();
  mergedLoanApplicationDetails$ = this._mergedLoanApplicationDetails.asObservable();
  assessmentForm$ = this._assessmentForm.asObservable();
  signatureDetails$ = this._signatureDetails.asObservable();
  approvalDetails$ = this._approvalDetails.asObservable();
  departmentStatus$ = this._departmentStatus.asObservable();


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

  /// GET BY URL

  getApplication(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiLoanApplication}/getLoanApplicationAccounting`);
  }

  getPaidApplication(): Observable<PaidApplication[]> {
    return this.http.get<PaidApplication[]>(`${this.apiLoanApplication}/getPaidApplication`);
  }

  getLoanApplication(): Observable<LoanApplication[]> {
    return this.http.get<LoanApplication[]>(`${this.apiLoanApplication}/loanApplication`);
  }

  getDepartmentStatusById(department_id: string): Observable<DepartmentStatus[]> {
    return this.http.get<DepartmentStatus[]>(`${this.apiLoanApplication}/getDepartmentStatus/${department_id}`);
  }

  getAssessmentDetails(): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.apiLoanApplication}/getAssessmentDetails`);
  }

  getLoanDetails(): Observable<LoanDetails[]> {
    return this.http.get<LoanDetails[]>(`${this.apiLoanApplication}/loanDetails`);
  }

  getCoMakersInformation(): Observable<CoMakersInformation[]> {
    return this.http.get<CoMakersInformation[]>(`${this.apiLoanApplication}/coMakersInformation`);
  }

  getBorrowersInformation(): Observable<BorrowersInformation[]> {
    return this.http.get<BorrowersInformation[]>(`${this.apiLoanApplication}/borrowersInformation`);
  }

  getMergedLoanApplicationDetails(): Observable<MergedLoanApplicationDetails[]> {
    return this.http.get<MergedLoanApplicationDetails[]>(`${this.apiLoanApplication}/mergedLoanApplicationDetails`);
  }

  getSignatureDetails(): Observable<SignatureDetails[]> {
    return this.http.get<SignatureDetails[]>(`${this.apiLoanApplication}/getSignatureDetails`);
  }

  getApprovalDetails(): Observable<ApprovalDetails[]> {
    return this.http.get<ApprovalDetails[]>(`${this.apiLoanApplication}/getApprovalDetails`);
  }

  /// GET DATA BY ID

  getAssessmentDetailsById(applicationId: number): Observable<Assessment[]> {
    return this.http.get<Assessment[]>(`${this.apiLoanApplication}/getAssessmentDetailsById/${applicationId}`);
  }

  getCoMakersInformationById(applicationId: number): Observable<CoMakersInformation[]> {
    return this.http.get<CoMakersInformation[]>(`${this.apiLoanApplication}/coMakersInformationById/${applicationId}`);
  }

  getBorrowersInformationById(applicationId: number): Observable<BorrowersInformation[]> {
    return this.http.get<BorrowersInformation[]>(`${this.apiLoanApplication}/borrowersInformationById/${applicationId}`);
  }

  getLoanApplicantById(applicantId: number): Observable<Applicant[]> {
    return this.http.get<Applicant[]>(`${this.apiLoanApplication}/getApplicant/${applicantId}`);
  }

  getLoanDetailsById(applicationId: number): Observable<Applicant[]> {
    return this.http.get<Applicant[]>(`${this.apiLoanApplication}/getLoanDetailsById/${applicationId}`);
  }

  /// GET DATA IN THE STATE

  getLoanApplicationState() {
    return this._loanApplication.getValue();
  }

  getDepartmentStatusState() {
    return this._departmentStatus.getValue();
  }

  getLoanDetailsState() {
    return this._loanDetails.getValue();
  }

  getCoMakersInformationState() {
    return this._coMakersInformation.getValue();
  }

  getBorrowersInformationState() {
    return this._borrowersInformation.getValue();
  }

  getSignatureDetailsState() {
    return this._signatureDetails.getValue();
  }

  /// SET NEW DATA TO STATE

  setLoanApplicationState(setLoanApplicationState: LoanApplication[]) {
    this._loanApplication.next(setLoanApplicationState);
  }

  setDepartmentStatusState(setDepartmentStatusState: DepartmentStatus[]) {
    this._departmentStatus.next(setDepartmentStatusState);
  }

  setLoanDetailsState(setLoanDetailsState: LoanDetails[]) {
    this._loanDetails.next(setLoanDetailsState);
  }

  setCoMakersInformationState(setCoMakersInformationState: CoMakersInformation[]) {
    this._coMakersInformation.next(setCoMakersInformationState);
  }

  setBorrowersInformationState(setBorrowersInformationState: BorrowersInformation[]) {
    this._borrowersInformation.next(setBorrowersInformationState);
  }

  setSignatureDetailsState(setSignatureDetailsState: SignatureDetails[]) {
    this._signatureDetails.next(setSignatureDetailsState);
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

  updateDepartmentStatus(application_id: number) {
    let oldState = this.getDepartmentStatusState()
    const toUpdateApplicant = oldState.find(item => item.application_id === application_id)

    oldState = oldState.filter(item => item.application_id !== application_id)

    if(!toUpdateApplicant) return

    toUpdateApplicant['status'] = 'Approved'

    const newState : DepartmentStatus[] = [...oldState, toUpdateApplicant]

    this.setDepartmentStatusState(newState)
  }
}
