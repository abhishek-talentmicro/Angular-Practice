import { TestBed } from '@angular/core/testing';

import { DynamicSaveService } from './dynamic-save.service';

describe('DynamicSaveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicSaveService = TestBed.get(DynamicSaveService);
    expect(service).toBeTruthy();
  });
});
