import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComplaintService } from '../../services/complaint.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-view-complaint',
  templateUrl: './view-complaint.page.html',
  styleUrls: ['./view-complaint.page.scss'],
})
export class ViewComplaintPage implements OnInit {
  complaintId: string | null = null;
  complaint: any = null;
  isLoading = true;
  errorMsg = '';

  constructor(
    private route: ActivatedRoute,
    private complaintService: ComplaintService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      const idFromParam = params.get('id') || params.get('complaintId');
      const idFromQuery = this.route.snapshot.queryParamMap.get('ComplaintId');
      this.complaintId = idFromParam || idFromQuery;
      if (this.complaintId) {
        this.loadComplaintDetails(this.complaintId);
      } else {
        this.isLoading = false;
        this.errorMsg = 'Complaint ID not found in route';
      }
    });
  }

  loadComplaintDetails(complaintId: string): void {
    this.isLoading = true;
    this.complaintService.getComplaintByComplaintId(complaintId).subscribe({
      next: (data: any) => {
        this.complaint = data;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || 'Failed to load';
        this.isLoading = false;
      },
    });
  }

  getShortId(): string {
    if (!this.complaint?.complaintId) return 'RSL-8492';
    return this.complaint.complaintId.substring(0, 8).toUpperCase();
  }

  getDeptName(): string {
    if (!this.complaint?.dept) return 'Water Supply & Sewage';
    return this.complaint.dept.replace('_', ' & ');
  }

  getAttachmentCount(): number {
    let count = 0;
    if (this.complaint?.photo) count++;
    if (this.complaint?.resolveImg) count++;
    return count || 2;
  }

  async copyId(id: string): Promise<void> {
    if (!id) return;
    await navigator.clipboard.writeText(id);
    const toast = await this.toastCtrl.create({
      message: 'Complaint ID copied',
      duration: 1200,
      color: 'dark',
    });
    toast.present();
  }

  doRefresh(event: any): void {
    if (this.complaintId) {
      this.complaintService
        .getComplaintByComplaintId(this.complaintId)
        .subscribe({
          next: (data: any) => {
            this.complaint = data;
            event.target.complete();
          },
          error: () => event.target.complete(),
        });
    } else {
      event.target.complete();
    }
  }
}
