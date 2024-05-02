import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * @returns Retrieve @param key from local storage
   */
  getItem(key: string): any {
    const value = localStorage.getItem(key);
    if (value) {
      return JSON.parse(value || '{}');
    }
    return null;
  }

  deleteItem(key: string) {
    localStorage.removeItem(key);
  }
  /**Clear the local storage */
  clear(): void {
    localStorage.clear();
  }

}
