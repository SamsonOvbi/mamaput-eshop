import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Product } from 'src/app/features/products/models/product';
import { ProductService } from 'src/app/features/products/services/product.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-products-history',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  loading = true;
  error = false;
  products: Product[] = [];
  // productService: ProductService;
  displayedColumns: string[] = [
    'image', '_id', 'name', 'price', 'category', 'brand', 'countInStock', 'action',
  ];
  productsSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private sharedService: SharedService,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private cd: ChangeDetectorRef,
  ) {
  }

  ngOnInit() {
    this.getAdminProducts();
  }

  private getAdminProducts() {
    this.loading = true;
    this.productsSubscription = this.productService.getAdminProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.titleService.setTitle(`Admin Products - ${this.sharedService.appTitle}`);
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.error = true;
        this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
      },

    });
    this.subscriptions.push(this.productsSubscription);
  }

  createProduct() {
    if (confirm(`Are you sure you want to create a product?`)) {
      this.productsSubscription = this.productService.createProduct().subscribe({
        next: (data: any) => {
          this.router.navigate(['/admin/product/' + data._id]);
        },
        error: (err: any) => {
          this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
        },
      });
      this.subscriptions.push(this.productsSubscription);
    }
  }

  handleDeleteActionAdmin(product: Product) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.position = { top: '0px' };
    dialogConfig.data = {
      message: 'delete this product', image: product.image, name: product.name
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe({
      next: (resp: any) => {
        this.deleteProduct(product._id);
        dialogRef.close();
      }
    });
  }

  deleteProduct(productId: string) {
    const product = (this.products.filter((product) => product._id === productId))[0];
    this.productsSubscription = this.productService.deleteProduct(productId).subscribe({
      next: (data: any) => {
        const message = `product removed from the store:  ${product.name}`;
        this.messageDialogService.openMessageDlg({ message: message, type: 'success' });
        this.getAdminProducts();
      },
      error: (err: any) => {
        this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
      },
    });
    this.subscriptions.push(this.productsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }  
}
