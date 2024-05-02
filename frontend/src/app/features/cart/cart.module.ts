import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartListComponent } from './pages/cart-list/cart-list.component';
import { CartTableComponent } from './component/cart-table/cart-table.component';
import { CartRoutingModule } from './cart-routing.module';
import { MaterialModule } from 'src/app/shared/material.module';
import { SharedModule } from 'src/app/shared/shared.module';

const componentsList = [CartListComponent, CartTableComponent];

@NgModule({
  declarations: componentsList,
  imports: [
    CommonModule, CartRoutingModule, MaterialModule, SharedModule
  ],
  exports: componentsList
})
export class CartModule { }
