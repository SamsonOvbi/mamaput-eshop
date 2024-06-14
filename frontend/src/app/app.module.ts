
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule } from '@angular/material/snack-bar';

// Third-party modules
import { NgxPayPalModule } from 'ngx-paypal';
import { SwiperModule } from 'swiper/angular';

// Routing & Core Modules
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';

// Feature Modules
import { AdminModule } from './features/admin/admin.module';
import { AuthModule } from './features/auth/auth.module';
import { CartModule } from './features/cart/cart.module';
import { OrderModule } from './features/order/order.module';
import { ProductsModule } from './features/products/products.module';
import { SharedModule } from './shared/shared.module';

// Components
import { AppComponent } from './app.component';

// Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from './shared/material.module';
import { JwtInterceptor } from './features/auth/helpers/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './features/auth/helpers/interceptors/error.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule, HttpClientJsonpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    NgxPayPalModule,
    SwiperModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    CoreModule,
    AdminModule,
    AuthModule,
    CartModule,
    OrderModule,
    ProductsModule,
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500, verticalPosition: 'top' } },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}