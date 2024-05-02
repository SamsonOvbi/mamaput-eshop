import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/shared/services/cart.service';
import { Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  // encapsulation: ViewEncapsulation.None, //add this line
  styleUrls: ['./payment-method.component.css'],
})
export class PaymentMethodComponent implements OnInit {
  stepperOrientation: Observable<StepperOrientation>;
  form: FormGroup;
  submitted = false;
  cartService: CartService;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    cartService: CartService,
    private titleService: Title,
    private sharedService: SharedService,
  ) {
    this.cartService = cartService;
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.form = this.formBuilder.group({
      paymentMethod: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle(`Payment Method - ${this.sharedService.titleBlog}`);
    this.cartService.currentCart.subscribe((x) => {
      this.form.patchValue({ paymentMethod: x.paymentMethod });
    });
  }
  back() {
    this.router.navigate(['/shipping']);
  }
  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    const paymentMethodControl = this.form.get('paymentMethod');
    if (paymentMethodControl) {
      this.cartService.savePaymentMethod(paymentMethodControl.value);
    }
    this.router.navigate(['/place-order']);
  }
  goPlaceOrder() {
    if (this.form.invalid) {
      alert('form is invalid');
      return;
    }
    this.router.navigate(['/shipping']);
  }
}
