import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductFilter } from '../../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = `${environment.apiUrl}/api/products`;
  options: any = { responseType: 'json', }

  getAdminProducts(): Observable<any> {
    return this.http.get(this.apiUrl, this.options);
  }
  constructor(
    private http: HttpClient,
    private httpClient: HttpClient,
  ) { }

  getProducts(): Observable<any> {
    return this.http.get(this.apiUrl, this.options);
  }

  /**
   * Fetch items/products from @STORE_BASE_URL
   * @param limit is the number of items/products to retrieve from the API
   * @param sort specify how users can sort the results. By default results are sorted in descending order
   * @param category is the name of the category of items/products to retrieve from the API
   * @param rating is the rating of items/products to retrieve from the API
   * @returns an observable that emits items/products that have been retrieved from the API
   */

  getAllProducts(
    limit = '20', sort = 'desc', category?: string, rating = 0, order = 'lowest',
    minValue = 0, maxValue = 2000,): Observable<Array<Product>> {
    return this.httpClient.get<Array<Product>>(
      `${this.apiUrl}/${category ? '/category/' + category : ''
      // }?sort=${sort}&rating=${rating}&limit=${limit}`
      }?sort=${sort}&rating=${rating}&order=${order}&limit=${limit}&minValue=${minValue}&maxValue=${maxValue}`
    );
  }

  getItems(data: any): Observable<any> {
    // const reqBody = { pageSize: data.pageSize, pageNumber: data.pageNumber, name: data.name, order: data.order, }
    let qs = '';
    if (data.category) { qs += `pageSize=${data.category}&`; }
    if (data.name) { qs += `name=${data.name}&`; }
    if (data.pageSize) { qs += `pageSize=${data.pageSize}&`; }
    if (data.pageNumber) { qs += `pageNumber=${data.pageNumber}&`; }

    if (data.order) { qs += `order=${data.order}&`; }
    if (data.rating) { qs += `rating=${data.rating}&`; }
    // Trim the trailing '&' if it exists
    qs = qs.endsWith('&') ? qs.slice(0, -1) : qs;
    return this.http.get(`${this.apiUrl}/paged?${qs}`, {
      responseType: 'json',
    });
  }

  createProduct(): Observable<any> {
    return this.http.post(this.apiUrl, this.options);
  }

  createReview(productId: string, comment: string, rating: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${productId}/reviews`,
      { comment, rating }, this.options);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${productId}`, this.options);
  }

  searchProducts(productFilter: ProductFilter): Observable<any> {
    let qs = '';
    if (productFilter.category) { qs += `category=${productFilter.category}&`; }
    if (productFilter.name) { qs += `name=${productFilter.name}&`; }
    if (productFilter.order) { qs += `order=${productFilter.order}&`; }
    if (productFilter.rating) { qs += `rating=${productFilter.rating}&`; }
    if (productFilter.minValue) { qs += `minValue=${productFilter.minValue}&`; }
    if (productFilter.maxValue) { qs += `maxValue=${productFilter.maxValue}&`; }
    // Trim the trailing '&' if it exists
    qs = qs.endsWith('&') ? qs.slice(0, -1) : qs;
    console.log('searchProducts - qs_: ', qs);
    return this.http.get(`${this.apiUrl}?${qs}`, this.options);
  }

  /** Fetches categories of products from @STORE_BASE_URL
   * @returns an observable that emits categories that have been retrieved from the API
  */
  getAllCategories(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(
      `${this.apiUrl}/categories`
    );
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`, this.options);
  }

  getProduct(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`, {
      responseType: 'json',
    });
  }

  getProductBySlug(slug: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/slug/${slug}`, this.options);
  }
  postFile(fileToUpload: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', fileToUpload, fileToUpload.name);
    return this.http.post(`${environment.apiUrl}/api/uploads`, formData, this.options);
  }

  update(product: Product) {
    return this.http.put<Product>(`${this.apiUrl}/${product._id}`,
      product
    );
  }

}
