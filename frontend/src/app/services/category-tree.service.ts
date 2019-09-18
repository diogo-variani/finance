import { Injectable } from '@angular/core';
import { Category } from '../models/category';
import { HttpClient } from '@angular/common/http';

import { FinanceService } from './finance.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

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

  getRoots() : Observable<Category[]> {
    const endpoint : string = `${this._endpoint}/roots`;

    return this.http.get<Category[]>(endpoint).pipe(
      tap(entities => console.log(`fetched ${entities.length} root(s)`))
    );
  }
}