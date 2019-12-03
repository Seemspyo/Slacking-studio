import { TestBed, async, inject } from '@angular/core/testing';

import { MasterGuard } from './master.guard';

describe('MasterGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MasterGuard]
    });
  });

  it('should ...', inject([MasterGuard], (guard: MasterGuard) => {
    expect(guard).toBeTruthy();
  }));
});
