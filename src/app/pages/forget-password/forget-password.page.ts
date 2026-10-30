import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.page.html',
  styleUrls: ['./forget-password.page.scss'],
})
export class ForgetPasswordPage {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  email = '';
  isLoading = false;

  async forgetPassword() {
    const email = this.email.trim();
    if (!email) {
      this.showToast('Please enter email', 'warning');
      return;
    }

    this.isLoading = true;
    this.authService.forgetPassword(email).subscribe({
      next: async (res) => {
        this.isLoading = false;
        await this.showToast(res.message, 'success');

        // PASS DATA VIA STATE - email goes hidden
        this.router.navigate(['/reset-password'], {
          state: {
            email: email,
          },
        });
      },
      error: async (err) => {
        this.isLoading = false;
        this.showToast(err.error?.message || 'Failed', 'danger');
      },
    });
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
