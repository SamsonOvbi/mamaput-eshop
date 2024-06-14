import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserInfo } from 'src/app/models';

class MockAuthService {
  // Ensure the emitted value matches the expected type UserInfo or null
  currentUser = of(null as UserInfo | null);
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let router: Router;
  let routeMock: Partial<ActivatedRouteSnapshot>;
  let stateMock: Partial<RouterStateSnapshot>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AuthGuard,
        { provide: AuthService, useClass: MockAuthService }
      ]
    });
    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    // Initialize mock objects
    routeMock = {}; // Adjust as necessary to match ActivatedRouteSnapshot structure
    stateMock = { url: '/some-url' }; // Adjust as necessary to match RouterStateSnapshot structure
  });

  it('test_canActivate_returns_true_when_user_authenticated', (done: DoneFn) => {
    authService.currentUser = of({
      _id: '123',
      username: 'testuser',
      email: 'test@example.com',
      isAdmin: false,
      token: 'some-token'
    } as UserInfo);
    guard.canActivate(routeMock as ActivatedRouteSnapshot, stateMock as RouterStateSnapshot).subscribe(isAllowed => {
      expect(isAllowed).toBeTrue();
      done();
    });
  });

  it('test_canActivate_returns_false_and_navigate_to_login_when_user_not_authenticated', (done: DoneFn) => {
    authService.currentUser = of(null); // Simulate user is not authenticated
    guard.canActivate(routeMock as ActivatedRouteSnapshot, stateMock as RouterStateSnapshot).subscribe(isAllowed => {
      expect(isAllowed).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: stateMock.url } });
      done();
    });
  });

  it('test_canActivate_handles_error_returns_false_and_navigate_to_login', (done: DoneFn) => {
    authService.currentUser = throwError('Error'); // Simulate error in authentication process
    guard.canActivate(routeMock as ActivatedRouteSnapshot, stateMock as RouterStateSnapshot).subscribe(isAllowed => {
      expect(isAllowed).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});