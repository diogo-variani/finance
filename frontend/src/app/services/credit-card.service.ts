import { Injectable } from '@angular/core';

import { CreditCard } from '../models/credit-card';

import { FinanceService } from './finance.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService extends FinanceService<CreditCard>{
  
  private _endpoint = 'http://localhost:8080/creditCards';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }
}
