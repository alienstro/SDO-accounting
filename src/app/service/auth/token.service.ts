import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  setTokenInCookie(token: string) {
    let expireDate = new Date();
    expireDate.setTime(expireDate.getTime() + (60 * 60 * 1000));
    document.cookie = `tokenAccounting=${token}; ${expireDate}; path=/`
  }

}
