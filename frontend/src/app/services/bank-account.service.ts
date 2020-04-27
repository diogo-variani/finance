import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { FinanceService } from './finance.service';
import { BankAccount } from '../models/bank-account';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService extends FinanceService<BankAccount>{
  
  private _endpoint = '/api/finance/bankAccounts';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }

}