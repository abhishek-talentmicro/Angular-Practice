import { TestBed } from '@angular/core/testing';

import { ProfileSettingsService } from './profile-settings.service';

describe('ProfileSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileSettingsService = TestBed.get(ProfileSettingsService);
    expect(service).toBeTruthy();
  });
});
