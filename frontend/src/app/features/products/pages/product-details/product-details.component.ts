import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { UserInfo } from 'src/app/features/auth/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/features/products/models/product';
import { AuthService } from 'src/app/features/auth/helpers/auth.service';
import { CartService } from 'src/app/features/cart/services/cart.service';
import { ProductService } from 'src/app/features/products/services/product.service';
import { SeoService } from 'src/app/shared/services/seo.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AllConstants } from 'src/app/shared/constants';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  currentUser: UserInfo | null = null;
  submitted = false;
  error = false;
  loading = true;
  createReviewLoading = false;
  product: Product = {
    _id: '',
    id: 0,
    name: '',
    price: 0,
    image: '',
    brand: '',
    category: '',
    description: '',
    countInStock: 0,
    slug: '',
    rating: 0,
    numReviews: 0,
    reviews: [],
  };
  productsSubscription: Subscription = Subscription.EMPTY;
  cartSubscription: Subscription = Subscription.EMPTY;
  userSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private seoService: SeoService,
    private sharedService: SharedService,
    private messageDialogService: MessageDialogService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
  ) {
    this.form = this.formBuilder.group({
      comment: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  async ngOnInit() {
    this.userSubscription = this.authService.currentUser.subscribe((x) => (this.currentUser = x));
    this.getProduct();
  }

  setSubmitted(value: boolean) {
    this.submitted = value;
  }
  setError(value: boolean) {
    this.error = value;
  }
  setLoading(value: boolean) {
    this.loading = value;
  }
  getProduct() {
    const routeParams = this.route.snapshot.paramMap;
    const slug = routeParams.get('slug');
    if (slug) {
      this.productsSubscription = this.productService.getProductBySlug(slug).subscribe({
        next: (data) => {
          this.loading = false;
          this.product = data;
          this.seoService.setProductMetaTags(this.product, this.sharedService);
        },
        error: (err: any) => {
          this.error = true;
          this.loading = false;
          this.messageDialogService.openMessageDlg({ message: err, type: 'error' });
        },
      });
      this.subscriptions.push(this.productsSubscription);
    } else {
      this.error = true;
      this.loading = false;
      this.messageDialogService.openMessageDlg({ message: AllConstants.productNotFound, type: 'error' });
    }
  }

  addToCart(product: Product) {
    const { _id, image, name, slug, price } = this.product;
    const item = { _id, image, name, slug, price, quantity: 1 };
    this.cartSubscription = this.cartService.addItem(item).subscribe({
      next: (productName) => {
        const message = `${productName} added to the cart`;
        this.messageDialogService.openMessageDlg({ message: message, type: 'success' });
        this.router.navigate(['/cart']);
      },
      error: (err: any) => {
        this.messageDialogService.openMessageDlg({ message: err.message, type: 'error' });
      },

    });
    this.subscriptions.push(this.cartSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
