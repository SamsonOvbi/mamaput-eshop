import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cart, Item, ShippingAddress } from '../models/cart';
// import { User, UserInfo } from '../../models/user';
import { Product } from '../../products/models/product';
import { environment } from '../../../../environments/environment';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

export const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100;

const defaultCart: Cart = {
  items: [],
  shippingAddress: {
    fullName: '', address: '', city: '', country: '', postalCode: '', lat: 0, lng: 0,
  },
  userId: '',
  paymentMethod: '', itemsCount: 0, itemsPrice: 0, taxPrice: 0, shippingPrice: 0, totalPrice: 0,
};

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }), };

@Injectable({ providedIn: 'root' })
export class CartService {
  apiUrl = `${environment.apiUrl}/api/carts`;
  userCartB: any;

  private currentCartSubject: BehaviorSubject<Cart>;
  public currentCart: Observable<Cart>;

  constructor(
    private http: HttpClient,
    private locStorageService: LocalStorageService,
  ) {
    this.currentCartSubject = new BehaviorSubject<Cart>(
      locStorageService.getItem('currentCart') || defaultCart
    );
    this.currentCart = this.currentCartSubject.asObservable();
  }

  public get currentCartValue(): Cart {
    return this.currentCartSubject.value;
  }

  addItem(item: Item): Observable<string> {
    return this.http.get<Product>(`${environment.apiUrl}/api/products/${item._id}`, {
      responseType: 'json',
    })
      .pipe(map((product) => {
        const cart = this.currentCartSubject.value;
        const existItem = cart.items.find((x) => x._id === item._id);
        if (
          (existItem && product.countInStock < existItem.quantity + 1) ||
          (!existItem && product.countInStock <= 0)
        ) {
          throw new Error('product is out of stock');
        }
        let items;
        if (existItem) {
          items = cart.items.map((x) => x._id === existItem._id ? { ...existItem, quantity: existItem.quantity + 1 } : x)
        } else {
          items = [...cart.items, item];
        }
        const newCart = { ...cart, ...calcCart(items) };
        this.editCart(newCart);
        return product.name;
      })
      );
  }

  editCart(cart: Cart) {
    console.log('currentCart', cart);
    this.locStorageService.setItem('currentCart', cart);
    this.currentCartSubject.next(cart);
  }

  reduceQuantity(productId: String) {
    const cart = this.currentCartSubject.value;
    let items: Item[] = cart.items;
    const existItem = cart.items.find((x) => x._id === productId);
    if (existItem) {
      if (existItem.quantity > 1) {
        items = cart.items.map((x) => x._id === existItem._id ? { ...existItem, quantity: existItem.quantity - 1 } : x
        );
      } else {
        items = cart.items.filter((x) => x._id !== productId);
      }
    }
    const newCart = { ...cart, ...calcCart(items) };
    this.editCart(newCart);
  }

  delete(productId: String) {
    const cart = this.currentCartSubject.value;
    let items: Item[] = cart.items;
    const existItem = cart.items.find((x) => x._id === productId);
    if (existItem) {
      items = cart.items.filter((x) => x._id !== productId);
    }
    const newCart = { ...cart, ...calcCart(items) };
    this.http.delete<Cart>(`${environment.apiUrl}/api/carts/` + existItem?._id,);
    this.editCart(newCart);
  }

  clearItems() {
    const cart = this.currentCartSubject.value;
    const newCart = { ...cart, ...calcCart([]) };
    this.editCart(newCart);
  }

  saveShippingAddress(shippingAddress: ShippingAddress) {
    const cart = this.currentCartSubject.value;
    cart.shippingAddress = {
      ...shippingAddress,
      lat: cart.shippingAddress.lat,
      lng: cart.shippingAddress.lng,
    };
    this.editCart(cart);
  }

  saveShippingLocation(lat: number, lng: number) {
    const cart = this.currentCartSubject.value; 
    cart.shippingAddress.lat = lat;
    cart.shippingAddress.lng = lng;
    this.editCart(cart);
  }

  getShippingAddress() {
    const cart = this.currentCartSubject.value;
    return `${cart.shippingAddress.address}, ${cart.shippingAddress.city}, ${cart.shippingAddress.country}`;
  }

  savePaymentMethod(paymentMethod: string) {
    const cart = this.currentCartSubject.value;
    cart.paymentMethod = paymentMethod;
    this.editCart(cart);
  }
}

const calcCart = (items: Item[]) => {
  const itemsPrice = round2(items.reduce((a, c) => a + c.price * c.quantity, 0));
  const itemsCount = items.reduce((a, c) => a + c.quantity, 0);
  const shippingPrice = itemsPrice == 0 ? 0 : itemsPrice > 200 ? 0 : 20;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

  return {
    items: items,
    itemsCount,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  };
};
