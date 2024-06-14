import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
<<<<<<< HEAD
import { AuthGuard } from '../auth/helpers/guards/auth.guard';
=======
import { AuthGuard } from 'src/app/core/helpers/guards/auth.guard';
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
import { PlaceOrderComponent } from './pages/place-order/place-order.component';

// import { OrderComponent } from './pages/order/order.component';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { ShippingAddressComponent } from './pages/shipping-address/shipping-address.component';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';

<<<<<<< HEAD
const orderRoutes: Routes = [
=======
const routes: Routes = [
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  { path: 'place-order', component: PlaceOrderComponent, canActivate: [AuthGuard], },
  { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard], },
  // { path: 'order/:id', canActivate: [AuthGuard], component: OrderComponent },
  { path: 'order-list/:id', canActivate: [AuthGuard], component: OrderListComponent },
  { path: 'shipping', component: ShippingAddressComponent, canActivate: [AuthGuard], },
  { path: 'payment', component: PaymentMethodComponent, canActivate: [AuthGuard], },
]

@NgModule({
<<<<<<< HEAD
  imports: [ RouterModule.forChild(orderRoutes), ],
=======
  imports: [ RouterModule.forChild(routes), ],
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  exports: [RouterModule],
})
export class OrderRoutingModule { }
