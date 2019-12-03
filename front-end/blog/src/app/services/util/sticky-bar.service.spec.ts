import { TestBed } from '@angular/core/testing';

import { StickyBarService } from './sticky-bar.service';

describe('StickyBarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StickyBarService = TestBed.get(StickyBarService);
    expect(service).toBeTruthy();
  });
});
