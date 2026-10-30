import {
  Component,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList,
  ElementRef,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastCtrl = inject(ToastController);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  email = '';
  maskedEmail = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  focusedIndex = 0;

  newPassword = '';
  confirmPassword = '';

  isLoading = false;
  isResending = false;
  showPassword = false;
  showConfirmPassword = false;

  countdown = 60;
  timer: any;
  canResend = false;

  hasMinLength = false;
  hasCapital = false;
  hasNumberOrSymbol = false;
  passwordsMatch = false;
  passwordStrength: 'Weak' | 'Medium' | 'Strong' = 'Weak';

  ngOnInit() {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as { email: string };
    this.email = state?.email || history.state?.email || '';

    if (!this.email) {
      this.router.navigate(['/forget-password']);
      return;
    }

    this.maskedEmail = this.maskEmail(this.email);
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  maskEmail(email: string): string {
    const [name, domain] = email.split('@');
    if (name.length <= 2) return email;
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  }

  startCountdown() {
    this.countdown = 60;
    this.canResend = false;
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.canResend = true;
        clearInterval(this.timer);
      }
    }, 1000);
  }

  get countdownText(): string {
    const m = Math.floor(this.countdown / 60)
      .toString()
      .padStart(2, '0');
    const s = (this.countdown % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  get otp(): string {
    return this.otpDigits.join('');
  }

  onOtpInput(event: any, index: number) {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').charAt(0) || '';
    input.value = '';
    if (!val) {
      this.otpDigits[index] = '';
      return;
    }
    this.otpDigits[index] = val;
    input.value = val;
    if (index < 5) {
      setTimeout(() => {
        const next = document.getElementById(
          `otp-${index + 1}`,
        ) as HTMLInputElement;
        next?.focus();
        this.focusedIndex = index + 1;
      }, 50);
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (this.otpDigits[index]) {
        this.otpDigits[index] = '';
        input.value = '';
      } else if (index > 0) {
        this.otpDigits[index - 1] = '';
        const prev = document.getElementById(
          `otp-${index - 1}`,
        ) as HTMLInputElement;
        if (prev) {
          prev.value = '';
          prev.focus();
          this.focusedIndex = index - 1;
        }
      }
    }
  }

  async resendCode() {
    if (!this.canResend) return;
    this.isResending = true;
    this.authService.forgetPassword(this.email).subscribe({
      next: async () => {
        this.isResending = false;
        await this.showToast('Code resent to ' + this.maskedEmail, 'success');
        this.startCountdown();
      },
      error: async (err) => {
        this.isResending = false;
        this.showToast(err.error?.message || 'Failed to resend', 'danger');
      },
    });
  }

  onPasswordInput() {
    const pwd = this.newPassword;
    this.hasMinLength = pwd.length >= 8;
    this.hasCapital = /[A-Z]/.test(pwd);
    this.hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
      pwd,
    );
    const score = [
      this.hasMinLength,
      this.hasCapital,
      this.hasNumberOrSymbol,
    ].filter(Boolean).length;
    if (score === 3) this.passwordStrength = 'Strong';
    else if (score === 2) this.passwordStrength = 'Medium';
    else this.passwordStrength = 'Weak';
    this.checkMatch();
  }

  checkMatch() {
    if (!this.confirmPassword) {
      this.passwordsMatch = false;
      return;
    }
    this.passwordsMatch = this.newPassword === this.confirmPassword;
  }

  async resetPassword() {
    if (this.otp.length !== 6) {
      this.showToast('Please enter 6-digit code', 'warning');
      return;
    }
    if (!this.hasMinLength || !this.hasCapital || !this.hasNumberOrSymbol) {
      this.showToast('Password does not meet requirements', 'warning');
      return;
    }
    if (!this.passwordsMatch) {
      this.showToast('Passwords do not match', 'warning');
      return;
    }
    this.isLoading = true;
    this.authService
      .resetPassword(this.otp, this.email, this.newPassword)
      .subscribe({
        next: async (res) => {
          this.isLoading = false;
          await this.showToast(
            res.message || 'Password reset successful',
            'success',
          );
          this.router.navigate(['/login']);
        },
        error: async (err) => {
          this.isLoading = false;
          this.showToast(err.error?.message || 'Invalid code', 'danger');
        },
      });
  }

  editEmail() {
    this.router.navigate(['/forget-password']);
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
