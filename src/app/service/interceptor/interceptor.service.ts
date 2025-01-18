import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { SnackbarService } from '../snackbar.service';


export const loggingInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {

  const authToken = inject(AuthService).getToken();
  const cloned = req.clone({
    setHeaders: { Authorization: `Bearer ${authToken}` }
  });
  return next(cloned);
};


export const UnauthorizedInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackbarService = inject(SnackbarService);



  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log("error: ", error)

      if (error.status === 401 && error.error === "Unauthorized use of API!") {
        snackbarService.showSnackbar('Unauthorized used of API!')
        authService.flushToken();
        router.navigate(['login'])
      }

      return throwError(error);
    })
  )
}



// export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
//   return next(req).pipe(tap(event => {
//     if (event.type === HttpEventType.Response) {
//       console.log(req.url, 'returned a response with status', event.status);
//     }
//   }));
// }
