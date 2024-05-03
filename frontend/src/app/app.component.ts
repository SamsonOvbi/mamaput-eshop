import { Component, ViewChild, EventEmitter, Input, Output } from '@angular/core';
import { Order, Sort } from 'src/app/models/types';

import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { SharedService } from './shared/services/shared.service';
import { Subscription } from 'rxjs';
import { Product } from './models/product';
import { ProductService } from './shared/services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  loading = true;
  error = false;
  products!: Product[];

  /** This variable contain subscription from service that would be removed when the component is destroyed to avoid memory leaks */
  productsSubscription: Subscription = new Subscription();

  constructor(
    private titleService: Title,
    private sharedService: SharedService,
    private productService: ProductService,
  ) {
  }
  ngOnInit() {
    if (this.sidenav) {
      this.sidenav.mode = 'side';
  }
    this.titleService.setTitle(`title - ${this.sharedService.appTitle}`);
  }

  logBackdropClick() {
    console.log('Backdrop clicked');
  }
  ngOnDestroy(): void {
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

}
