import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {

  constructor() {}

  log(message: string): void {
    console.log(message);
  }

  error(message: string, stack?: any): void {
    console.error(message);
    if (stack) {
      console.error(stack);
    }
  }

  warn(message: string): void {
    console.warn(message);
  }

  info(message: string): void {
    console.info(message);
  }

  debug(...message: any): void {
    console.debug(message);
  }
}