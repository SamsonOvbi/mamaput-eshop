import { NgModule, OnDestroy } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChooseLocationLeafComponent } from './choose-location-leaf.component';

<<<<<<< HEAD
const chooseLocationRoutes: Routes = [{ path: '', component: ChooseLocationLeafComponent }];

@NgModule({
  imports: [RouterModule.forChild(chooseLocationRoutes)],
=======
const routes: Routes = [{ path: '', component: ChooseLocationLeafComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  exports: [RouterModule]
})
export class ChooseLocationLeafRoutingModule  {}
