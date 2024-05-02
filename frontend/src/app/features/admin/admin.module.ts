import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgChartsModule } from 'ng2-charts';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { AdminProductEditComponent } from './pages/admin-product-edit/admin-product-edit.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminUserEditComponent } from './pages/admin-user-edit/admin-user-edit.component';

const componentsList = [
  AdminDashboardComponent,
  AdminOrdersComponent,
  AdminProductsComponent,
  AdminProductEditComponent,
  AdminUsersComponent,
  AdminUserEditComponent,

]

@NgModule({
  declarations: [componentsList],
  imports: [
    NgChartsModule,
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MaterialModule,
    AdminRoutingModule,
  ],
  exports: [componentsList, AdminRoutingModule,]
})
export class AdminModule { }
