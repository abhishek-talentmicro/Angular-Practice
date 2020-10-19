import { TestBed } from '@angular/core/testing';

import { ImportUtilityService } from './import-utility.service';

describe('ImportUtilityService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImportUtilityService = TestBed.get(ImportUtilityService);
    expect(service).toBeTruthy();
  });
});
