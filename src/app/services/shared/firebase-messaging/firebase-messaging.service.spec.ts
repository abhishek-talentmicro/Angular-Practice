import { TestBed } from '@angular/core/testing';

import { FirebaseMessagingService } from './firebase-messaging.service';

describe('FirebaseMessagingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseMessagingService = TestBed.get(FirebaseMessagingService);
    expect(service).toBeTruthy();
  });
});
