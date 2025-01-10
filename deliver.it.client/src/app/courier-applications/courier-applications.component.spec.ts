import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourierApplicationsComponent } from './courier-applications.component';

describe('CourierApplicationsComponent', () => {
  let component: CourierApplicationsComponent;
  let fixture: ComponentFixture<CourierApplicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourierApplicationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourierApplicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
