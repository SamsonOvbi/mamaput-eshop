// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { OrderListComponent } from './order-list.component';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { MatSnackBarModule } from '@angular/material/snack-bar';
// import { OrderService } from 'src/app/shared/services/order.service';
// import { AuthService } from 'src/app/shared/services/auth.service';
// import { of, throwError } from 'rxjs';
// import { Order } from 'src/app/models/order';
// import { User } from 'src/app/models/user';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// function createMockOrder(): Order {
//   return {
//     _id: '123',
//     items: [],
//     shippingAddress: {
//       fullName: '', address: '', city: '', country: '', postalCode: '', lat: 0, lng: 0,
//     },
//     user: {
//       _id: '',
//       username: '',
//       isAdmin: false,
//     },
//     isPaid: false,
//     totalPrice: 100,
//     paidAt: '',
//     isDelivered: false,
//     deliveredAt: '',
//     paymentMethod: 'Card',
//     itemsCount: 0,
//     taxPrice: 0,
//     itemsPrice: 0,
//     shippingPrice: 0,
//     // Add other missing properties here as required
//   };
// }

// describe('OrderListComponent', () => {
//   let component: OrderListComponent;
//   let fixture: ComponentFixture<OrderListComponent>;
//   let orderService: OrderService;
//   let authService: AuthService;
//   let mockOrder: Order;

//   beforeEach(async () => {
//     if (!mockOrder) {
//       mockOrder = createMockOrder();
//     }
//     await TestBed.configureTestingModule({
//       declarations: [OrderListComponent],
//       imports: [
//         HttpClientTestingModule,
//         RouterTestingModule,
//         MatSnackBarModule,
        BrowserAnimationsModule  // Add this line
//       ],
//     }).overrideProvider(OrderService, { useValue: { getOrder: () => of(mockOrder) } })
//       .overrideProvider(AuthService, { useValue: { currentUser: of(null) } })
//       .compileComponents();

//     fixture = TestBed.createComponent(OrderListComponent);
//     component = fixture.componentInstance;
//     orderService = TestBed.inject(OrderService);
//     authService = TestBed.inject(AuthService);
//     spyOn(component, 'ngOnInit').and.callThrough();
//     fixture.detectChanges();
//   });

//   it('test_ngOnInit_fetches_order_details', fakeAsync(() => {
//     spyOn(orderService, 'getOrder').and.returnValue(of(mockOrder));
//     fixture.detectChanges();
//     tick();
//     expect(component.order).toEqual(mockOrder);
//   }));

//   // it('test_ngOnInit_handles_invalid_orderId', () => {
//   //   spyOn(orderService, 'getOrder').and.returnValue(throwError(() => new Error('Order Not Found')));
//   //   spyOn(authService, 'currentUser').and.returnValue(of(null));
//   //   component.ngOnInit();
//   //   expect(component.error).toBeTrue();
//   // });

//   // it('test_deliverOrder_delivers_order_and_displays_success_message', () => {
//   //   spyOn(orderService, 'deliver').and.returnValue(of(mockOrder));
//   //   component.order = mockOrder;
//   //   component.deliverOrder();
//   //   expect(component.order).toEqual(mockOrder);
//   // });


// });