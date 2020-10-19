import { TestBed } from '@angular/core/testing';

import { GetMastersService } from './get-masters.service';

describe('GetMastersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GetMastersService = TestBed.get(GetMastersService);
    expect(service).toBeTruthy();
  });
});
