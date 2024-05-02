import { TestBed } from '@angular/core/testing';
import { SideBarComponent } from './side-bar.component';
import { Observable, Subscription, of } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ProductService } from 'src/app/shared/services/product.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSliderChange } from '@angular/material/slider';

describe('SideBarComponent', () => {
  let component: SideBarComponent;
  let breakpointObserver: BreakpointObserver;

  beforeEach(() => {
    const mockSidenav = { mode: '', open: jasmine.createSpy(), close: jasmine.createSpy() };
    TestBed.configureTestingModule({
      providers: [
        SideBarComponent,
        { provide: ProductService, useValue: {} },
        { provide: BreakpointObserver, useValue: {
          observe: () => new Observable<BreakpointState>((subscriber) => {
            subscriber.next({ matches: false } as BreakpointState);
            subscriber.complete();
          })
        }},
        { provide: MatSidenav, useValue: mockSidenav }
      ]
    });
    component = TestBed.inject(SideBarComponent);
    breakpointObserver = TestBed.inject(BreakpointObserver);
    component.sidenav = TestBed.inject(MatSidenav); // Ensure sidenav is injected
  });

  it('test_setDrawerMode', () => {
    spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: true } as BreakpointState));
    component.setDrawerMode();
    expect(component.sidenav.mode).toBe('push');
  
    breakpointObserver.observe('').subscribe((result) => {
      if (!result.matches) {
        expect(component.sidenav.mode).toBe('side');
      }
    });
  });

  it('test_onCategoryOrderRatingUpdated', () => {
    component.onCategoryUpdated('electronics');
    expect(component.category).toBe('electronics');

    component.onOrderUpdated('highest');
    expect(component.order).toBe('highest');

    component.onRatingUpdated(5);
    expect(component.rating).toBe(5);
  });

  it('should update the order property when onOrderUpdated is called', () => {
    const testOrder = 'highest';
    component.onOrderUpdated(testOrder);
    expect(component.order).toEqual(testOrder);
  });

  it('should update the rating when onRatingUpdated is called', () => {
    const newRating = 3; // Example rating
    component.onRatingUpdated(newRating);
    expect(component.rating).toBe(newRating);
  });
   
  it('test_onSliderInputChangeUpdated', () => {
    const sliderEvent = { source: null, value: 50 } as unknown as MatSliderChange;
    component.onSliderUpdated(sliderEvent);
    expect(component.sliderValue).toBe(50);
  });



});