import { TestBed } from '@angular/core/testing';

import { ResumeImportService } from './resume-import.service';

describe('ResumeImportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResumeImportService = TestBed.get(ResumeImportService);
    expect(service).toBeTruthy();
  });
});
