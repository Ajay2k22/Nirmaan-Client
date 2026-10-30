import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {

  /*

    login(email,password){
        1.validate email and password is not empty.
        2.call an service app login(email,password).
        3.on success => redirect to Dashboard page.
        4.on fail show invalid creds on toaster
    }

  */

}
