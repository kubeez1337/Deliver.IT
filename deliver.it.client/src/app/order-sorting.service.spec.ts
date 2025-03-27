import { TestBed } from '@angular/core/testing';

import { OrderSortingService } from './order-sorting.service';

describe('OrderSortingService', () => {
  let service: OrderSortingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderSortingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
