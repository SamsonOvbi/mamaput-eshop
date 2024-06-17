import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
// import { nextTick } from 'process';
import { Product, ProductFilter } from 'src/app/features/products/models/product';
import { ProductService } from 'src/app/features/products/services/product.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { ProductBoxComponent } from '../../components/product-box/product-box.component';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'], 
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  @ViewChild('productBox') productBox!: ProductBoxComponent;

  productsSearch!: Product[];
  productsLength = 0;
  showSlides = false;

  category?: string;
  showCategory?: string;
  name = '';
  query = '';
  description = '';
  sort = 'lowest';
  rating = 0;
  minValue = 0;
  maxValue = 2000;

  loading = true;
  error = false;

  /** This variable contain subscription from service that would be removed when the component is destroyed to avoid memory leaks */
  productsSubscription: Subscription = Subscription.EMPTY;
  querySubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private messageDialogService: MessageDialogService,
    private cdRef: ChangeDetectorRef,
    private titleService: Title,
    private sharedService: SharedService,
  ) {

  }

  ngOnInit() {
    let search;
    this.querySubscription = this.route.queryParams.subscribe((p) => {
      this.category = p.category || '';
      this.name = p.query || '';
      // this.query = p.query || ''; // Retrieve the query parameter
      this.description = p.query || '';
      this.sort = p.sort || '';
      this.rating = p.rating || 0;
      this.minValue = p.minValue || 0;
      this.maxValue = p.maxValue || 0;
      search = p.category || p.name || p.description || p.sort || p.rating || this.minValue || this.maxValue;
      this.searchProducts();
      const appTitle = `Search ${search}... - ${this.sharedService.appTitle}`;
      this.titleService.setTitle(appTitle);
    });
    this.subscriptions.push(this.querySubscription);

  }

  searchProducts() {
    // this.showCategory = this.category ? this.category : 'All';
    this.showCategory = this.category;
    const productFilter: ProductFilter = {
      pageSize: '20', pageNumber: 1, category: this.category || '',
      name: this.name, description: this.name, sort: this.sort, rating: this.rating,
      minValue: this.minValue, maxValue: this.maxValue,
    }

    this.productsSubscription = this.productService.searchProducts(productFilter).subscribe({
      next: (_products: Product[]) => {
        this.loading = false;
        this.productsSearch = [..._products];
        this.productsLength = this.productsSearch.length;
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
        this.messageDialogService.openMessageDlg({ message: err.message, type: 'error' });
      },
    });
    this.subscriptions.push(this.productsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
