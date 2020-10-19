import { TestBed } from '@angular/core/testing';

import { ViewAssessmentsService } from './view-assessments.service';

describe('ViewAssessmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewAssessmentsService = TestBed.get(ViewAssessmentsService);
    expect(service).toBeTruthy();
  });
});
