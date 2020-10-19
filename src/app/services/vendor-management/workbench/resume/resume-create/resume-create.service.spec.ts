import { TestBed } from '@angular/core/testing';

import { ResumeCreateService } from './resume-create.service';

describe('ResumeCreateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResumeCreateService = TestBed.get(ResumeCreateService);
    expect(service).toBeTruthy();
  });
});
