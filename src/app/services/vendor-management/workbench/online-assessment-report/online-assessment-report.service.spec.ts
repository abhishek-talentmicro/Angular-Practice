import { TestBed } from '@angular/core/testing';

import { OnlineAssessmentReportService } from './online-assessment-report.service';

describe('OnlineAssessmentReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OnlineAssessmentReportService = TestBed.get(OnlineAssessmentReportService);
    expect(service).toBeTruthy();
  });
});
