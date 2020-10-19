import { TestBed } from '@angular/core/testing';

import { ResumeSearchService } from './resume-search.service';

describe('ResumeSearchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResumeSearchService = TestBed.get(ResumeSearchService);
    expect(service).toBeTruthy();
  });
});
