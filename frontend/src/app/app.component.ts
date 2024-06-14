import { Component, ViewChild, EventEmitter, Input, Output, HostListener, OnInit } from '@angular/core';

import { MatSidenav } from '@angular/material/sidenav';
import { Title } from '@angular/platform-browser';
import { SharedService } from './shared/services/shared.service';
import { Product } from './features/products/models/product';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public isLargeScreen!: boolean;
  public isOpen: boolean = false;

  @ViewChild('sidenav') sidenav!: MatSidenav;

  loading = true;
  error = false;
  products!: Product[];

  constructor(
    private titleService: Title,
    private sharedService: SharedService,
  ) {
    this.checkScreenSize();
  }
  ngOnInit() {
    this.titleService.setTitle(`AppComponent - ${this.sharedService.appTitle}`);
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
    this.isLargeScreen = window.innerWidth >= 902;
  }

  logBackdropClick() {
    console.log('Backdrop clicked');
  }
  
}
