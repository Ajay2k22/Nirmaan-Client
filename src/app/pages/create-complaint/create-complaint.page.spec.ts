import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateComplaintPage } from './create-complaint.page';

describe('CreateComplaintPage', () => {
  let component: CreateComplaintPage;
  let fixture: ComponentFixture<CreateComplaintPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComplaintPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
