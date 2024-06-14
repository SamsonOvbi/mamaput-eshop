import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  appTitle = 'MamaPut eShop'; 
  baseUrl = environment.baseUrl;
  userAddress: string = '';

  constructor(private http: HttpClient) { }
 
} 