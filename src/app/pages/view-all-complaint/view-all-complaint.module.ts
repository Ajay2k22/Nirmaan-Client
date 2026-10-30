import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAllComplaintPageRoutingModule } from './view-all-complaint-routing.module';

import { ViewAllComplaintPage } from './view-all-complaint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAllComplaintPageRoutingModule
  ],
  declarations: [ViewAllComplaintPage]
})
export class ViewAllComplaintPageModule {}
