// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Title } from '@angular/platform-browser';
// import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { Product } from 'src/app/models/product';
// import { ProductService } from 'src/app/shared/services/product.service';
// import { AuthService } from 'src/app/shared/services/auth.service';
// import { SharedService } from 'src/app/shared/services/shared.service';
// import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
// import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';

// @Component({
//   selector: 'app-admin-products-history',
//   templateUrl: './admin-products.component.html',
//   styleUrls: ['./admin-products.component.css'],
// })
// export class AdminProductsComponent implements OnInit {
//   loading = true;
//   error = false;
//   products: Product[] = [];
//   productService: ProductService;
//   displayedColumns: string[] = [
//     'image',
//     '_id',
//     'name',
//     'price',
//     'category',
//     'brand',
//     'countInStock',
//     'action',
//   ];

//   constructor(
//     private dialog: MatDialog,
//     private titleService: Title,
//     private sharedService: SharedService,
//     private router: Router,
//     private messageDialogService: MessageDialogService,
//     private route: ActivatedRoute,
//     productService: ProductService,
//     private cd: ChangeDetectorRef,
//   ) {
//     this.productService = productService;
//   }

//   ngOnInit() {
//     this.getAdminProducts();
//   }

//   private getAdminProducts() {
//     this.loading = true;
//     this.productService.getAdminProducts().subscribe({
//       next: (data: Product[]) => {
//         this.products = data;
//         this.titleService.setTitle(`Product History - ${this.sharedService.titleBlog}`);
//         this.loading = false;
//       },
//       error: (err: any) => {
//         this.loading = false;
//         this.error = true;
//         this.messageDialogService.openMessageDlg({message: err, type: 'error'}); 
//       },
      
//     });
//   }

//   createProduct() {
//     if (confirm(`Are you sure you want to create a product?`)) {
//       this.productService.createProduct().subscribe({
//         next: (data: any) => {
//           this.router.navigate(['/admin/product/' + data._id]);
//         },
//         error: (err: any) => {
//           this.messageDialogService.openMessageDlg({message: err, type: 'error'});
//         },
        
//       });
//     }
//   }

//   handleDeleteAction(product: Product) {
//     const dialogConfig = new MatDialogConfig();
//     dialogConfig.width = '550px';
//     dialogConfig.data = {
//       message: 'delete this product',
//       image: product.image,
//       name: product.name
//     };

//     const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

//     const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe({
//       next: (resp: any) => {
//         this.deleteProduct(product._id);
//         dialogRef.close();
//       }
//     });
//   }

//   deleteProduct(productId: string) {
//     const product = (this.products.filter((product) => product._id === productId))[0];
//     this.productService.deleteProduct(productId).subscribe({
//       next: (data: any) => {
//         const message = `product removed from the store:  ${product.name}`;
//         this.messageDialogService.openMessageDlg({message: message, type: 'success'});
//         this.getAdminProducts();
//       },
//       error: (err: any) => {
//         this.messageDialogService.openMessageDlg({message: err, type: 'error'});
//       },
      
//     });
//   }
// }
