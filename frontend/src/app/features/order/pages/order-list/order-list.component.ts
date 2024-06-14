"use strict"
<<<<<<< HEAD
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserInfo } from 'src/app/features/auth/models';
import { Order } from 'src/app/features/order/models/order';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { OrderService } from '../../order.service';
import { AuthService } from 'src/app/features/auth/helpers/auth.service';
import { Subscription } from 'rxjs';
=======
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserInfo } from 'src/app/models';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/services/order.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { HttpClient } from '@angular/common/http';
import { CartService } from 'src/app/shared/services/cart.service';
import { environment } from 'src/environments/environment';
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
<<<<<<< HEAD
export class OrderListComponent implements OnInit, OnDestroy {
=======
export class OrderListComponent implements OnInit {
  apiUrl = `${environment.apiUrl}/api/checkout`;

>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  currentUser: UserInfo | null = null;
  public payPalConfig?: IPayPalConfig;
  loading = true;
  error = false;
  order!: Order;
  displayedColumns: string[] = [
    'image',
    'name',
    'price',
    'quantity',
    'subtotal',
  ];
<<<<<<< HEAD
  authSubscription: Subscription = Subscription.EMPTY;
  orderSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
=======

  constructor(
    private cartService: CartService, private http: HttpClient,
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
    private titleService: Title,
    private messageDialogService: MessageDialogService,
    private route: ActivatedRoute,
    private orderService: OrderService,
<<<<<<< HEAD
    private cd: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.subscriptions.push(this.authSubscription);
    const routeParams = this.route.snapshot.paramMap;
    const orderId = routeParams.get('id');
    if (orderId) {
      this.getOrder(orderId); 
    } else {
      this.messageDialogService.openMessageDlg({message: 'Order Not Found', type: 'error'});
=======
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    const routeParams = this.route.snapshot.paramMap;
    const orderId = routeParams.get('id');
    if (orderId) {
      this.getOrder(orderId);
    } else {
      this.messageDialogService.openMessageDlg({ message: 'Order Not Found', type: 'error' });
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
    }
  }

  private getOrder(orderId: string) {
<<<<<<< HEAD
    this.orderSubscription = this.orderService.getOrder(orderId).subscribe({
=======
    this.orderService.getOrder(orderId).subscribe({
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
      next: (data) => {
        this.order = data;
        this.titleService.setTitle(`Order List ${this.order._id}`);
        this.loading = false;
        if (!this.order.isPaid) {
<<<<<<< HEAD
          if(this.order.paymentMethod === 'stripe'){
            this.initConfigStripe();
          }else {
            this.initConfigPayPal();
          }          
        }
        this.cd.detectChanges();
=======
          if (this.order.paymentMethod === 'stripe') {
            this.initConfigStripe();
          } else {
            this.initConfigPayPal();
          }
        }
        this.cdRef.detectChanges();
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
<<<<<<< HEAD
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      
    });
    this.subscriptions.push(this.orderSubscription);
  }

  deliverOrder() {
    this.orderSubscription = this.orderService.deliver(this.order._id).subscribe({
      next: (data) => {
        this.getOrder(this.order._id);
        this.messageDialogService.openMessageDlg({message: 'Order delivered successfully', type: 'success'});

      },
      error: (err: any) => {
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      
    });
    this.subscriptions.push(this.orderSubscription);
  }

  private initConfigStripe(): void {

  }
  private initConfigPayPal(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      createOrderOnClient: (data: any) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: this.order.totalPrice.toString(),
            },
          },
        ],
      },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          const { id, status, update_time, email_address } = details;
          this.orderSubscription = this.orderService.pay(this.order._id, { id, status, update_time, email_address })
            .subscribe({
              next: (data) => {
                this.getOrder(this.order._id);
                this.messageDialogService.openMessageDlg({message: 'Order paid successfully', type: 'success'});
              },
              error: (err: any) => {
                this.messageDialogService.openMessageDlg({message: err, type: 'error'});
              },
              
            });
        });
        this.subscriptions.push(this.orderSubscription);
      },
      onCancel: (data, actions) => {
        this.messageDialogService.openMessageDlg({message: 'Payment canceled', type: 'error'});
      },
      onError: (err) => {
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
    };
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
=======
        this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
      },

    });
  }

  deliverOrder() {
    this.orderService.deliver(this.order._id).subscribe({
      next: (data) => {
        this.getOrder(this.order._id);
        this.messageDialogService.openMessageDlg({ message: 'Order delivered successfully', type: 'success' });

      },
      error: (err: any) => {
        this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
      },

    });
  }
  get payMethod() {
    return this.order.paymentMethod;
  }

  public initConfigStripe(): void {
    /** This method makes a post request to stripe to process users payment */
    this.http.post(`${this.apiUrl}/stripe`, {
      items: this.order.items,
    })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe('pk_test_51OH7IkCBa4LpRlYXmyjF0rmLy6Ojmg7WW9m1NBHknTidUw5ROV797RlJ734pHxgDVRrjSwW4j8aDarvUGGU0SWmf00du2MVtgf');
        stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      });
  }

  private initConfigPayPal(): void {
    this.http.get(`${this.apiUrl}/paypal`).subscribe((clientData: any) => {
      this.payPalConfig = {
        currency: 'USD',
        clientId: 'sb',
        // clientId: clientData.PAYPAL_CLIENT_ID,
        createOrderOnClient: (data: any) => <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: this.order.totalPrice.toString(),
              },
              shipping: {
                name: {
                  full_name: 'Recipient Name',
                },
                address: {
                  address_line_1: 'Shipping Address Line 1',
                  address_line_2: 'Shipping Address Line 2',
                  admin_area_2: 'City',
                  admin_area_1: 'State',
                  postal_code: 'Postal Code',
                  country_code: 'NG', // Country code for Nigeria
                },
              }, 
            },
          ],
          
        },
        advanced: {
          commit: 'true',
        },
        style: {
          label: 'paypal',
          layout: 'vertical',
        },
        onApprove: (data, actions) => {
          actions.order.get().then((details: any) => {
            const { id, status, update_time, email_address } = details;
            this.orderService.pay(this.order._id, { id, status, update_time, email_address })
              .subscribe({
                next: (data) => {
                  this.getOrder(this.order._id);
                  this.messageDialogService.openMessageDlg({ message: 'Order paid successfully', type: 'success' });
                },
                error: (err: any) => {
                  this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
                },

              });
          });
        },
        onCancel: (data, actions) => {
          this.messageDialogService.openMessageDlg({ message: 'Payment canceled', type: 'error' });
        },
        onError: (err) => {
          this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
        },
      };
    });
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  }

}
