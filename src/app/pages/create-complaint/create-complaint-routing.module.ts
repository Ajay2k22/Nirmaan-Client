import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateComplaintPage } from './create-complaint.page';

const routes: Routes = [
  {
    path: '',
    component: CreateComplaintPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateComplaintPageRoutingModule {}
