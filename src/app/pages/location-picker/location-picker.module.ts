import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationPickerPageRoutingModule } from './location-picker-routing.module';

import { LocationPickerPage } from './location-picker.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationPickerPageRoutingModule
  ],
  declarations: [LocationPickerPage]
})
export class LocationPickerPageModule {}
