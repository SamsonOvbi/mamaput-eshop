import { Component, OnInit } from '@angular/core';
import { Cart, Item, ShippingAddress } from 'src/app/models/cart';
import { CartService } from 'src/app/shared/services/cart.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Order } from 'src/app/models/order';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css'],
})
export class PlaceOrderComponent implements OnInit {
  loadingPlaceOrder = false;
  cart!: Cart;
  order!: Order;
  cartService: CartService;
  orderService: OrderService;
  stepperOrientation: Observable<StepperOrientation>;

  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'quantity',
    'subtotal',
  ];
  error: string = '';
  shippingAddress?: ShippingAddress;

  constructor(
    private titleService: Title,
    private sharedService: SharedService,
    private router: Router,
    
    private messageDialogService: MessageDialogService,
    cartService: CartService,
    orderService: OrderService,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.cartService = cartService;
    this.orderService = orderService;
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit() {
    this.titleService.setTitle(`Place Order - ${this.sharedService.titleBlog}`);
    this.cartService.currentCart.subscribe((x) => (this.cart = x));
    this.orderService.getShippingAddress().subscribe((x) => this.order = x);

  }
  goPayment() {
    this.router.navigate(['/payment']);
  }
  goShipping() {
    this.router.navigate(['/shipping']);
  }

  placeOrder() {
    const message = 'Order placed successfully.';
    this.loadingPlaceOrder = true;        
    this.orderService.create(this.cart).subscribe({      
      next: (order) => {
        this.messageDialogService.openMessageDlg({message: message, type: 'success'});
        this.loadingPlaceOrder = false;
        this.cartService.clearItems();
        this.router.navigate([`/order-list/${order._id}`]);
      },
      error: (err: any) => {
        this.loadingPlaceOrder = false;
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      
    });
  }

}
