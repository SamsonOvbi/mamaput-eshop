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

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.css']
})
export class CartListComponent implements OnInit {
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
    this.cartService.currentCart.subscribe((x) => (this.cart = x));
    this.authservice.currentUser.subscribe((x) => this.currentUser = x);
  }

  checkout() {
    if (this.cart.itemsCount === 0) {
      this.messageDialogService.openMessageDlg({message: 'Cart is empty', type: 'error'});
      return;
    }
    this.router.navigate(['/shipping']);
  }

}
