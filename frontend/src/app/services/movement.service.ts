import { Injectable } from '@angular/core';

import { Movement } from '../models/movement';
import { FinanceService } from './finance.service';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MovementService extends FinanceService<Movement>{
  
  private _endpoint = 'api/creditCards';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }

  deleteAll(movements: Movement[]) {
    return null;
  }
}