import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Product } from 'src/app/features/products/models/product';
import { SharedService } from './shared.service';
import { Item } from 'src/app/features/cart/models/cart';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private meta: Meta,
    private titleService: Title
  ) { }
  public setProductMetaTags(product: Product, sharedService: SharedService) {

    this.titleService.setTitle(`${product.name} - ${sharedService.appTitle}`);

    this.meta.addTags([
      { name: 'description', content: product.description },
      {
        property: 'og:name',
        content: `${product.name} -${sharedService.appTitle}`,
      },
      { property: 'og:site', content: 'website', },
      { property: 'og:url', content: sharedService.baseUrl + product.slug, },
      { property: 'og:image', content: product.image, },
      { property: 'og:description', content: product.description, },
      { property: 'og:site_name', content: sharedService.appTitle, },
    ]);
  }

  public setCartMetaTags(cartItem: Item, sharedService: SharedService) {

    this.titleService.setTitle(`${cartItem.name} - ${sharedService.appTitle}`);

    this.meta.addTags([
      {
        property: 'og:name', content: `${cartItem.name} -${sharedService.appTitle}`,
      },
      { property: 'og:site', content: 'website', },
      { property: 'og:url', content: sharedService.baseUrl + cartItem.slug, },
      { property: 'og:image', content: cartItem.image, },
      { property: 'og:site_name', content: sharedService.appTitle, },
    ]);
  }

}
