import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminOrdersComponent } from './pages/admin-orders/admin-orders.component';
import { AdminGuard } from 'src/app/core/helpers/guards/admin.guard';
import { AdminProductsComponent } from './pages/admin-products/admin-products.component';
import { AdminProductEditComponent } from './pages/admin-product-edit/admin-product-edit.component';
import { AdminUsersComponent } from './pages/admin-users/admin-users.component';
import { AdminUserEditComponent } from './pages/admin-user-edit/admin-user-edit.component';

const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: 'orders', component: AdminOrdersComponent, canActivate: [AdminGuard], },
  { path: 'products', component: AdminProductsComponent, canActivate: [AdminGuard], },
  { path: 'product/:id', component: AdminProductEditComponent, canActivate: [AdminGuard], },
  { path: 'users', component: AdminUsersComponent, canActivate: [AdminGuard], },
  { path: 'user/:id', component: AdminUserEditComponent, canActivate: [AdminGuard], },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule { }
