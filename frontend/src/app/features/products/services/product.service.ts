import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product, ProductFilter } from '../models/product';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  apiUrl = `${environment.apiUrl}/api/products`;
  options!: { responseType: 'json', }

  getAdminProducts(): Observable<any> {
    return this.http.get(this.apiUrl, this.options);
  }
  constructor(
    private http: HttpClient,
  ) { }

  /**
   * Fetch items/products from @STORE_BASE_URL
   */
  getAllProducts(
    limit = '0', sort = 'desc', category?: string, rating = 0, order = 'lowest',
    minValue = 0, maxValue = 2000,): Observable<Array<Product>> {
    return this.http.get<Array<Product>>(
      `${this.apiUrl}/${category ? '/category/' + category : ''
      }?sort=${sort}&rating=${rating}&order=${order}&limit=${limit}&minValue=${minValue}&maxValue=${maxValue}`
    );
  }

  getPagedProducts(productFilter: ProductFilter): Observable<any> {
    const qs = buildQueryString(productFilter);
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
    const qs = buildQueryString(productFilter);
    return this.http.get(`${this.apiUrl}?${qs}`, this.options);
  }

  /** Fetches categories of products from @STORE_BASE_URL
   * @returns an observable that emits categories that have been retrieved from the API
  */
  getAllCategories(): Observable<Array<string>> {
    return this.http.get<Array<string>>(`${this.apiUrl}/categories`);
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categories`, this.options);
  }

  getProduct(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${productId}`, { responseType: 'json', });
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
    return this.http.put<Product>(`${this.apiUrl}/${product._id}`, product);
  }

}

  /**
   * builds a QueryString
   * @param productFilter
   * contains limit is the number of items/products to retrieve from the API
   * sort specify how users can sort the results. By default results are sorted in descending order
   * category is the name of the category of items/products to retrieve from the API
   *  rating is the rating of items/products to retrieve from the API
   * @returns QueryString (qs)
   */

function buildQueryString(productFilter: ProductFilter): string {
  let qs = '';
  if (productFilter.category) { qs += `category=${productFilter.category}&`; }
  if (productFilter.name) { qs += `name=${productFilter.name}&`; }
  if (productFilter.description) { qs += `description=${productFilter.description}&`; }
  if (productFilter.sort) { qs += `sort=${productFilter.sort}&`; }
  if (productFilter.rating) { qs += `rating=${productFilter.rating}&`; }
  if (productFilter.minValue) { qs += `minValue=${productFilter.minValue}&`; }
  if (productFilter.maxValue) { qs += `maxValue=${productFilter.maxValue}&`; }
  if (productFilter.pageSize) { qs += `pageSize=${productFilter.pageSize}&`; }
  if (productFilter.pageNumber) { qs += `pageNumber=${productFilter.pageNumber}&`; }
  // Trim the trailing '&' if it exists
  return qs.endsWith('&') ? qs.slice(0, -1) : qs;
}
