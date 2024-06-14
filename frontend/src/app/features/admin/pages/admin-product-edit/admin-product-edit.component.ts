import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from 'src/app/features/products/services/product.service';
import { Title } from '@angular/platform-browser';
import { Product } from 'src/app/features/products/models/product';
import { AllConstants } from 'src/app/shared/constants';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-product-edit',
  templateUrl: './admin-product-edit.component.html',
  styleUrls: ['./admin-product-edit.component.scss'],
})
export class AdminProductEditComponent implements OnInit, OnDestroy {
  form: FormGroup;
  product: Product = {
    _id: '', id: 0, name: '', slug: '', price: 0, image: '', brand: '', category: '',
    description: '', countInStock: 0, rating: 0, numReviews: 0, reviews: [],
  };
  uploadLoading = false;
  loading = false;
  error = false;
  submitted = false;
  returnUrl: string;
  productsSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private titleService: Title,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private messageDialogService: MessageDialogService,
    private productService: ProductService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      slug: ['', Validators.required],
      price: ['', Validators.required],
      image: ['', Validators.required],
      brand: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      countInStock: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    const productId = routeParams.get('id');
    if (productId) {
      this.productsSubscription = this.productService.getProduct(productId).subscribe({
        next: (product: Product) => {
          this.product = product;
          this.loading = false;
          this.form.patchValue({ name: product.name });
          this.form.patchValue({ slug: product.slug });
          this.form.patchValue({ price: product.price });
          this.form.patchValue({ image: product.image });
          this.form.patchValue({ brand: product.brand });
          this.form.patchValue({ category: product.category });
          this.form.patchValue({ description: product.description });
          this.form.patchValue({ countInStock: product.countInStock });
          this.titleService.setTitle(`Admin Edit Product ${product._id}`);
        },
        error: (err: any) => {
          this.error = true;
          this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
        },
      });
      this.subscriptions.push(this.productsSubscription);
    } else {
      this.messageDialogService.openMessageDlg({ message: AllConstants.productNotFound, type: 'error' });
    }
  }

  uploadImage(event: any) {
    const file: File = event.target.files[0];
    this.uploadLoading = true;
    this.productService.postFile(file).subscribe({
      next: (data) => {
        this.uploadLoading = false;
        this.form.patchValue({ image: data.secure_url });
        this.messageDialogService.openMessageDlg({ message: AllConstants.productAdded, type: 'success' });
      },
      error: (err: any) => {
        this.uploadLoading = false;
        this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
      },
    });
    this.subscriptions.push(this.productsSubscription);
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const {
      name, slug, price, image, category, brand, countInStock, description,
    } = this.form.controls;
    this.loading = true;
    this.productService.update({
      _id: this.product._id,
      id: this.product.id,
      name: name.value,
      slug: slug.value,
      price: price.value,
      image: image.value,
      category: category.value,
      brand: brand.value,
      countInStock: countInStock.value,
      description: description.value,
      rating: this.product.rating,
      numReviews: this.product.numReviews,
      reviews: [],
    })
      .subscribe({
        next: () => {
          this.messageDialogService.openMessageDlg({ message: AllConstants.productAdded, type: 'success' });
          this.loading = false;
          this.router.navigate(['/admin/products']);
        },
        error: (err: any) => {
          this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
          this.loading = false;
        },
      });
      this.subscriptions.push(this.productsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }  

}
