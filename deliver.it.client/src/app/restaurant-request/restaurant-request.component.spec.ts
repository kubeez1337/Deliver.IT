import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantRequestComponent } from './restaurant-request.component';

describe('RestaurantRequestComponent', () => {
  let component: RestaurantRequestComponent;
  let fixture: ComponentFixture<RestaurantRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RestaurantRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
