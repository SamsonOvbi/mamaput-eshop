import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/helpers/guards/auth.guard';
import { AdminGuard } from './core/helpers/guards/admin.guard';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./features/products/products.module').then((m) => m.ProductsModule), },
  { path: 'cart', loadChildren: () => import('./features/cart/cart.module').then((m) => m.CartModule), },
  { path: 'auth', canActivate: [AdminGuard], loadChildren: () => import('./features/auth/auth.module')
    .then((m) => m.AuthModule), },
  { path: 'checkout', canActivate: [AuthGuard], loadChildren: () => import('./features/order/order.module')
    .then((m) => m.OrderModule), },
  { path: 'admin', canActivate: [AdminGuard], loadChildren: () => import('./features/admin/admin.module')
    .then((m) => m.AdminModule), },
  // { path: 'choose-location', loadChildren: () => import('./features/order/pages/choose-location/choose-location.module')
  //   .then(m => m.ChooseLocationModule) },
    { path: 'choose-location', loadChildren: () => import('./features/order/pages/choose-location-leaf/choose-location-leaf.module')
    .then(m => m.ChooseLocationLeafModule) },
  {path: '', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
