import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { RatingComponent } from './components/rating/rating.component';
import { SideBarComponent } from './components/side-bar/side-bar.component';

const coreRoutes: Routes = []
const componentsList = [
  FooterComponent, HeaderComponent, SideBarComponent, RatingComponent,
];
const modulesList = [
  CommonModule, MaterialModule, FormsModule, ReactiveFormsModule,
  RouterModule.forChild(coreRoutes),
];

@NgModule({
  declarations: [componentsList],
  imports: [modulesList,],
  exports: [CommonModule, componentsList]
})
export class CoreModule { }
