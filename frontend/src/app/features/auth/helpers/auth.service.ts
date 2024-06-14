import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserInfo } from '../models/user';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  apiUrl = `${environment.apiUrl}/api/auth`;

  private currentUserSubject: BehaviorSubject<UserInfo | null>;
  public currentUser: Observable<UserInfo | null>;

  constructor(
    private http: HttpClient,
    private locStorageService: LocalStorageService,
    ) {
    this.currentUserSubject = new BehaviorSubject<UserInfo | null>(
      locStorageService.getItem('currentUser')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserInfo | null {
    return this.currentUserSubject.value;
  }

  login(reqBody: any) {
    // const reqBody = { email, password, };
    return this.http.post<UserInfo>(`${this.apiUrl}/login`, reqBody)
      .pipe(map((user) => {
          this.locStorageService.setItem('currentUser', user);
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  // register(name: string, email: string, password: string) {
  register(reqBody: any) {
    return this.http.post<UserInfo>(`${this.apiUrl}/register`, reqBody)
      .pipe(map((user) => {
          this.locStorageService.setItem('currentUser', user);
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  // update(name: string, email: string, password: string) {
  updateProfile(reqBody: any) {
    // const reqBody = { name, email, password, };
    return this.http.put<UserInfo>(`${this.apiUrl}/update-profile`, reqBody)
      .pipe(map((user) => {
          this.locStorageService.setItem('currentUser', user);
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  forgotPassword(data: any) {
    return this.http.post<UserInfo>(`${this.apiUrl}/forgot-password`, data);
  }

}
