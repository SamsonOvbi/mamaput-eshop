import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SnackbarService } from 'src/app/shared/services/snackBar/snackbar.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
// import { nextTick } from 'process';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/shared/services/product.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { ProductBoxComponent } from '../../components/product-box/product-box.component';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  @ViewChild(MatDrawer) drawer!: MatDrawer;
  @ViewChild('productBox') productBox!: ProductBoxComponent;  

  productsSearch!: Product[];
  showSlides = false;

  category?: string;
  name = '';
  order = 'lowest';
  rating = 0;
  minValue = 0;
  maxValue = 2000;

  loading = true;
  error = false;

  /** This variable contain subscription from service that would be removed when the component is destroyed to avoid memory leaks */
  productsSubscription!: Subscription;
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
    this.route.queryParams.subscribe((p) => {
      this.category = p.category || '';
      this.name = p.name || '';
      this.order = p.order || '';
      this.rating = p.rating || 0;
      this.minValue = p.minValue || 0;
      this.maxValue = p.maxValue || 0;
      search = p.category || p.name || p.order || p.rating || this.minValue || this.maxValue;
      this.searchProducts();      
      const appTitle = `Search ${search}... - ${this.sharedService.titleBlog}`;
      this.titleService.setTitle(appTitle);
    });

  }

  searchProducts() {
    const reqBody = {
      category: this.category, name: this.name, order: this.order, rating: this.rating,
      minValue: this.minValue, maxValue: this.maxValue,
    };
    // this.productService.getProducts().subscribe({
    this.productsSubscription = this.productService.searchProducts(reqBody).subscribe({
      next: (_products: Product[]) => {
        this.loading = false;
        this.productsSearch = [..._products];
        this.cdRef.detectChanges();
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
        this.messageDialogService.openMessageDlg({message: err, type: 'error'});
      },
      
    });
  }

  ngOnDestroy() {
    this.productsSubscription.unsubscribe();
  }

}
