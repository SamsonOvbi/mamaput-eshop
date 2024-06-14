import { Component, OnDestroy, OnInit, HostListener, ChangeDetectorRef, ViewChild } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { Product } from 'src/app/features/products/models/product';
import { ProductService } from 'src/app/features/products/services/product.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { ProductBoxComponent } from '../../components/product-box/product-box.component';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit, OnDestroy {
  @ViewChild('productBox') productBox!: ProductBoxComponent;
  productsList!: Product[];
  showSlides = true;
  loading = true;
  error = false;
  playInterval = 3000;

  /** This variable contain subscription from service that would be removed when the component is destroyed to avoid memory leaks */
  productsSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private messageDialogService: MessageDialogService,
    private titleService: Title,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    const appTitle = `Product List - ${this.sharedService.appTitle}`
    this.titleService.setTitle(appTitle);
    this.getProducts();
  }

  private getProducts() {
    this.productsSubscription = this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        if (products) { }
        this.loading = false;
        this.productsList = products;
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
        const errorMessage = err.response.data.message;
        this.messageDialogService.openMessageDlg({ message: errorMessage, type: 'error' });
      },
    });
    this.subscriptions.push(this.productsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }  

}
