import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Cart, Item } from '../../models/cart';

import { SharedService } from 'src/app/shared/services/shared.service';
import { MessageDialogService } from 'src/app/shared/dialogs/message-dialog/message-dialog.service';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-cart-table',
  templateUrl: './cart-table.component.html',
  styleUrls: ['./cart-table.component.css']
})
export class CartTableComponent implements OnInit, OnDestroy {
  @Input() cart!: Cart;
  @Input() displayedColumns?: string[];
  @Input() error: string = '';
  // private eventSubscription!: Subscription;
  cartSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private sharedService: SharedService,
    private messageDialogService: MessageDialogService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.titleService.setTitle(`Cart Table - ${this.sharedService.appTitle}`);
    this.cartSubscription = this.cartService.currentCart.subscribe((x) => (this.cart = x));
    this.subscriptions.push(this.cartSubscription);
  }

  add(item: Item) {
    let message: any;
    this.cartSubscription = this.cartService.addItem(item).subscribe({
      next: (productName) => {
        if (item.quantity === 0) {
          message = `Item added to the cart:  ${productName}`;
          this.messageDialogService.openMessageDlg({ message: message, type: 'success' });
        } else {
          message = `Item quantity increased `;
          this.messageDialogService.openMessageDlg({ message: message, type: 'success' });
        }
      },
      error: (err: any) => {
        this.messageDialogService.openMessageDlg({ message: err.message, type: 'error' });
      },

    });
    this.subscriptions.push(this.cartSubscription);
  }


  handleDeleteActionCart(item: Item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.position = { top: '0px' };
    dialogConfig.data = {
      message: 'delete this item', image: item.image, name: item.name
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe({
      next: (resp: any) => {
        this.deleteItem(item);
        dialogRef.close();
      }
    });
  }

  deleteItem(item: Item) {
    const message = `item removed from the cart:  ${item.name}`;
    this.cartService.delete(item._id);
    this.messageDialogService.openMessageDlg({ message: message, type: 'success' });
  }

  handleClearCartAction() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '550px';
    dialogConfig.position = { top: '0px' };
    dialogConfig.data = { message: 'clear the cart', };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, dialogConfig);

    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe({
      next: (resp: any) => {
        this.clearCart();
        dialogRef.close();
      }
    });
  }

  clearCart() {
    let message = `All items removed from the cart`;
    let type: any = 'success';
    if (this.cart.itemsCount === 0) {
      message = 'Cart is empty. Please go to the store to fill yor cart'
      type = 'error'
    }
    this.cartService.clearItems();
    this.messageDialogService.openMessageDlg({ message: message, type: type });
  }
  reduceQty(item: Item) {
    if (item.quantity > 1) {
      const message = `Item quantity reduced by 1`;
      this.cartService.reduceQuantity(item._id);
      this.messageDialogService.openMessageDlg({ message: message, type: 'success' });
    } else {
      this.handleDeleteActionCart(item)
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}
