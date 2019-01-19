import { TestBed, inject } from '@angular/core/testing';

import { CanActivateViaAuthGuardService } from './can-activate-via-auth-guard.interceptor';

describe('CanActivateViaAuthGuardInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanActivateViaAuthGuardInterceptor]
    });
  });

  it('should be created', inject([CanActivateViaAuthGuardInterceptor], (service: CanActivateViaAuthGuardInterceptor) => {
    expect(service).toBeTruthy();
  }));
});
