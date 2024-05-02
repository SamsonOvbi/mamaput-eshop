// imports
import { Subscription, of } from 'rxjs';
import { ProductListComponent } from './product-list.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductService } from 'src/app/shared/services/product.service';
import { Product } from 'src/app/models/product';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('ProductListComponent', () => {

  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  let productService: ProductService;
  let getProductsSpy: jasmine.Spy;
  const productsSubscription: Subscription = new Subscription();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatSnackBarModule,
        // modules 
      ],
      declarations: [ProductListComponent],
      providers: [ProductService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);

    setup();
  });

  function setup() {
    getProductsSpy = spyOn(productService, 'getProducts')
      .and.returnValue(of([])); 
  }

  beforeEach(() => {
    getProductsSpy.calls.reset();
  });

  afterEach(() => {
    productsSubscription.unsubscribe(); // stop subscriptions
  
    fixture.destroy(); // detach component

    getProductsSpy.calls.reset(); 
    getProductsSpy.and.callThrough(); // reset spy
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call productService.getProducts on init', () => {
    component.ngOnInit();

    expect(getProductsSpy).toHaveBeenCalled();
  });

  it('should set productsList to response from service', () => {
    const mockProducts: Product[] = [];
    
    getProductsSpy.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(component.productsList).toEqual(mockProducts);
  });

});
