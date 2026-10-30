import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  email = '';
  password = '';
  showPassword = false;
  remember = true;
  isLoading = false;

  toggleRemember() {
    this.remember = !this.remember;
    console.log('Remember:', this.remember);
  }

  login() {
    if (!this.email || !this.password) {
      this.showToast('Email and Password required', 'warning');
      return;
    }

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: async (res) => {
        this.isLoading = false;
        await this.showToast('Login Successful', 'success');
        this.router.navigate(['/dashboard']);
      },
      error: async (err) => {
        this.isLoading = false;
        const msg = err.error?.message || 'Invalid credentials';
        this.showToast(msg, 'danger');
        console.log(err);
      },
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToForgot() {
    this.router.navigate(['/forget-password']);
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}
