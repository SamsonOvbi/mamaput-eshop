import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { ROW_HEIGHT } from 'src/app/models/types';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() products?: Product[];
  @Input() showSlides = true;
  @Input() fullWidthMode = false;
  @Input() cols = 3;
  rowHeight = ROW_HEIGHT[this.cols];

  //Pass event to parent component
  @Output() addToCart = new EventEmitter<Product>();
  @Input() loading?: boolean;
  @Input() error?: boolean;

  constructor(
    private titleService: Title,
    private sharedService: SharedService
  ) {    
  }

  ngOnInit(): void {
    this.titleService.setTitle(`Product Card - ${this.sharedService.appTitle}`);
  }

  trackByProductId(index: any, product: any) {
    return product.id;
  }

  /** Emits the product gotten from the cart */
  onAddToCart(product: Product): void {
    this.addToCart.emit(product);
  }

}
