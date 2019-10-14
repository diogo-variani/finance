import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  getClientErrorMessage(error: Error): string {
    return error.message ?
      error.message :
      error.toString();
  }

  getServerErrorMessage(error: HttpErrorResponse): string | ErrorResponse {
    if (!navigator.onLine) {
      return 'No Internet Connection';
    }
    if (ErrorResponse.prototype.isPrototypeOf(error.error)) {
      return error.error as ErrorResponse;
    }

    return error.message;
  }
}