import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAllComplaintPage } from './view-all-complaint.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAllComplaintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAllComplaintPageRoutingModule {}
