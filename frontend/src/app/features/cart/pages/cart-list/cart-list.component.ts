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

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit, OnDestroy {
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
  authSubscription: Subscription = Subscription.EMPTY;
  cartSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

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
    this.cartSubscription = this.cartService.currentCart.subscribe((x) => (this.cart = x));
    this.subscriptions.push(this.cartSubscription);
    this.authSubscription = this.authservice.currentUser.subscribe((x) => this.currentUser = x);
    this.subscriptions.push(this.authSubscription);
  }

  checkout() {
    if (this.cart.itemsCount === 0) {
      this.messageDialogService.openMessageDlg({message: 'Cart is empty', type: 'error'});
      return;
    }
    this.router.navigate(['/shipping']);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
