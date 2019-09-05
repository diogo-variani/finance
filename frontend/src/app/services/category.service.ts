import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';

import { FinanceService } from './finance.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends FinanceService<Category>{
  
  private _endpoint = 'api/categories';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }
}