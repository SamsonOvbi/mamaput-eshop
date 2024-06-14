import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from '../../features/cart/models/cart';
import { Order, PaymentResult, ShippingAddress } from '../../features/order/models/order';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' }) 
export class OrderService {
  apiUrl = `${environment.apiUrl}/api/orders`;

  constructor(
    private http: HttpClient, 
  ) { }

  create(cart: Cart): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/create`,      cart, httpOptions    );
  }

  pay(orderId: string, paymentResult: PaymentResult): Observable<Order> {
    return this.http.put<Order>(
      `${this.apiUrl}/${orderId}/pay`,
      paymentResult, httpOptions
    );
  }

  deliver(orderId: string): Observable<Order> {
    return this.http.put<Order>(
      `${this.apiUrl}/${orderId}/deliver`,
      {}, httpOptions
    );
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(
      `${this.apiUrl}/${orderId}`, httpOptions
    );
  }

  getAdminOrders(): Observable<Order> {
    return this.http.get<Order>(
      `${this.apiUrl}`, httpOptions
    );
  }

  getOrderSummary(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/summary`, httpOptions
    );
  }

  getShippingAddress(): Observable<Order> {
    return this.http.get<Order>(
      `${this.apiUrl}/address`, httpOptions
    );
  }

  getOrderHistory(): Observable<Order[]> {
    return this.http.get<Order[]>(
      `${this.apiUrl}/history`, httpOptions
    );
  }
}
