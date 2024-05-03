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

@Component({
  selector: 'app-admin-orders-history',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
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
    this.orderService.getAdminOrders().subscribe({
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
  } 

}
