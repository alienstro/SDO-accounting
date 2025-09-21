import { Component } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { TokenService } from '../service//token.service';
import { RequestService } from '../service/request.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  errMessage = '';

  constructor(
    private requestService: RequestService,
    private tokenService: TokenService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {}

  userLogin = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  onLogin() {
    this.errMessage = '';
    const inputCred = this.userLogin.getRawValue();

    if (!inputCred.email || !inputCred.password) return;

    const loginCred: LoginRequest = {
      email: inputCred.email as string,
      password: inputCred.password as string,
    };

    this.requestService.login(loginCred).subscribe({
      next: (res: LoginResponse) => {
        this.tokenService.setToken(res.token);
        const roleId = Number(
          this.tokenService.userRoleToken(this.tokenService.decodeToken())
        );

        console.log('roleId accounting page: ', roleId);
        if (roleId === 4) {
          this.router.navigate(['/application']);
          this.snackbar.open('Successfully Logged In', 'Close', {
            duration: 3000,
          });
        } else {
          this.errMessage = 'No Access';
          this.snackbar.open('Unauthorized Access', 'Close', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        this.snackbar.open(
          'Email or password is incorrect. Please try again.',
          'Close',
          { duration: 3000 }
        );
        console.error('Error creating user: ', error);
      },
    });
  }
}
