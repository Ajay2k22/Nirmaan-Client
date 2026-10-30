import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewAllComplaintPage } from './view-all-complaint.page';

describe('ViewAllComplaintPage', () => {
  let component: ViewAllComplaintPage;
  let fixture: ComponentFixture<ViewAllComplaintPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAllComplaintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
