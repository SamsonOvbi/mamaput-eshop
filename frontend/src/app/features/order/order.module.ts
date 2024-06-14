import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderListComponent } from './pages/order-list/order-list.component';
import { PlaceOrderComponent } from './pages/place-order/place-order.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { OrderTableComponent } from './components/order-table/order-table.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShippingAddressComponent } from './pages/shipping-address/shipping-address.component';
import { PaymentMethodComponent } from './pages/payment-method/payment-method.component';
import { OrderHistoryComponent } from './pages/order-history/order-history.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartModule } from '../cart/cart.module';

const componentsList = [
  OrderListComponent, OrderTableComponent, PlaceOrderComponent, ShippingAddressComponent,
  PaymentMethodComponent, OrderHistoryComponent,
];

@NgModule({
  declarations: [componentsList, ],
  imports: [
    CommonModule, OrderRoutingModule, MaterialModule, NgxPayPalModule, SharedModule, CartModule,
    FormsModule, ReactiveFormsModule, BrowserAnimationsModule
  ],
  exports: [OrderRoutingModule, componentsList]
})
export class OrderModule { }
