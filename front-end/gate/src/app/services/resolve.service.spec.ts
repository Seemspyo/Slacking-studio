import { TestBed } from '@angular/core/testing';

import { ResolveService } from './resolve.service';

describe('ResolveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResolveService = TestBed.get(ResolveService);
    expect(service).toBeTruthy();
  });
});
