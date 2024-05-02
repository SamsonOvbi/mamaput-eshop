import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Product } from 'src/app/models/product';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private meta: Meta,
    private titleService: Title
  ) {}
  public setMetaTags(product: any, sharedService: SharedService) {

    this.titleService.setTitle(`${product.name} - ${sharedService.titleBlog}`);

    this.meta.addTags([
      { name: 'description', content: product.description },
      {
        property: 'og:name',
        content: `${product.name} -${sharedService.titleBlog}`,
      },
      { property: 'og:site', content: 'website', },
      { property: 'og:url', content: sharedService.baseUrl + product.slug, },
      { property: 'og:image', content: product.image, },
      { property: 'og:description', content: product.description, },
      { property: 'og:site_name', content: sharedService.titleBlog, },
    ]);
  }

}
