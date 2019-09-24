import { Injectable } from '@angular/core';

import { Movement } from '../models/movement';
import { FinanceService } from './finance.service';

import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { PaginationResponse } from '../models/pagination/pagination-response';

@Injectable({
  providedIn: 'root'
})
export class MovementService extends FinanceService<Movement>{
  
  private _endpoint = 'http://localhost:8080/movements';
  
  constructor( protected http: HttpClient ) {
    super( http );
  }

  protected getEndpoint(): string {
    return this._endpoint;
  }

  getMovements(page? : number, size? : number, sortBy? : string, sortDir? : string){
    const endpoint : string = this.getEndpoint();

    let params: any = {
      'page': page ? page : '', 
      'size': size ? size : '', 
      'sortBy': sortBy ? sortBy : '', 
      'sortDir': sortDir ? sortDir : ''
    };

    return this.http.get<PaginationResponse<Movement>>( endpoint, {params : params} ).pipe(
      tap(entities => console.log(`fetched ${entities.data.length} movement(es)`))
    );
  }

  deleteAll(movements: Movement[]) {
    return null;
  }
}