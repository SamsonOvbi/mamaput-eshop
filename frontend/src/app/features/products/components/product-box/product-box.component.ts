import { Component, ViewChild, OnDestroy, OnInit, HostListener, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { Observable, Subscription, map } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDrawer, MatDrawerMode } from '@angular/material/sidenav';

import { SnackbarService } from 'src/app/shared/services/snackBar/snackbar.service';
import { Title } from '@angular/platform-browser';
import { Product } from 'src/app/models/product';
import { Cart, Item } from 'src/app/models/cart';
import { CartService } from 'src/app/shared/services/cart.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { SeoService } from 'src/app/shared/services/seo.service';
import { SharedService } from 'src/app/shared/services/shared.service';

import { ROW_HEIGHT } from '../../../../models/types';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.scss']
})
export class ProductBoxComponent implements OnInit {
  @Input() productsList!: Product[];
  @Input() productsSearch!: Product[];
  products!: Product[];
  // @Input() products!: Product[];
  @Input() showSlides!: boolean;
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  drawerMode = false;
  fullWidthMode = false;

  cols = 3;
  rowHeight = ROW_HEIGHT[this.cols];
  category?: string;

  sort = 'desc';
  count = 20;
  noOfVisits = 0
  rating = 0;
  order = 'lowest';
  minValue = 0;
  maxValue = 40;
  appTitle = '';

  loading = true;
  error = false;
  playInterval = 3000;
  changes!: SimpleChanges;

  /** This variable contain subscription from service that would be removed when the component is destroyed to avoid memory leaks */
  productsSubscription: Subscription = new Subscription();

  constructor(
    private productService: ProductService,
    
    private messageDialogService: MessageDialogService,
    private cartService: CartService,
    private titleService: Title,
    private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.appTitle = this.sharedService.titleBlog;
    this.titleService.setTitle(`Product Box - ${this.appTitle}`);
    this.ngOnChanges(this.changes);
  }

  getProductList(newCount = 20) {
    this.productsSubscription = this.productService.getAllProducts(
      newCount.toString(), this.sort, this.category, this.rating, this.order,
      this.minValue, this.maxValue,
    ).subscribe((_products) => {
      this.products = _products;
    });
  }

  /**
   * Update the number of product to display
   * @param count is the no of products to display
   */

  onItemsCountChange(itemsCount: number): void {
    this.getProductList(itemsCount);
  }

  /**
   * Updates page layout
   * @param colsCount is the number of columns to display the product list per row
   */
  onUpdateColumnsCount(colsCount: number): void {
    this.cols = colsCount;
    this.rowHeight = ROW_HEIGHT[this.cols];
  }

  onAddToCart(product: Product) {
    let message;
    const { _id, image, name, slug, price } = product;
    const item = { _id, image, name, slug, price, quantity: 1 };
    this.cartService.addItem(item).subscribe({
      next: (productName) => {
        // message = `${productName} added to the cart`;
        message = `Item added to the cart:   ${productName}`;
        this.messageDialogService.openMessageDlg({message: message, type: 'success'});
      },
      error: (err: any) => {
        message = `${err.message} \n Product Not added`;
        this.messageDialogService.openMessageDlg({message: message, type: 'error'});
      },

    });
  }

  ngOnChanges(_changes: SimpleChanges): void {    
    if (_changes.productsSearch || _changes.productsList) {
      this.changes = _changes;
      this.products = _changes.productsSearch?.currentValue || _changes.productsList?.currentValue;
    }
  }

  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

}
