import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material.module';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { ForgotPasswordComponent } from './dialogs/forgot-password/forgot-password.component';
import { AuthRoutingModule } from './auth-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const componentsList = [
  LoginComponent,
  ProfileComponent,
  RegisterComponent,
  ForgotPasswordComponent
];

const modulesList = [
  CommonModule,
  FormsModule, ReactiveFormsModule,
  MaterialModule,
  AuthRoutingModule,
  BrowserAnimationsModule,
]

@NgModule({
  declarations: [componentsList, ],
  imports: [ modulesList, ],
  exports: [ componentsList, AuthRoutingModule ]
})
export class AuthModule { }
