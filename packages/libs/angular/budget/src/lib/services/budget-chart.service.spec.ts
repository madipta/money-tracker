import { TestBed } from '@angular/core/testing';

import { BudgetChartService } from './budget-chart.service';

describe('BudgetChartService', () => {
  let service: BudgetChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BudgetChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
