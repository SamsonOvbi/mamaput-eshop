"use strict"
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { UserInfo } from 'src/app/models';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/services/order.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
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
    private titleService: Title,
    private messageDialogService: MessageDialogService,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    const routeParams = this.route.snapshot.paramMap;
    const orderId = routeParams.get('id');
    if (orderId) {
      this.getOrder(orderId); 
    } else {
      this.messageDialogService.openMessageDlg({message: 'Order Not Found', type: 'error'});
    }
  }

  private getOrder(orderId: string) {
    this.orderService.getOrder(orderId).subscribe({
      next: (data) => {
        this.order = data;
        this.titleService.setTitle(`Order List ${this.order._id}`);
        this.loading = false;
        if (!this.order.isPaid) {
          this.initConfig();
        }
        this.cd.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      
    });
  }

  deliverOrder() {
    this.orderService.deliver(this.order._id).subscribe({
      next: (data) => {
        this.getOrder(this.order._id);
        this.messageDialogService.openMessageDlg({message: 'Order delivered successfully', type: 'success'});

      },
      error: (err: any) => {
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      
    });
  }

  private initConfig(): void {
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
          this.orderService.pay(this.order._id, { id, status, update_time, email_address })
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
      },
      onCancel: (data, actions) => {
        this.messageDialogService.openMessageDlg({message: 'Payment canceled', type: 'error'});
      },
      onError: (err) => {
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
    };
  }
}
