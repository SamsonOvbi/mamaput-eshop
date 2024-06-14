import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/shared/services/auth.service';

// Injectable decorator marks this class as available to be provided and injected as a dependency
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  // Constructor to inject dependencies
  constructor(private router: Router, private authService: AuthService) {}

  // canActivate method to determine if the user can activate a route
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Use the authService to get the current user as an Observable
    return this.authService.currentUser.pipe(
      // Map the user object to a boolean indicating if navigation is allowed
      map(user => {
        if (user) {
          // If a user exists, return true to allow the route activation
          return true;
        } else {
          // If no user, redirect to the login page with the return URL
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false; // Prevent route activation
        }
      }),
      // Handle any errors during the authentication check
      catchError((error) => {
        console.error('Authentication check failed:', error); // Log the error
        this.router.navigate(['/login']); // Redirect to login on error
        return of(false); // Return false to prevent route activation
      }),
      // Ensure the output is always a boolean
      map(result => result === true),
      // Handle any errors that might not have been caught by the first catchError
      catchError(() => of(false)) // Return false to ensure route activation is denied
    );
  }
  
}