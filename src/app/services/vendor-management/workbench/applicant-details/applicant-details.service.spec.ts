import { TestBed } from '@angular/core/testing';

import { ApplicantDetailsService } from './applicant-details.service';

describe('ApplicantDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicantDetailsService = TestBed.get(ApplicantDetailsService);
    expect(service).toBeTruthy();
  });
});
