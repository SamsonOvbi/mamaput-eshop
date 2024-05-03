import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Order, Sort } from 'src/app/models/types';
import { Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-product-header',
  templateUrl: './product-header.component.html'
})
export class ProductHeaderComponent {
  @Input() drawer: any;
  @Input() category?: string;
  @Output() itemsCountChange = new EventEmitter<number>();
  @Output() columnsCountChange = new EventEmitter<number>();

  pageSize = 20;
  pageSizeChoose = [5, 10, 20];

  constructor(
    private titleService: Title,
    private sharedService: SharedService
  ) {
    this.titleService.setTitle(`Product Header - ${this.sharedService.appTitle}`);
  }


  onItemsUpdated(newItem: number): void {
    this.pageSize = newItem;
    this.itemsCountChange.emit(newItem);
  }

  onColumnsUpdated(colsNum: number): void {
    this.columnsCountChange.emit(colsNum);
  }

}
