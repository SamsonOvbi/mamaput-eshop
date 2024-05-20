"use strict"
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

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  apiUrl = `${environment.apiUrl}/api/checkout`;

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

  constructor(
    private cartService: CartService, private http: HttpClient,
    private titleService: Title,
    private messageDialogService: MessageDialogService,
    private route: ActivatedRoute,
    private orderService: OrderService,
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
    }
  }

  private getOrder(orderId: string) {
    this.orderService.getOrder(orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.titleService.setTitle(`Order List ${this.order._id}`);
        this.loading = false;
        if (!this.order.isPaid) {
          if (this.order.paymentMethod === 'stripe') {
            this.initConfigStripe();
          } else {
            this.initConfigPayPal();
          }
        }
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
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
  }

}
