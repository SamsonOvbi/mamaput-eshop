import { NgModule, OnDestroy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseLocationLeafComponent } from './choose-location-leaf.component';

const chooseLocationRoutes: Routes = [{ path: '', component: ChooseLocationLeafComponent }];

@NgModule({
  imports: [RouterModule.forChild(chooseLocationRoutes)],
  exports: [RouterModule]
})
export class ChooseLocationLeafRoutingModule  {}
