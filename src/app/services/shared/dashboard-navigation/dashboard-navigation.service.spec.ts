import { TestBed } from '@angular/core/testing';

import { DashboardNavigationService } from './dashboard-navigation.service';

describe('DashboardNavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DashboardNavigationService = TestBed.get(DashboardNavigationService);
    expect(service).toBeTruthy();
  });
});
