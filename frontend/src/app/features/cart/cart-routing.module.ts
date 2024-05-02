import { NgModule } from '@angular/core';
import { CartListComponent } from './pages/cart-list/cart-list.component';
import { RouterModule, Routes } from '@angular/router';
import { CartTableComponent } from './component/cart-table/cart-table.component';

const routes: Routes = [
  { path: '', component: CartListComponent },
  { path: 'checkout', component: CartTableComponent },
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [RouterModule]
})
export class CartRoutingModule { }
