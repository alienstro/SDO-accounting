import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../env';
import { Response } from '../interface';
interface LoginResponse {
  token: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(API_URL + '/staffLogin', data);
  }

  updateApprovalAccounting(data: any): Observable<any> {
    console.log(data);
    return this.http.post(
      `${API_URL}` + `/loanApplication/submitSignatureAccounting`,
      data
    );
  }

  rejectApprovalAccounting(data: any): Observable<any> {
    console.log(data);
    return this.http.post(
      `${API_URL}` + `/loanApplication/rejectAccounting`,
      data
    );
  }

  get<T>(endpoint: string) {
    return this.http.get<Response<T>>(`${API_URL}` + `${endpoint}`);
  }

  patch(endpoint: string, data: object) {
    return this.http.patch(`${API_URL}` + `${endpoint}`, data);
  }

  assessLoanApplication(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(
      `${API_URL}/loanApplication/assessLoanApplication/${data.application_id}`,
      data,
      { headers }
    );
  }

  addStaffAccount(data: any): Observable<any> {
    return this.http.post(`${API_URL}` + `/staffUser`, data);
  }

  addApplicantAccount(data: any): Observable<any> {
    return this.http.post(`${API_URL}` + `/applicantUser`, data);
  }

  editApplicantAccount(data: any): Observable<any> {
    console.log('request service applicant: ', data);
    return this.http.put(
      `${API_URL}` + `/applicantUser/${data.applicant_id}`,
      data
    );
  }

  editStaffAccount(data: any): Observable<any> {
    console.log('request service staff: ', data);
    return this.http.put(
      `${API_URL}` + `/applicantUser/${data.staff_id}`,
      data
    );
  }

  deleteStaffAccount(staff_id: number): Observable<any> {
    return this.http.delete(`${API_URL}/staffUser/${staff_id}`);
  }

  deleteApplicantAccount(applicant_id: number): Observable<any> {
    return this.http.delete(`${API_URL}/applicantUser/${applicant_id}`);
  }

  editPasswordStaff(data: any): Observable<any> {
    console.log('request service staff: ', data);
    return this.http.put(
      `${API_URL}` + `/staffUser/change-password/${data.staff_id}`,
      data
    );
  }

  editPasswordApplicant(data: any): Observable<any> {
    console.log('request service applicant: ', data);
    return this.http.put(
      `${API_URL}` + `/applicantUser/change-password/${data.applicant_id}`,
      data
    );
  }
}
