import { Component, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Order } from 'src/app/features/order/models/order';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.css']
})
export class OrderTableComponent implements OnInit {
  @Input() order!: Order;
  @Input() displayedColumns?: string[];

  constructor(
    private titleService: Title,
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
    this.titleService.setTitle(`Order Table - ${this.sharedService.appTitle}`);
  }

}
