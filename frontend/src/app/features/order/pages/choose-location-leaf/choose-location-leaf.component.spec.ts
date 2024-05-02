import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseLocationLeafComponent } from './choose-location-leaf.component';

describe('ChooseLocationLeafComponent', () => {
  let component: ChooseLocationLeafComponent;
  let fixture: ComponentFixture<ChooseLocationLeafComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseLocationLeafComponent]
    });
    fixture = TestBed.createComponent(ChooseLocationLeafComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
