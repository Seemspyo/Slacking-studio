import { TestBed } from '@angular/core/testing';

import { HeaderInjectService } from './header-inject.service';

describe('HeaderInjectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeaderInjectService = TestBed.get(HeaderInjectService);
    expect(service).toBeTruthy();
  });
});
