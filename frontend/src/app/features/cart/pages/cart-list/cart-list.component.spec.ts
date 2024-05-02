import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartListComponent } from './cart-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BehaviorSubject, of } from 'rxjs';
import { CartService } from 'src/app/shared/services/cart.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/models/cart';
import { User, UserInfo } from 'src/app/models';

describe('CartListComponent', () => {
  let component: CartListComponent;
  let fixture: ComponentFixture<CartListComponent>;
  let router: Router;
  let cartService: CartService;
  let authService: AuthService;
  let snackbarService: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CartListComponent],
      imports: [RouterTestingModule, MatSnackBarModule, HttpClientTestingModule],
      providers: [CartService, AuthService, Title, SharedService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CartListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    cartService = TestBed.inject(CartService);
    authService = TestBed.inject(AuthService);
    snackbarService = TestBed.inject(MatSnackBar);

    spyOn(router, 'navigate');
    cartService.currentCart = new BehaviorSubject<Cart>({
      items: [], // Assuming items is an array of some item structure
      shippingAddress: {
        fullName: '',
        address: '',
        city: '',
        country: '',
        postalCode: '',
        lat: 0,
        lng: 0
      },
      userId: 'someUserId',
      paymentMethod: 'somePaymentMethod',
      itemsCount: 1,
      itemsPrice: 0,
      taxPrice: 0,
      shippingPrice: 0,
      totalPrice: 0
    }) as Observable<Cart>;
    //
    authService.currentUser = new BehaviorSubject<UserInfo>({
      _id: '1',
      username: '',
      email: '',
      isAdmin: false,
      token: '',
    }) as Observable<UserInfo>;
  });

  it('test_checkout_navigate_to_shipping', () => { 
    component.cart = { itemsCount: 1 } as any;
    component.checkout();
    expect(router.navigate).toHaveBeenCalledWith(['/shipping']);
  });

  it('test_checkout_empty_cart_error', () => {
    spyOn(component['snackbarService'], 'openSB');
    component.cart = { itemsCount: 0 } as any;
    component.checkout();
    expect(component['snackbarService'].openSB).toHaveBeenCalledWith('Cart is empty', 'error');
  });

  it('test_ngOnInit_set_title_and_subscriptions', () => {
    const titleService = TestBed.inject(Title);
    spyOn(titleService, 'setTitle');
    component.ngOnInit();
    expect(titleService.setTitle).toHaveBeenCalledWith(`Shopping Cart - ${component['sharedService'].titleBlog}`);
    expect(cartService.currentCart).toBeTruthy();
    expect(authService.currentUser).toBeTruthy();
  });
});