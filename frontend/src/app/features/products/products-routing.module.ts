import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './pages/search/search.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { ProductListComponent } from './pages/product-list/product-list.component';
import { ProductBoxComponent } from './components/product-box/product-box.component';

const routes: Routes = [
  { path: 'search', component: SearchComponent },
  { path: 'product-details/:slug', component: ProductDetailsComponent },
  // { path: 'product-box', component: ProductBoxComponent },
  { path: '', component: ProductListComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
]

@NgModule({
  imports: [
    CommonModule, RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
