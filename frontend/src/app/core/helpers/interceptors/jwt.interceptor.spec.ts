import { TestBed } from '@angular/core/testing';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthService } from 'src/app/shared/services/auth.service';

class MockAuthService {
  // Allow currentUserValue to be either an object with a token or an empty object
  currentUserValue: { token?: string } = { token: 'fake-jwt-token' };
}

class MockHttpHandler extends HttpHandler {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return of({} as HttpEvent<any>);
  }
}

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let authService: MockAuthService;
  let httpHandler: HttpHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AuthService, useClass: MockAuthService }
      ],
    });

    interceptor = TestBed.inject(JwtInterceptor);
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    httpHandler = new MockHttpHandler();
  });

  // Verify interceptor creation
  it('should be created', () => {

    expect(interceptor).toBeTruthy();

  });

  it('should add an Authorization header when the user has a token', () => {
    const httpRequest = new HttpRequest('GET', '/test');
    const spy = spyOn(httpHandler, 'handle').and.callThrough();

    interceptor.intercept(httpRequest, httpHandler).subscribe();

    const modifiedRequest = spy.calls.first().args[0] as HttpRequest<any>;
    expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${authService.currentUserValue.token}`);
  });

  it('should not add an Authorization header when the user does not have a token', () => {
    authService.currentUserValue = {}; // Simulate a user without a token
    const httpRequest = new HttpRequest('GET', '/test');
    const spy = spyOn(httpHandler, 'handle').and.callThrough();

    interceptor.intercept(httpRequest, httpHandler).subscribe();

    const modifiedRequest = spy.calls.first().args[0] as HttpRequest<any>;
    expect(modifiedRequest.headers.get('Authorization')).toBeNull();
  });
});
