import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isHandling401 = false;

  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // YOUR CASE: backend sends 401 but with ERR_INCOMPLETE_CHUNKED_ENCODING
        // Angular converts it to status 0
        const isAuthError = err.status === 401 || err.status === 0;

        if (isAuthError && !this.isHandling401) {
          // Only logout if we actually sent a token (don't logout login API itself)
          const hadToken = !!localStorage.getItem('token');
          const isApiCall = err.url?.includes('/api/');

          if (hadToken && isApiCall) {
            this.isHandling401 = true;
            console.warn(
              'Auth failed (status',
              err.status,
              ') - Clearing storage',
            );

            localStorage.clear();
            sessionStorage.clear();

            this.router.navigate(['/login'], { replaceUrl: true }).then(() => {
              setTimeout(() => (this.isHandling401 = false), 1000);
            });
          }
        }
        return throwError(() => err);
      }),
    );
  }
}
