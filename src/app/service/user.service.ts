import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StaffProfile, UserProfile } from '../interface';
import { RequestService } from './request.service';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  private _userProfile = new BehaviorSubject<StaffProfile>({
    staff_id: 0,
    email: '',
    first_name: '',
    middle_name: '',
    ext_name: '',
    last_name: '',
    department_name: ''
  });


  userProfile$ = this._userProfile.asObservable();

  constructor(
    private requestService: RequestService,
    private snackbarService: SnackbarService
  ) {
    this.initUserProfile()
  }


  initUserProfile() {

    this.requestService.get<StaffProfile>('user').subscribe({
      next: res => {
        this.setUserProfile(res.message)
      },
      error: error =>
        this.snackbarService.showSnackbar('Error fetching user profile')
    })
  }

  setUserProfile(data: StaffProfile) {
    this._userProfile.next(data)
  }
}
