import { TestBed } from '@angular/core/testing';

import { HeadService } from './head.service';

describe('HeadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeadService = TestBed.get(HeadService);
    expect(service).toBeTruthy();
  });
});
