import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Order } from 'src/app/features/order/models/order';
// import { OrderService } from 'src/app/shared/services/order.service';
import { BehaviorSubject, Subscription } from 'rxjs';
// import { AuthService } from 'src/app/core/helpers/auth.service';
import { UserInfo } from 'src/app/features/auth/models';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { OrderService } from 'src/app/features/order/order.service';

@Component({
  selector: 'app-admin-orders-history',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit, OnDestroy {
  loading = true;
  error = false;
  orders: Order[] = [];
  orderService: OrderService;
  displayedColumns: string[] = [
    '_id',
    'user',
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
    this.titleService.setTitle(`Admin Orders - ${this.sharedService.appTitle}`); 
    this.getAdminOrders();
  }

  private getAdminOrders() {
    this.loading = true;     
    this.orderSubscription = this.orderService.getAdminOrders().subscribe({
      next: (data: any) => {
        this.orders = data;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      
    });
    this.subscriptions.push(this.orderSubscription);
  } 

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
