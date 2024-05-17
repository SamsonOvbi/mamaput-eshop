import { Component, ViewChild, EventEmitter, Input, Output, HostListener } from '@angular/core';
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
  public isLargeScreen!: boolean;
  public isOpen: boolean = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  loading = true;
  error = false;
  products!: Product[];

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
  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    event.preventDefault(); 
    this.checkScreenSize();
  }

  @HostListener('mousemove', ['$event'])
  onClick2(event: KeyboardEvent) { 
    event.preventDefault(); 
    this.checkScreenSize();
  };

  private checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 769;
  }

  logBackdropClick() {
    console.log('Backdrop clicked');
  }
}
