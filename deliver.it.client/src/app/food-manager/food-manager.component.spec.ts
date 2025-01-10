import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodManagerComponent } from './food-manager.component';

describe('FoodManagerComponent', () => {
  let component: FoodManagerComponent;
  let fixture: ComponentFixture<FoodManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FoodManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FoodManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
