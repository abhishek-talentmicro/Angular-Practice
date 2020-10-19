import { TestBed } from '@angular/core/testing';

import { ApplicantsMoveTagService } from './applicants-move-tag.service';

describe('ApplicantsMoveTagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicantsMoveTagService = TestBed.get(ApplicantsMoveTagService);
    expect(service).toBeTruthy();
  });
});
