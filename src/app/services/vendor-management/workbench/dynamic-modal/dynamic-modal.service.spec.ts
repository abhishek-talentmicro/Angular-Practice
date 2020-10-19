import { TestBed } from '@angular/core/testing';

import { DynamicModalService } from './dynamic-modal.service';

describe('DynamicModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicModalService = TestBed.get(DynamicModalService);
    expect(service).toBeTruthy();
  });
});
