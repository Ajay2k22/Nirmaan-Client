import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { _BASE_URL } from '../../core/constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class ComplaintService {
  private baseUrl = `${_BASE_URL}/Complaint`;
  private adminUrl = `${_BASE_URL}/Admin`;
  private geminiUrl = `${_BASE_URL}/Gemini`;

  private complaintsSubject = new BehaviorSubject<any[]>([]);
  public complaints$ = this.complaintsSubject.asObservable();
  private isLoaded = false;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Load complaints - FIXED to always return same shape
  loadComplaintsOnce(): Observable<any> {
    if (this.isLoaded) {
      return this.complaints$.pipe(map((data) => ({ data: data })));
    }

    return this.http
      .get<any>(`${this.baseUrl}/getComplaintByUserId`, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((response) => {
          const rawData = response.data || response;
          if (Array.isArray(rawData)) {
            const mapped = rawData.map((item: any) => ({
              complaintId: item.complaintId || item.ComplaintId,
              title: item.title || item.Title,
              description: item.description || item.Description,
              status: item.status || item.Status,
              address: item.address || item.Address,
              photo: item.photo || item.Photo,
              CreatedAt: item.createdAt || new Date(),
              severity: item.severity,
              mnc: item.mnc || item.MNC,
              dept: item.dept || item.DEPT,
              category: item.category,
              // resolvedProofImg: item.resolvedProofImg,
            }));
            this.complaintsSubject.next(mapped);
            this.isLoaded = true;
          }
        }),
      );
  }

  getComplaintsFromState(): Observable<any[]> {
    return this.complaints$;
  }

  clearState() {
    this.complaintsSubject.next([]);
    this.isLoaded = false;
  }

  addToState(newComplaint: any) {
    const current = this.complaintsSubject.value;
    this.complaintsSubject.next([newComplaint, ...current]);
  }

  // 1. Get Master Data - NO BLOB
  getAllMasterData(): Observable<any> {
    return this.http.get<any>(`${this.adminUrl}/getAllMasterData`, {
      headers: this.getAuthHeaders(),
    });
  }

  // 2. Detect Image - Takes File directly, NO base64ToBlob needed
  detectImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file, file.name);

    // IMPORTANT: Don't set Content-Type, browser will set multipart/form-data
    const headers = this.getAuthHeaders();

    return this.http.post<any>(`${this.geminiUrl}/detectImage`, formData, {
      headers,
    });
  }

  // 3. Create Complaint - Photo as base64 string (as per your DTO)
  createComplaint(dto: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/create`, dto, {
        headers: this.getAuthHeaders(),
      })
      .pipe(
        tap((res) => {
          const newId =
            res.complaintId || res.data?.complaintId || Date.now().toString();
          this.addToState({
            complaintId: newId,
            title: dto.Title,
            description: dto.Description,
            status: 'PENDING',
            address: dto.Address,
            photo: dto.Photo,
            CreatedAt: new Date(),
          });
        }),
      );
  }

  // 4. COMPLETED: Get Complaint By ComplaintId (with Comments if API returns them)
  getComplaintByComplaintId(complaintId: string): Observable<any> {
    const params = new HttpParams().set('ComplaintId', complaintId);
    return this.http
      .get<any>(`${this.baseUrl}/getComplaintByUserAndComplaintId`, {
        headers: this.getAuthHeaders(),
        params,
      })
      .pipe(
        map((response: any) => {
          const data = response.data || response;
          return {
            complaintId: data.complaintId || data.ComplaintId,
            title: data.title || data.Title,
            description: data.description || data.Description,
            photo: data.photo || data.Photo,
            resolveImg: data.resolveImg || data.ResolveImg,
            status: data.status || data.Status,
            address: data.address || data.Address,
            severity: data.severity || data.Severity,
            summary: data.summary || data.Summary,
            reason: data.reason || data.Reason,
            longitude: data.longitude || data.Longitude,
            latitude: data.latitude || data.Latitude,
            mnc: data.mnc || data.MNC,
            dept: data.dept || data.DEPT,
            comments: data.comments || data.Comments || [],
            createdAt: data.createdAt || data.CreatedAt,
            resolvedProofImg: data.resolvedProofImg,
          };
        }),
      );
  }

  // Optional: If you have separate comment endpoint
  getCommentsByComplaintId(complaintId: string): Observable<any> {
    const params = new HttpParams().set('ComplaintId', complaintId);
    return this.http
      .get<any>(`${this.baseUrl}/getCommentsByComplaintId`, {
        headers: this.getAuthHeaders(),
        params,
      })
      .pipe(map((res) => res.data || res));
  }
}
