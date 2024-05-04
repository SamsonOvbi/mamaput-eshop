import { Component, Output, EventEmitter, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSidenav } from '@angular/material/sidenav';
import { ProductService } from 'src/app/shared/services/product.service';
import { Order } from 'src/app/models/types';
import { MatSliderChange, MatSliderRangeThumb, MatSliderThumb } from '@angular/material/slider'; //
import { BreakpointObserver } from '@angular/cdk/layout';

interface SliderChangeEvent {
  value: number;
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @Input() sidenav!: MatSidenav;

  @HostListener('window:resize', ['$event'])
  onResize(event: ResizeObserver) { this.setDrawerMode() };
  @HostListener('mousemove', ['$event'])
  onClick2(event: KeyboardEvent) { event.preventDefault(); this.setDrawerMode() };

  minValue!: number;
  maxValue!: number;
  sliderValue!: number;
  sliderValue_A2 = { lower: this.minValue, upper: this.maxValue };
  stepValue!: number;

  categories!: string[];
  category = '';
  order = 'lowest';
  orderFrom = ['lowest', 'highest', 'toprated', 'a-z', 'z-a']
  rating = 0;
  ratingFrom = [0, 1, 2, 3, 4];

  constructor(
    private productService: ProductService,
    private breakpointObserver: BreakpointObserver,
  ) {
  }
  ngOnInit() {
    this.productService.getCategories().subscribe((categories) => (this.categories = categories));
    this.minValue = 0.19;
    this.maxValue = 2000;
    this.sliderValue = 10;
    this.stepValue = 1;
  }

  setDrawerMode() {
    this.breakpointObserver.observe('(max-width: 900px)')
      .subscribe(result => {
        result.matches ? this.sidenav.mode = 'push' : this.sidenav.mode = 'side';

      });
    if (this.sidenav.mode === 'side') this.sidenav.open();
  }
  onCategoryUpdated(_category: any): void {
    this.category = _category;
  }

  onOrderUpdated(_order: any): void {
    this.order = _order;
  }

  onRatingUpdated(_rating: any): void {
    this.rating = _rating;
  }
  
  
}
