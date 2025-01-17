import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StaffProfile } from '../interface';
import { RequestService } from './request.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private _staffProfile = new BehaviorSubject<StaffProfile>({
    staff_id: 0,
    email: '',
    first_name: '',
    middle_name: '',
    ext_name: '',
    last_name: '',
    department_name: ''
  });

  staffProfile$ = this._staffProfile.asObservable();

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) {
    this.initStaffProfile()
  }


  initStaffProfile() {

    this.requestService.get<StaffProfile>('user').subscribe({
      next: res => {
        this.setStaffProfile(res.message)
      },
      error: error =>
        this.snackbarService.showSnackbar('Error fetching user profile')
    })
  }

  setStaffProfile(data: StaffProfile) {
    this._staffProfile.next(data)
  }
}
