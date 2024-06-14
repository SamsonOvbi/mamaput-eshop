
import { Injectable } from '@angular/core';
import {
  HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  
  constructor(private authService: AuthService) {}
  
 /**
   * Intercept outgoing HTTP requests and add an Authorization header if a JWT token is present.
   * @param request - The outgoing HttpRequest object.
   * @param next - The next HttpHandler in the chain of interceptors.
   * @returns An Observable that emits the HTTP event stream.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Retrieve the current user token from the AuthService
    const { token } = this.authService.currentUserValue || {};

    // If the token exists, clone the request and add the authorization header
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      }); 
    }

    // Pass the request to the next handler in the chain
    return next.handle(request);
  }
}
