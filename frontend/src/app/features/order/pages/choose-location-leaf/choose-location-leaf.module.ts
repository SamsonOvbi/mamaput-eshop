import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { GoogleMapsModule } from '@angular/google-maps';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS, } from '@angular/material/snack-bar';
import { ChooseLocationLeafRoutingModule } from './choose-location-leaf-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChooseLocationLeafComponent } from './choose-location-leaf.component';

const componentsList = [
  ChooseLocationLeafComponent,
]

@NgModule({
  declarations: [componentsList],
  imports: [
    CommonModule,
    ChooseLocationLeafRoutingModule,
    MatProgressBarModule, MatProgressSpinnerModule,
    MatSnackBarModule, MatButtonModule,
  ],
  exports: [ChooseLocationLeafRoutingModule, componentsList],
  providers: [],
})
export class ChooseLocationLeafModule { }
