import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BankAccount } from '../models';
import { FinanceService } from './finance.service';


@Injectable({
  providedIn: 'root'
})
export class BankAccountService extends FinanceService<BankAccount>{
  
  private _endpoint = '/api/bankAccounts';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }

}