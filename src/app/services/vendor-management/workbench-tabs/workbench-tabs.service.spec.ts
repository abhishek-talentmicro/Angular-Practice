import { TestBed } from '@angular/core/testing';

import { WorkbenchTabsService } from './workbench-tabs.service';

describe('WorkbenchTabsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WorkbenchTabsService = TestBed.get(WorkbenchTabsService);
    expect(service).toBeTruthy();
  });
});
