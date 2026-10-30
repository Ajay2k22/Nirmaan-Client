import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { ComplaintService } from '../../services/complaint.service';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

@Component({
  selector: 'app-create-complaint',
  templateUrl: './create-complaint.page.html',
  styleUrls: ['./create-complaint.page.scss'],
})
export class CreateComplaintPage implements AfterViewInit {
  title = '';
  description = '';
  selectedAddress = '';
  latitude = 19.1982;
  longitude = 73.1923;
  severity = 'low';
  severityEnum = 1;
  reason = '';
  summary = '';

  civicCategories = [
    { key: 'ROADS', enum: 1, label: 'Roads & Potholes', icon: 'construct' },
    { key: 'GARBAGE_WASTE', enum: 2, label: 'Garbage & Waste', icon: 'trash' },
    {
      key: 'DRAINAGE_SEWAGE',
      enum: 3,
      label: 'Drainage & Sewage',
      icon: 'water',
    },
    { key: 'STREET_LIGHT', enum: 4, label: 'Street Lights', icon: 'bulb' },
    { key: 'WATER_SUPPLY', enum: 5, label: 'Water Supply', icon: 'water' },
    { key: 'PUBLIC_TOILET', enum: 6, label: 'Public Toilet', icon: 'man' },
    { key: 'ENCROACHMENT', enum: 7, label: 'Encroachment', icon: 'business' },
    { key: 'PARK_GARDEN', enum: 8, label: 'Park & Garden', icon: 'leaf' },
    { key: 'TRAFFIC_SIGNAL', enum: 9, label: 'Traffic Signal', icon: 'car' },
    { key: 'STRAY_ANIMALS', enum: 10, label: 'Stray Animals', icon: 'paw' },
    {
      key: 'NOISE_POLLUTION',
      enum: 11,
      label: 'Noise Pollution',
      icon: 'volume-high',
    },
    {
      key: 'OTHER',
      enum: 99,
      label: 'Other Issue',
      icon: 'ellipsis-horizontal',
    },
  ];
  selectedCategory = 'WATER_SUPPLY';
  selectedCategoryEnum = 5;

  masterDataList: any[] = [];
  uniqueMncList: string[] = [];
  filteredDepts: any[] = [];
  mncDisplayList: { value: string; label: string }[] = [];
  deptDisplayList: { value: string; label: string }[] = [];
  mncCode = '';
  deptCode = '';

  // INLINE MODAL STATE - FIX FOR EMPTY MODAL
  showMncModal = false;
  showDeptModal = false;
  tempMnc = '';
  tempDept = '';

  photos: { file: File; preview: string; base64: string }[] = [];
  isSubmitting = false;
  map!: L.Map;
  marker!: L.Marker;

  constructor(
    private router: Router,
    private cs: ComplaintService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
  ) {}

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 500);
  }

  ionViewWillEnter() {
    const s = history.state as any;
    if (s?.lat) {
      this.latitude = s.lat;
      this.longitude = s.lng;
      this.selectedAddress = s.address;
      this.updateMap();
    }
    this.loadMaster();
  }

  loadMaster() {
    this.cs.getAllMasterData().subscribe({
      next: (res: any) => {
        this.masterDataList = res.data || [];
        const allMnc = this.masterDataList.map((m: any) => m.mnc_code);
        this.uniqueMncList = [...new Set(allMnc)] as string[];
        if (this.uniqueMncList.length === 0) {
          this.uniqueMncList = [
            'UlhasNagar',
            'Badlapur',
            'Thane',
            'Kalyan',
            'Ambernath',
          ];
        }
        this.mncDisplayList = this.uniqueMncList.map((m) => ({
          value: m,
          label: m.replace(/([a-z])([A-Z])/g, '$1 $2'),
        }));
        if (this.uniqueMncList.length > 0 && !this.mncCode) {
          this.mncCode = this.uniqueMncList[0];
          this.onMncChange();
        }
      },
      error: () => {
        this.uniqueMncList = [
          'UlhasNagar',
          'Badlapur',
          'Thane',
          'Kalyan',
          'Ambernath',
        ];
        this.mncDisplayList = this.uniqueMncList.map((m) => ({
          value: m,
          label: m.replace(/([a-z])([A-Z])/g, '$1 $2'),
        }));
        this.mncCode = this.uniqueMncList[0];
        this.filteredDepts = this.civicCategories.map((c) => ({
          dept_code: c.key,
        }));
        this.onMncChange();
      },
    });
  }

  onMncChange() {
    if (this.masterDataList.length > 0) {
      this.filteredDepts = this.masterDataList.filter(
        (m: any) => m.mnc_code === this.mncCode,
      );
    } else {
      this.filteredDepts = this.civicCategories.map((c) => ({
        dept_code: c.key,
      }));
    }
    this.deptDisplayList = this.filteredDepts.map((d: any) => {
      const found = this.civicCategories.find((c) => c.key === d.dept_code);
      return {
        value: d.dept_code,
        label: found
          ? found.label
          : d.dept_code
              .replace(/_/g, ' ')
              .toLowerCase()
              .replace(/\b\w/g, (l: any) => l.toUpperCase()),
      };
    });
    if (this.deptDisplayList.length > 0) {
      this.deptCode = this.deptDisplayList[0].value;
    }
  }

  getMncDisplayName(mnc: string): string {
    if (!mnc) return '';
    return mnc.replace(/([a-z])([A-Z])/g, '$1 $2');
  }
  getDeptDisplayName(deptCode: string): string {
    if (!deptCode) return '';
    const found = this.civicCategories.find((c) => c.key === deptCode);
    if (found) return found.label;
    return deptCode.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }
  getSelectedCategoryLabel(): string {
    const found = this.civicCategories.find(
      (c) => c.key === this.selectedCategory,
    );
    return found
      ? found.label
      : this.selectedCategory
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (l) => l.toUpperCase());
  }
  selectCategory(cat: any) {
    this.selectedCategory = cat.key;
    this.selectedCategoryEnum = cat.enum;
  }

  // INLINE MODAL LOGIC - 100% FIXED
  openMncModal() {
    if (this.mncDisplayList.length === 0) {
      const src = this.uniqueMncList.length
        ? this.uniqueMncList
        : ['UlhasNagar', 'Badlapur', 'Thane', 'Kalyan', 'Ambernath'];
      this.mncDisplayList = src.map((m: string) => ({
        value: m,
        label: m.replace(/([a-z])([A-Z])/g, '$1 $2'),
      }));
    }
    this.tempMnc = this.mncCode;
    this.showMncModal = true;
  }
  closeMncModal() {
    this.showMncModal = false;
  }
  confirmMncModal() {
    if (this.tempMnc) {
      this.mncCode = this.tempMnc;
      this.onMncChange();
    }
    this.showMncModal = false;
  }
  selectTempMnc(opt: any) {
    this.tempMnc = opt.value;
  }

  openDeptModal() {
    if (!this.mncCode) return;
    this.tempDept = this.deptCode;
    this.showDeptModal = true;
  }
  closeDeptModal() {
    this.showDeptModal = false;
  }
  confirmDeptModal() {
    if (this.tempDept) this.deptCode = this.tempDept;
    this.showDeptModal = false;
  }
  selectTempDept(opt: any) {
    this.tempDept = opt.value;
  }

  // MAP
  initMap() {
    const el = document.getElementById('map-mini');
    if (!el || this.map) return;
    this.map = L.map('map-mini', { zoomControl: false }).setView(
      [this.latitude, this.longitude],
      15,
    );
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
    this.marker = L.marker([this.latitude, this.longitude], {
      draggable: true,
    }).addTo(this.map);
    this.map.on('click', (e: any) => {
      this.latitude = e.latlng.lat;
      this.longitude = e.latlng.lng;
      this.marker.setLatLng(e.latlng);
      this.reverseGeocode();
    });
    this.marker.on('dragend', () => {
      const p = this.marker.getLatLng();
      this.latitude = p.lat;
      this.longitude = p.lng;
      this.reverseGeocode();
    });
    setTimeout(() => this.map.invalidateSize(), 300);
  }
  updateMap() {
    if (this.map) {
      this.map.setView([this.latitude, this.longitude], 15);
      this.marker.setLatLng([this.latitude, this.longitude]);
    }
  }
  async myLocation() {
    try {
      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      this.latitude = pos.coords.latitude;
      this.longitude = pos.coords.longitude;
      this.updateMap();
      this.reverseGeocode();
    } catch {}
  }
  async reverseGeocode() {
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.latitude}&lon=${this.longitude}`,
      );
      const d = await r.json();
      this.selectedAddress = d.display_name;
    } catch {}
  }

  onFileSelected(e: any) {
    const file = e.target.files[0] as File;
    if (!file || this.photos.length >= 4) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.photos.push({
        file,
        preview: reader.result as string,
        base64: reader.result as string,
      });
      if (this.photos.length === 1) this.detectImage(file);
    };
    reader.readAsDataURL(file);
  }
  removePhoto(i: number) {
    this.photos.splice(i, 1);
  }

  // === AUTO SELECT LOGIC - FINAL FIX ===
  async detectImage(file: File) {
    const loader = await this.loadingCtrl.create({
      message: 'AI Analyzing...',
    });
    await loader.present();
    this.cs.detectImage(file).subscribe({
      next: async (r: any) => {
        await loader.dismiss();
        console.log('AI Response:', r);
        this.reason = r.message || r.reason || '';
        this.summary = r.message || r.reason || '';

        // SEVERITY AUTO-SELECT
        if (r.severity) {
          const sevStr = r.severity.toString().toUpperCase();
          const sevLower = sevStr.toLowerCase();
          if (['low', 'medium', 'high'].includes(sevLower))
            this.severity = sevLower;
          const map: any = { LOW: 1, MEDIUM: 2, HIGH: 3 };
          this.severityEnum = map[sevStr] || 1;
        }

        // CATEGORY AUTO-SELECT
        if (r.category) {
          const catKey = r.category.toString().toUpperCase().trim();
          const found = this.civicCategories.find((c) => c.key === catKey);
          if (found) {
            this.selectedCategory = found.key;
            this.selectedCategoryEnum = found.enum;
          }
        }

        // ONLY DESCRIPTION AUTO-FILLS, TITLE STAYS FOR USER
        if (!this.description) {
          this.description = this.summary;
        }
        // Title is NOT auto-filled - user will type manually as per your requirement

        (
          await this.toastCtrl.create({
            message: `AI Detected: ${this.getSelectedCategoryLabel()} | ${this.severity.toUpperCase()}`,
            duration: 3000,
            color: 'success',
          })
        ).present();
      },
      error: async () => {
        await loader.dismiss();
      },
    });
  }

  async submitComplaint() {
    if (!this.title || !this.description || this.photos.length === 0) {
      (
        await this.toastCtrl.create({
          message: 'Title, Description & Photo required',
          duration: 2000,
        })
      ).present();
      return;
    }
    this.isSubmitting = true;
    const loader = await this.loadingCtrl.create({ message: 'Submitting...' });
    await loader.present();

    // FINAL DTO - CAPS STRING ONLY
    const dto = {
      Title: this.title,
      Description: this.description,
      Photo: this.photos[0].base64,
      MncCode: this.mncCode, // "UlhasNagar"
      DeptCode: this.deptCode, // "OTHER"
      Category: this.selectedCategory, // "ENCROACHMENT" - CAPS STRING
      Severity: this.severity.toUpperCase(), // "LOW" / "MEDIUM" / "HIGH" - CAPS
      Longitude: this.longitude,
      Latitude: this.latitude,
      Summary: this.summary || this.description,
      Address: this.selectedAddress,
      Reason: this.reason,
      UserId: localStorage.getItem('userId') || '',
    };

    console.log('FINAL DTO TO BACKEND:', dto);

    this.cs.createComplaint(dto).subscribe({
      next: async () => {
        await loader.dismiss();
        this.isSubmitting = false;
        (
          await this.toastCtrl.create({
            message: 'Grievance Submitted!',
            duration: 2000,
          })
        ).present();
        this.router.navigateByUrl('/dashboard');
      },
      error: async (e: any) => {
        await loader.dismiss();
        this.isSubmitting = false;
        (
          await this.toastCtrl.create({
            message: e.error?.message || 'Failed',
            duration: 2000,
          })
        ).present();
      },
    });
  }

  goBack() {
    this.router.navigateByUrl('/dashboard');
  }
}
