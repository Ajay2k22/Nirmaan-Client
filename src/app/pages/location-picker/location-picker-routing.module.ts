import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationPickerPage } from './location-picker.page';

const routes: Routes = [
  {
    path: '',
    component: LocationPickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationPickerPageRoutingModule {}
