import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/shared/services/order.service';
import { AuthService } from 'src/app/shared/services/auth.service';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DialogType } from 'src/app/shared/constants';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  // bar
  barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: { x: {}, y: { min: 10, }, },
  };
  barChartType: ChartType = 'bar';
  barChartData!: ChartData<'bar'>;

  // pie
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };
  pieChartType: ChartType = 'pie';
  public pieChartData!: ChartData<'pie', number[], string | string[]>;

  loading = true;
  error = false;
  numUsers = 0;
  totalSales = 0;
  numOrders = 0;
  orderService: OrderService;
  dialogType = DialogType;

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
    this.titleService.setTitle(`Admin Dashboard - ${this.sharedService.titleBlog}`);
    this.getOrderSummary();
  }

  private getOrderSummary() {
    this.loading = true;
    this.orderService.getOrderSummary().subscribe({
        next: (summary) => {
          this.numUsers = summary.users.length > 0 ? summary.users[0].numUsers : 0;
          this.totalSales = summary.orders.length > 0 ? summary.orders[0].totalSales : 0;
          this.numOrders = summary.orders.length > 0 ? summary.orders[0].numOrders : 0;
          this.barChartData = {
            labels: summary.dailyOrders.map((x: any) => x._id),
            datasets: [{
                data: summary.dailyOrders.map((x: any) => x.sales),
                label: 'Sales',
              },
              {
                data: summary.dailyOrders.map((x: any) => x.orders),
                label: 'Orders',
              },
            ],
          };
          this.pieChartData = {
            labels: summary.productCategories.map((x: any) => x._id),
            datasets: [
              {
                data: summary.productCategories.map((x: any) => x.count),
              },
            ],
          };
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

