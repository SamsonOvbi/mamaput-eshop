import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/helpers/guards/auth.guard';
import { PlaceOrderComponent } from './pages/place-order/place-order.component';

// import { OrderComponent } from './pages/order/order.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { ShippingAddressComponent } from './pages/shipping-address/shipping-address.component';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';

const routes: Routes = [
  { path: 'place-order', component: PlaceOrderComponent, canActivate: [AuthGuard], },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard], },
  // { path: 'order/:id', canActivate: [AuthGuard], component: OrderComponent },
  { path: 'order-list/:id', canActivate: [AuthGuard], component: OrderListComponent },
  { path: 'shipping', component: ShippingAddressComponent, canActivate: [AuthGuard], },
  { path: 'payment', component: PaymentMethodComponent, canActivate: [AuthGuard], },
]

@NgModule({
  imports: [ RouterModule.forChild(routes), ],
  exports: [RouterModule],
})
export class OrderRoutingModule { }
