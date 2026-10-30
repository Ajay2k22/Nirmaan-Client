import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, finalize } from 'rxjs/operators';
import { _BASE_URL } from '../../core/constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${_BASE_URL}/Auth`;
  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string) {
    return this.http
      .post<any>(`${this.apiUrl}/login`, {
        Email: email,
        Password: password,
      })
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId || res.id);
          localStorage.setItem('firstname', res.firstName);
          localStorage.setItem('login_time', Date.now().toString()); // <-- ADD THIS
        }),
      );
  }

  register(data: {
    FirstName: string;
    LastName: string;
    Email: string;
    Password: string;
    IsCitizen: boolean;
  }) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  forgetPassword(email: string) {
    return this.http.post<any>(`${this.apiUrl}/forget-pwd`, {
      Email: email,
    });
  }

  resetPassword(otp: string, email: string, newPassword: string) {
    return this.http.post<any>(`${this.apiUrl}/reset-pwd`, {
      Email: email,
      Pwd: newPassword,
      UniqueCode: otp,
    });
  }

  getUserId() {
    return localStorage.getItem('userId');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const loginTime = localStorage.getItem('login_time');

    if (!token || !loginTime) {
      return false;
    }

    const diff = Date.now() - parseInt(loginTime, 10);
    const EIGHT_MIN = 8 * 60 * 1000;

    if (diff > EIGHT_MIN) {
      // Expired - clear and logout
      localStorage.clear();
      return false;
    }

    return true;
  }

  logout() {
    const token = localStorage.getItem('token');
    return this.http
      .post(
        `${this.apiUrl}/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .pipe(
        finalize(() => {
          this.clearAndRedirect();
        }),
      );
  }

  clearAndRedirect() {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
