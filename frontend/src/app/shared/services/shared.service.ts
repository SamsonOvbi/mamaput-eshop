import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  titleBlog = 'Mama Blog'; // appTitle
  baseUrl = 'http://localhost:4200/';
  userAddress: string = '';

  constructor(private http: HttpClient) { }

} 