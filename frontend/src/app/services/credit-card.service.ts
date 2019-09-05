import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreditCard } from '../models/credit-card';

import { FinanceService } from './finance.service';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CreditCardService extends FinanceService<CreditCard>{
  
  private _endpoint = 'api/creditCards';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }
}
