<<<<<<< HEAD
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from 'src/app/features/auth/models';
import { Cart, Item } from 'src/app/features/cart/models/cart';
import { Product } from 'src/app/features/products/models/product';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { AuthService } from 'src/app/features/auth/helpers/auth.service';
import { CartService } from '../../cart.service';
import { Subscription } from 'rxjs';
=======
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfo } from 'src/app/models';
import { Cart, Item } from 'src/app/models/cart';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
<<<<<<< HEAD
export class CartListComponent implements OnInit, OnDestroy {
=======
export class CartListComponent implements OnInit {
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  cart!: Cart;
  currentUser: UserInfo | null = null;
  displayedColumns: string[] = [
    'image',
    'name',
    'slug',
    'price',
    'quantity',
    'subtotal',
    'action'
  ];
  error: string = '';
<<<<<<< HEAD
  authSubscription: Subscription = Subscription.EMPTY;
  cartSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];
=======
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7

  constructor(
    private titleService: Title,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute,  
    private messageDialogService: MessageDialogService,
    private cartService: CartService,
    private authservice: AuthService
  ) { }

  ngOnInit() {
    this.titleService.setTitle(`Shopping Cart - ${this.sharedService.appTitle}`);
<<<<<<< HEAD
    this.cartSubscription = this.cartService.currentCart.subscribe((x) => (this.cart = x));
    this.subscriptions.push(this.cartSubscription);
    this.authSubscription = this.authservice.currentUser.subscribe((x) => this.currentUser = x);
    this.subscriptions.push(this.authSubscription);
=======
    this.cartService.currentCart.subscribe((x) => (this.cart = x));
    this.authservice.currentUser.subscribe((x) => this.currentUser = x);
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  }

  checkout() {
    if (this.cart.itemsCount === 0) {
      this.messageDialogService.openMessageDlg({message: 'Cart is empty', type: 'error'});
      return;
    }
    this.router.navigate(['/shipping']);
  }

<<<<<<< HEAD
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

=======
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
}
