import { TestBed } from '@angular/core/testing';

import { ApplicantAttachmentsService } from './applicant-attachments.service';

describe('ApplicantAttachmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicantAttachmentsService = TestBed.get(ApplicantAttachmentsService);
    expect(service).toBeTruthy();
  });
});
