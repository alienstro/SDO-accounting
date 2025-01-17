import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth/auth.service';
import { TokenService } from '../service/auth/token.service';
import { RequestService } from '../service/request.service';
import { Router } from '@angular/router';
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  errMessage = ''

  constructor(
    private router: Router,
    private requestService: RequestService,
    private tokenService: TokenService,
    private authService: AuthService
  ) {
    // For now a remedy but improve this
    // this.authService.flushToken()

  }


  userLogin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  })


  onLogin() {
    this.errMessage = ''
    const inputCred = this.userLogin.getRawValue();

    if (!inputCred.email || !inputCred.password) return;

    const loginCred: LoginRequest = {
      email: inputCred.email as string,
      password: inputCred.password as string
    };
    // For now a remedy but improve this
    // this.authService.flushToken()

    this.requestService.login(loginCred).subscribe({
      next: (res: LoginResponse) => {
        this.tokenService.setTokenInCookie(res.token);
        this.router.navigate(['/forward-view']);
      },
      error: err => {
        if (err.status === 401) {
          this.errMessage = 'Invalid Credentials'
        } else {
          this.errMessage = 'Error Logging in'
        }
      }
    });
  }


  redirectToForward(): void {
    console.log('Login successful, navigating to forward-view');
    this.router.navigate(['/forward-view']);
  }

}
