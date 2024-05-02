import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ProductListComponent } from './pages/product-list/product-list.component';
// import { RenderComponent } from './components/render/render.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { SearchComponent } from './pages/search/search.component';
import { ProductsRoutingModule } from './products-routing.module';

// import { RatingComponent } from 'src/app/core/components/rating/rating.component';
import { SliderComponent } from './components/slider/slider.component';
import { WriteReviewComponent } from './components/write-review/write-review.component';
import { ProductHeaderComponent } from './components/product-header/product-header.component';
import { ProductBoxComponent } from './components/product-box/product-box.component';
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from 'src/app/shared/material.module';

const componentsList = [
  ProductListComponent,
  ProductCardComponent,
  ProductDetailsComponent, 
  SearchComponent,
  SliderComponent,
  WriteReviewComponent,
  ProductCardComponent,
  ProductHeaderComponent,
  ProductBoxComponent,
]

const modulesList = [
  CommonModule, ProductsRoutingModule, SharedModule,
  MaterialModule, FormsModule, ReactiveFormsModule,
  HttpClientModule, CoreModule,
]

@NgModule({
  declarations: [componentsList,],
  imports: [modulesList],
  exports: [componentsList, ProductsRoutingModule]
})
export class ProductsModule { }
