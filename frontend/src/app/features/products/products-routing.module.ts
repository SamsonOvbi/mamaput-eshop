import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductSearchComponent } from './pages/product-search/search.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

const productRoutes: Routes = [
  { path: 'search', component: ProductSearchComponent },
  { path: 'product-details/:slug', component: ProductDetailsComponent },
  { path: '', component: ProductListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(productRoutes)
  ],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
