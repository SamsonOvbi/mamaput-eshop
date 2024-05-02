import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductBoxComponent } from './product-box.component';
import { ProductService } from 'src/app/shared/services/product.service';
import { SnackbarService } from 'src/app/shared/services/snackBar/snackbar.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { Title } from '@angular/platform-browser';
import { SharedService } from 'src/app/shared/services/shared.service';
import { of, throwError } from 'rxjs';
import { NO_ERRORS_SCHEMA, SimpleChange } from '@angular/core';
import { Product } from 'src/app/models/product';
import { Item } from 'src/app/models/cart';

describe('ProductBoxComponent', () => {
  let component: ProductBoxComponent;
  let fixture: ComponentFixture<ProductBoxComponent>;
  let titleService: Title;
  let productServiceMock: any;
  let cartServiceMock: any;
  let snackbarServiceMock: any;
  let titleServiceMock: any;
  let sharedServiceMock: any;
  let productsList: Product[] = [];
  let product: Product;

  beforeEach(async () => {
    productServiceMock = { getAllProducts: jasmine.createSpy('getAllProducts') }
    snackbarServiceMock = { openSB: jasmine.createSpy('openSB') };
    cartServiceMock = { addItem: jasmine.createSpy('addItem') };
    titleServiceMock = { setTitle: jasmine.createSpy('setTitle') };
    sharedServiceMock = { titleBlog: 'Mama Blog' };

    component = new ProductBoxComponent(
      productServiceMock,
      snackbarServiceMock,
      cartServiceMock,
      titleServiceMock,
      sharedServiceMock,  // Ensure this is correctly passed
    );

    await TestBed.configureTestingModule({
      declarations: [ProductBoxComponent],
      providers: [
        { provide: ProductService, useValue: { getAllProducts: () => of([]) } },
        // { provide: ProductService, useValue: productServiceMock }, 
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: CartService, useValue: cartServiceMock },
        { provide: Title, useValue: titleServiceMock },
        { provide: SharedService, useValue: { titleBlog: 'Mama Blog' } },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(ProductBoxComponent);
    component = fixture.componentInstance;
    titleService = TestBed.inject(Title);
    fixture.detectChanges();
    productsList = [
      {
        _id: '1', id: 1, name: 'Test Product', slug: '', price: 100, image: '', brand: '',
        category: '', description: '', countInStock: 0, rating: 0, numReviews: 0, reviews: [],
      },
    ];
    product = {
      _id: '1', id: 1, name: 'Test Product', slug: '', price: 100, image: '', brand: '',
      category: '', description: '', countInStock: 0, rating: 0, numReviews: 0, reviews: [],
    };

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set title on init', () => {
    expect(titleServiceMock.setTitle).toHaveBeenCalledWith('Product List - Mama Blog');
  });

  it('should correctly update the number of products to display when onItemsCountChange is called', () => {
    const spy = spyOn(component, 'getProductList').and.callThrough();
    component.onItemsCountChange(30);
    expect(spy).toHaveBeenCalledWith(30);
  });

  it('should correctly update the layout when onUpdateColumnsCount is called', () => {
    component.onUpdateColumnsCount(3);
    expect(component.cols).toBe(3);
    expect(component.rowHeight).toBeDefined();
  });


  it('test_onAddToCart_success', () => {
    cartServiceMock.addItem = jasmine.createSpy('addItem').and.returnValue(of('Test Product'));
    component.onAddToCart(product);
    expect(cartServiceMock.addItem).toHaveBeenCalledWith({
      _id: '1', image: '', name: 'Test Product', slug: '', price: 100, quantity: 1
    });
    expect(snackbarServiceMock.openSB).toHaveBeenCalledWith('Test Product added to the cart', '');
  });

  it('test_onAddToCart_error', () => {

    const error = { message: 'Error adding product' };
    cartServiceMock.addItem.and.returnValue(throwError(() => error));
    component.onAddToCart(product);
    expect(snackbarServiceMock.openSB).toHaveBeenCalledWith('Error adding product \n Product Not added', 'error');
  });


  it('test_onAddToCart_extract_product_details', () => {
    cartServiceMock.addItem.and.callFake((item: Item) => {
      expect(item).toEqual(jasmine.objectContaining({
        _id: '1', image: '', name: 'Test Product', slug: '', price: 100, quantity: 1
      }));
      return of('Test Product');
    });
    component.onAddToCart(product);
  });


  it('test_onChanges_updates_products_list', () => {    
    const changesObj = {
      productsList: new SimpleChange(null, productsList, true)
    };
    component.ngOnChanges(changesObj);
    expect(component.products).toEqual(productsList);
  });

  it('test_onChanges_does_not_update_products_list_when_no_changes', () => {
    component.products = productsList;
    const changesObj = {};
    component.ngOnChanges(changesObj);
    expect(component.products).toEqual(productsList);
  });

  it('test_onChanges_handles_undefined_inputs', () => {
    const changesObj = {
      productsSearch: new SimpleChange([], undefined, false),
      productsList: new SimpleChange([], undefined, false)
    };
    component.ngOnChanges(changesObj);
    expect(component.products).toEqual([]);
  });

});