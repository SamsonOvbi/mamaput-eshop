import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RatingComponent } from './components/rating/rating.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// helpers
import { JwtInterceptor } from './helpers/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './helpers/interceptors/error.interceptor';

const routes: Routes = []
const componentsList = [
  FooterComponent, HeaderComponent, SideBarComponent, RatingComponent,
];
const modulesList = [
  CommonModule, MaterialModule, FormsModule, ReactiveFormsModule,
  RouterModule.forChild(routes),
];

@NgModule({
  declarations: [componentsList],
  imports: [modulesList,],
  providers: [
    // { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500, verticalPosition: 'top' }, },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  exports: [CommonModule, componentsList]
})
export class CoreModule { }
