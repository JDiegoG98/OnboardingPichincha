import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login if no user data', () => {
    expect(guard.canActivate()).toBe(false);
  });

  it('should allow navigation if user data', () => {
    jest.spyOn(sessionStorage, 'getItem').mockReturnValue('test');
    expect(guard.canActivate()).toBe(true);
  });
});
