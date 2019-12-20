//https://medium.com/@nsrathore/editable-mat-table-in-angular-7-b46578345b3a
import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';

import { FinanceService } from './finance.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends FinanceService<Category>{
  
  private _endpoint = 'http://finance-backend-proxy:81/finance/categories';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }
}