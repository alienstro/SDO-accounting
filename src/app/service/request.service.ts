import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../env';
import { Response } from '../interface';
interface LoginResponse {
  token: string
}

interface LoginRequest {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) { }

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(API_URL + 'login', data);
  }

  updateApprovalAccounting(data: any): Observable<any> {
    console.log(data);
    return this.http.patch(`${API_URL}` + `updateApprovalAccounting`, data);
  }

  get<T>(endpoint: string) {
    return this.http.get<Response<T>>(`${API_URL}` + `${endpoint}`)
  }

  patch(endpoint: string, data: object) {
    return this.http.patch(`${API_URL}` + `${endpoint}`, data);
  }
}
