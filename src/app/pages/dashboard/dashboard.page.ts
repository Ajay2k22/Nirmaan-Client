import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@capacitor/geolocation';
import { ComplaintService } from '../../services/complaint.service';
import {
  CIVIC_CATEGORIES,
  CivicCategoryUI,
  CivicCategory,
} from '../../models/civic-category.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  allComplaints: any[] = [];
  filteredComplaints: any[] = [];
  recentComplaints: any[] = [];

  // Use UI model instead of string
  civicCategories = CIVIC_CATEGORIES;
  selectedCategory: CivicCategoryUI | null = null;

  activeCount = 0;
  pendingCount = 0;
  fixedCount = 0;
  rejectedCount = 0;
  firstName = 'User';
  currentLocationText = 'Locating...';
  isLocating = false;

  constructor(
    private router: Router,
    private complaintService: ComplaintService,
  ) {}

  ngOnInit() {
    this.loadUserName();
    this.loadFromAPI();
    this.getCurrentLocation();
  }

  loadUserName() {
    const stored =
      localStorage.getItem('firstname') ||
      localStorage.getItem('firstName') ||
      localStorage.getItem('first_name');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.firstName =
          typeof parsed === 'object'
            ? parsed.firstname || parsed.firstName || stored
            : parsed;
      } catch {
        this.firstName = stored;
      }
    }
    if (this.firstName) {
      this.firstName =
        this.firstName.charAt(0).toUpperCase() + this.firstName.slice(1);
    }
  }

  loadFromAPI() {
    this.complaintService.loadComplaintsOnce().subscribe({
      next: (res: any) => {
        const raw = res.data || res;
        this.allComplaints = raw.map((item: any) => ({
          ...item,
          CreatedAt: new Date(),
        }));
        this.filteredComplaints = this.allComplaints;
        this.recentComplaints = this.allComplaints.slice(0, 3);
        this.calculateStats();
      },
      error: (err) => {
        console.error('API failed', err);
        this.allComplaints = [];
        this.calculateStats();
      },
    });
  }

  calculateStats() {
    this.activeCount = this.allComplaints.filter(
      (c) => c.status === 'IN_PROGRESS',
    ).length;
    this.pendingCount = this.allComplaints.filter(
      (c) => c.status === 'PENDING',
    ).length;
    this.fixedCount = this.allComplaints.filter(
      (c) => c.status === 'RESOLVED',
    ).length;
    this.rejectedCount = this.allComplaints.filter(
      (c) => c.status === 'REJECTED',
    ).length;
  }

  async getCurrentLocation() {
    this.isLocating = true;
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`,
      );
      const data = await response.json();
      const area =
        data.address.suburb ||
        data.address.neighbourhood ||
        data.address.road ||
        '';
      const city =
        data.address.city ||
        data.address.town ||
        data.address.village ||
        'Ambarnath';
      this.currentLocationText = area
        ? `${area} • ${city}`
        : `${city} • Central Zone`;
    } catch {
      this.currentLocationText = 'Ambarnath West • Central Zone';
    } finally {
      this.isLocating = false;
    }
  }

  refreshLocation() {
    this.getCurrentLocation();
  }

  // NEW - Using enum key + value
  onCategoryClick(cat: CivicCategoryUI) {
    if (this.selectedCategory?.key === cat.key) {
      this.clearFilter();
      return;
    }
    this.selectedCategory = cat;

    // Filter logic: supports both numeric enum (1,2,3) and string key (ROADS, WATER_SUPPLY)
    this.filteredComplaints = this.allComplaints.filter((c) => {
      const complaintCat =
        c.category ?? c.dept ?? c.Category ?? c.civicCategory;
      if (!complaintCat) return false;

      // Check if complaint has numeric value, string key, or readable name
      return (
        complaintCat === cat.key ||
        complaintCat === cat.value ||
        complaintCat?.toString().toUpperCase() === cat.key ||
        c.dept === cat.key // fallback for dept field
      );
    });
  }

  clearFilter() {
    this.selectedCategory = null;
    this.filteredComplaints = this.allComplaints;
  }

  // Navigation
  raiseComplaint() {
    this.router.navigateByUrl('/createComplaint');
  }
  goHome() {
    this.router.navigateByUrl('/dashboard');
  }
  goToCreateComplaint() {
    this.router.navigateByUrl('/createComplaint');
  }
  goTickets() {
    this.router.navigateByUrl('/tickets');
  }

  viewComplaint(id: string) {
    // this.router.navigate(['/view-complaint', id]);
    this.router.navigate(['/home/view-complaint', id]);
  }
}
