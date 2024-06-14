
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

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
})

export class OrderHistoryComponent implements OnInit, OnDestroy {

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

  orderSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

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

    this.orderSubscription = this.orderService.getOrderHistory().subscribe({

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

  this.subscriptions.push(this.orderSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
