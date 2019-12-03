import { TestBed } from '@angular/core/testing';

import { ViewLogService } from './view-log.service';

describe('ViewLogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewLogService = TestBed.get(ViewLogService);
    expect(service).toBeTruthy();
  });
});
