<<<<<<< HEAD
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Order } from 'src/app/features/order/models/order';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserInfo } from 'src/app/features/auth/models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { OrderService } from '../../order.service';
=======
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/services/order.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserInfo } from 'src/app/models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})
<<<<<<< HEAD
export class OrderHistoryComponent implements OnInit, OnDestroy {
=======
export class OrderHistoryComponent implements OnInit {
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  loading = true;
  error = false;
  orders: Order[] = [];
  orderService: OrderService;
  displayedColumns: string[] = [
    '_id',
    'createdAt',
    'totalPrice',
    'isPaid',
    'isDelivered',
    'action',
  ];
<<<<<<< HEAD
  orderSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];
=======
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7

  constructor(
    private titleService: Title,
    private sharedService: SharedService,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private route: ActivatedRoute,
    orderService: OrderService,
    private cd: ChangeDetectorRef,
  ) {
    this.orderService = orderService;
  }

  ngOnInit() {
    this.getOrderHistory();
  }

  private getOrderHistory() {
    this.loading = true;
<<<<<<< HEAD
    this.orderSubscription = this.orderService.getOrderHistory().subscribe({
=======
    this.orderService.getOrderHistory().subscribe({
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
      next: (data) => {
        this.orders = data;
        this.titleService.setTitle(`Order History - ${this.sharedService.appTitle}`);
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      complete: () => {}
  });
<<<<<<< HEAD
  this.subscriptions.push(this.orderSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

=======
  }
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
}
