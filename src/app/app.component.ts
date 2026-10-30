import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setInterval(() => {
      const loginTime = localStorage.getItem('login_time');
      const token = localStorage.getItem('token');
      if (!token || !loginTime) return;
      const diff = Date.now() - parseInt(loginTime, 10);
      const EIGHT_MIN = 8 * 60 * 1000;
      if (diff > EIGHT_MIN) {
        localStorage.clear();
        this.router.navigateByUrl('/login', { replaceUrl: true });
      }
    }, 30000);
  }
}
