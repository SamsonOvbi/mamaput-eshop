import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { environment } from 'src/environments/environment';
=======
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7

@Injectable({
  providedIn: 'root'
})
export class SharedService {
<<<<<<< HEAD
  appTitle = 'MamaPut eShop'; 
  baseUrl = environment.baseUrl;
=======
  titleBlog = 'Mama Blog';  
  appTitle = 'MamaPut eShop'; 
  baseUrl = 'http://localhost:4200/';
>>>>>>> beb68af6c6759bf3a39e5a04d7f8887f9b5c9cb7
  userAddress: string = '';

  constructor(private http: HttpClient) { }
 
} 