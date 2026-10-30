import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      // Already logged in -> don't allow login/register/forget/reset
      this.router.navigate(['/dashboard']); // or /home
      return false;
    } else {
      return true;
    }
  }
}
