import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateComplaintPageRoutingModule } from './create-complaint-routing.module';

import { CreateComplaintPage } from './create-complaint.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateComplaintPageRoutingModule
  ],
  declarations: [CreateComplaintPage]
})
export class CreateComplaintPageModule {}
