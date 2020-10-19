import { TestBed } from '@angular/core/testing';

import { ConditionalOfferService } from './conditional-offer.service';

describe('ConditionalOfferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConditionalOfferService = TestBed.get(ConditionalOfferService);
    expect(service).toBeTruthy();
  });
});
