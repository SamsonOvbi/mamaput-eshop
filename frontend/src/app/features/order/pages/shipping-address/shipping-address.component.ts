import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { StepperOrientation } from '@angular/cdk/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from 'src/app/shared/services/cart.service';
import { Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserInfo } from 'src/app/models';
import { AuthService } from 'src/app/shared/services/auth.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  // encapsulation: ViewEncapsulation.None, //add this line
  styleUrls: ['./shipping-address.component.css'],
})
export class ShippingAddressComponent implements OnInit {
  currentUser: UserInfo | null = null;
  stepperOrientation: Observable<StepperOrientation>;
  form: FormGroup;
  submitted = false;
  cartService: CartService;
  orderService: OrderService;
  shippingLocation: { lat: number; lng: number } = { lat: 0, lng: 0 };
  buyer!: Order;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    cartService: CartService,
    orderService: OrderService,
    private titleService: Title,
    private sharedService: SharedService,
    private authservice: AuthService,
  ) {
    this.cartService = cartService; this.orderService = orderService;
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      postalCode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authservice.currentUser.subscribe((x) => this.currentUser = x);
    this.titleService.setTitle(`Shipping Address - ${this.sharedService.titleBlog}`);
    this.orderService.getShippingAddress().subscribe((x) => {
      this.buyer = x;
      this.shippingLocation.lat = this.buyer.shippingAddress.lat;
      this.shippingLocation.lng = this.buyer.shippingAddress.lng;
      this.form.patchValue({ fullName: this.buyer.shippingAddress.fullName || this.currentUser?.username });
      this.form.patchValue({ address: this.buyer.shippingAddress.address });
      this.form.patchValue({ city: this.buyer.shippingAddress.city });
      this.form.patchValue({ country: this.buyer.shippingAddress.country });
      this.form.patchValue({ postalCode: this.buyer.shippingAddress.postalCode });
    });
  }
  chooseLocation() {
    this.router.navigate(['/choose-location']);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }

    const { fullName, address, city, country, postalCode } = this.form.controls;
    this.cartService.saveShippingAddress({
      fullName: fullName.value,
      address: address.value,
      city: city.value,
      country: country.value,
      postalCode: postalCode.value,
      lat: 0,
      lng: 0,
    });
    this.router.navigate(['/payment']);
  }
}
