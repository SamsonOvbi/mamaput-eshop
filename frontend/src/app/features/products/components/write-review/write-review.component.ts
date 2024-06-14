import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from 'src/app/features/auth/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/features/products/models/product';
import { ProductService } from 'src/app/features/products/services/product.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { Subscription } from 'rxjs';
// import { nextTick } from 'process';

@Component({
  selector: 'app-write-review',
  templateUrl: './write-review.component.html',
  styleUrls: ['./write-review.component.scss']
})
export class WriteReviewComponent implements OnInit, OnDestroy {
  form: FormGroup;
  @Input() currentUser: UserInfo | null = null;
  @Output() setSubmittedEvent = new EventEmitter<boolean>();
  @Output() setErrorEvent = new EventEmitter<boolean>();
  @Output() setLoadingEvent = new EventEmitter<boolean>();
  createReviewLoading = false;
  @Input() product!: Product;
  productsSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private titleService: Title,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private messageDialogService: MessageDialogService,
    
  ) {
    this.form = this.formBuilder.group({
      comment: ['', Validators.required],
      rating: ['', Validators.required],
    });
  }

  ngOnInit() {  }

  setSubmitted(value: boolean) {
    this.setSubmittedEvent.emit(value);
  }
  setError(value: boolean) {
    this.setErrorEvent.emit(value);
  }
  setLoading(value: boolean) {
    this.setLoadingEvent.emit(value);
  }
  getProduct() {
    const routeParams = this.route.snapshot.paramMap;
    const slug = routeParams.get('slug');
    if (slug) {
      this.productsSubscription = this.productService.getProductBySlug(slug).subscribe({
        next: (data) => {
          this.setLoading(false); // this.loading = false;
          this.product = data;
          this.titleService.setTitle(`Review for ${this.product.name} - ${this.sharedService.appTitle}`);
        },
        error: (err: any) => {
          this.setError(true); // this.error = true;
          this.setLoading(false); // this.loading = false;
          this.messageDialogService.openMessageDlg({message: err, type: 'error'});
        },
        
      });
      this.subscriptions.push(this.productsSubscription);
    } else {
      this.setError(true); // this.error = true;
      this.setLoading(true); // this.loading = false;
      const message = 'Product not found';
      this.messageDialogService.openMessageDlg({message: message, type: 'error'});
    }
  }

  onSubmit() {
    this.setSubmitted(true); // this.submitted = true;
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    const { comment, rating } = this.form.controls;
    const reqBody = { _id: this.product._id, comment: comment, rating: rating };
    this.createReviewLoading = true;
    this.productsSubscription = this.productService.createReview(this.product._id, comment.value, rating.value).subscribe({
        next: (data) => {
          this.getProduct();
          this.createReviewLoading = false;
        },
        error: (err: any) => {
          this.messageDialogService.openMessageDlg({message: err, type: 'error'});
          this.createReviewLoading = false;
        },
        
      });
      this.subscriptions.push(this.productsSubscription);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());    
  }  
}
