import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  FirstName = '';
  LastName = '';
  Email = '';
  Password = '';
  ConfirmPassword = '';
  IsCitizen = true;
  isLoading = false;
  showPassword = false;
  showConfirm = false;
  agreeTerms = false;

  async register() {
    // 1. Validate not empty
    if (
      !this.FirstName ||
      !this.LastName ||
      !this.Email ||
      !this.Password ||
      !this.ConfirmPassword
    ) {
      this.showToast('All fields are required', 'warning');
      return;
    }

    // 3. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.Email)) {
      this.showToast('Please enter valid email', 'warning');
      return;
    }

    // 2. Validate password & confirm password
    if (this.Password !== this.ConfirmPassword) {
      this.showToast('Password and Confirm Password do not match', 'warning');
      return;
    }

    if (this.Password.length < 6) {
      this.showToast('Password must be at least 6 characters', 'warning');
      return;
    }

    if (!this.agreeTerms) {
      this.showToast('Please Accept terms and Policy.', 'warning');
      return;
    }

    this.isLoading = true;

    const payload = {
      FirstName: this.FirstName,
      LastName: this.LastName,
      Email: this.Email,
      Password: this.Password,
      IsCitizen: this.IsCitizen,
    };

    this.authService.register(payload).subscribe({
      next: async (res: any) => {
        this.isLoading = false;
        console.log(res);
        await this.showToast(
          res.message || 'User registered successfully',
          'success',
        );
        // 5. Redirect to login
        this.router.navigate(['/login']);
      },
      error: async (err) => {
        this.isLoading = false;
        console.log(err);
        const msg =
          err.error?.message || err.error?.errors || 'Registration failed';
        await this.showToast(
          typeof msg === 'string' ? msg : JSON.stringify(msg),
          'danger',
        );
      },
    });
  }

  toggleCitizen() {
    this.IsCitizen = !this.IsCitizen;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'top',
    });
    toast.present();
  }
}
