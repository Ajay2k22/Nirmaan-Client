import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationPickerPage } from './location-picker.page';

describe('LocationPickerPage', () => {
  let component: LocationPickerPage;
  let fixture: ComponentFixture<LocationPickerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPickerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
