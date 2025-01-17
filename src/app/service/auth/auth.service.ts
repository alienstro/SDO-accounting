import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  flushToken() {
    throw new Error('Method not implemented.');
  }

  constructor() { }
}
