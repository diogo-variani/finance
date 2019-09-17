import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';

import { FinanceService } from './finance.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryTreeService extends FinanceService<Category>{
  
  private _endpoint = 'http://localhost:8080/categories/tree';

  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }
}