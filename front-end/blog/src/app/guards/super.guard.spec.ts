import { TestBed, async, inject } from '@angular/core/testing';

import { SuperGuard } from './super.guard';

describe('SuperGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SuperGuard]
    });
  });

  it('should ...', inject([SuperGuard], (guard: SuperGuard) => {
    expect(guard).toBeTruthy();
  }));
});
