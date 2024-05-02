import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Credentials, User } from '../../models/user';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl, {responseType: 'json', });
  }

  getUser(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${userId}`, {responseType: 'json', });
  }

  update(user: User) {
    const userId: string = user._id;
    // return this.http.put<User>(`${this.apiUrl}/${user._id}`, user );
    return this.http.put<User>(`${this.apiUrl}/${userId}`, user );
  }

  deleteUser(id: string) {
    const userId: string = id;
    // return this.http.put<User>(`${this.apiUrl}/${user._id}`, user );
    return this.http.post<User>(`${this.apiUrl}/${userId}`, userId );
  }
}
