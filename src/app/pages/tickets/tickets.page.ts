import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit, OnDestroy {
  allTickets: any[] = [];
  filteredTickets: any[] = [];
  selectedStatus = 'ALL';
  searchText = '';
  isLoading = true;
  private sub!: Subscription;
  constructor(
    private complaintService: ComplaintService,
    public router: Router,
  ) {}
  ngOnInit() {
    this.loadTickets();
  }
  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
  loadTickets() {
    this.sub = this.complaintService.getComplaintsFromState().subscribe((d) => {
      if (d?.length > 0) {
        this.allTickets = d;
        this.applyFilters();
        this.isLoading = false;
      } else {
        this.complaintService
          .loadComplaintsOnce()
          .subscribe({
            next: () => (this.isLoading = false),
            error: () => (this.isLoading = false),
          });
      }
    });
  }
  applyFilters() {
    let t = [...this.allTickets];
    if (this.selectedStatus !== 'ALL')
      t = t.filter((x) => x.status === this.selectedStatus);
    if (this.searchText.trim()) {
      const q = this.searchText.toLowerCase();
      t = t.filter(
        (x) =>
          (x.complaintId || '').toLowerCase().includes(q) ||
          (x.title || '').toLowerCase().includes(q),
      );
    }
    this.filteredTickets = t;
  }
  onSearchChange(e: any) {
    this.searchText = e.target.value;
    this.applyFilters();
  }
  filterByStatus(s: string) {
    this.selectedStatus = s;
    this.applyFilters();
  }
  getStatusCount(s: string) {
    return s === 'ALL'
      ? this.allTickets.length
      : this.allTickets.filter((x) => x.status === s).length;
  }
  getCategory(c: string) {
    const m: any = {
      WATER_SUPPLY: 'Water Supply',
      DRAINAGE_SEWAGE: 'Drainage & Sewage',
      STREET_LIGHT: 'Street Lighting',
      GARBAGE_WASTE: 'Waste Management',
      ROADS_POTHOLES: 'Roads & Pavements',
    };
    return m[c] || c;
  }
  getIcon(c: string) {
    const m: any = {
      WATER_SUPPLY: 'water-outline',
      DRAINAGE_SEWAGE: 'water-outline',
      STREET_LIGHT: 'bulb-outline',
      GARBAGE_WASTE: 'trash-outline',
      ROADS_POTHOLES: 'construct-outline',
    };
    return m[c] || 'alert-circle-outline';
  }
  openTicket(t: any) {
    this.router.navigate(['/home/view-complaint', t.complaintId]);
  }
  goHome() {
    this.router.navigate(['/home/dashboard']);
  }
  goCreate() {
    this.router.navigate(['/home/create-complaint']);
  }
}
