import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ProductService } from 'src/app/features/products/services/product.service';
import { ProductFilter } from 'src/app/features/products/models/product';
import { Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs';

interface SliderChangeEvent {
  value: number;
}

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit, OnDestroy {
  @Input() sidenav!: MatSidenav;
  @Input() isLargeScreen!: boolean;
  public pFilter!: ProductFilter;

  minValue!: number;
  maxValue!: number;
  sliderValue!: number;
  stepValue!: number;

  categories!: string[];
  sortFrom = ['lowest', 'highest', 'toprated', 'a-z', 'z-a']
  ratingFrom = [0, 1, 2, 3, 4];
  category = '';
  sort = 'lowest';
  rating = 0;
  sliderValues: number[] = [0, 100];

  productsSubscription: Subscription = Subscription.EMPTY;
  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
  ) {
  }
  ngOnInit() {
    this.productsSubscription = this.productService.getCategories().subscribe((categories) => (this.categories = categories));
    this.subscriptions.push(this.productsSubscription);
    this.minValue = 0.19;
    this.maxValue = 2000;
    this.sliderValue = 1;
    this.stepValue = 1;
  }

  onCategoryUpdated(_category: any): void {
    this.category = _category;
    if (!_category) {
      this.category = ''; this.sort = 'lowest'; this.rating = 0;
      this.minValue = 0.19; this.maxValue = 2000;
      this.router.navigate(['/home']);
    } else {
      const queryParams: NavigationExtras = {
        queryParams: { category: this.category },
        queryParamsHandling: 'merge', // Merge the new query parameters with the existing ones
      };
      this.router.navigate(['/search'], queryParams);
    }

  }

  onSortUpdated(_sort: any): void {
    this.sort = _sort;
    const queryParams: NavigationExtras = {
      queryParams: { sort: this.sort },
      queryParamsHandling: 'merge', // Merge the new query parameters with the existing ones
    };
    this.router.navigate(['/search'], queryParams);
  }

  onRatingUpdated(_rating: any): void {
    this.rating = _rating;
    const queryParams: NavigationExtras = {
      queryParams: { rating: this.rating },
      queryParamsHandling: 'merge', // Merge the new query parameters with the existing ones
    };
    this.router.navigate(['/search'], queryParams);
  }

  onPriceFilterUpdated(minValue: any, maxValue: any): void {
    this.minValue = minValue; this.maxValue = maxValue;
    const queryParams: NavigationExtras = {
      queryParams: { minValue: this.minValue, maxValue: this.maxValue },
      queryParamsHandling: 'merge', // Merge the new query parameters with the existing ones
    };
    this.router.navigate(['/search'], queryParams);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

}