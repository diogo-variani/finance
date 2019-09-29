import { Injectable } from '@angular/core';

import { Movement } from '../models/movement';
import { FinanceService } from './finance.service';

import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { PaginationResponse } from '../models/pagination/pagination-response';
import { Observable } from 'rxjs';
import { MovementFilter } from '../models/movement-filter';

import * as moment from 'moment';

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

  getMovements(page? : number, size? : number, sortBy? : string, sortDir? : string, movementFilter? : MovementFilter ){
    const endpoint : string = this.getEndpoint();

    let params: any = {
      'page': page ? page : '', 
      'size': size ? size : '', 
      'sortBy': sortBy ? sortBy : '', 
      'sortDir': sortDir ? sortDir : '',
      'store' : movementFilter && movementFilter.store ? movementFilter.store : '',
      'initialValue' : movementFilter && movementFilter.initialValue ? movementFilter.initialValue : '',
      'finalValue' : movementFilter && movementFilter.finalValue ? movementFilter.finalValue : '',
      'categoryIds' : movementFilter && movementFilter.categories ? movementFilter.categories.map( c => c.id ).join(',') : '',
      'bankAccountsIds' : movementFilter && movementFilter.bankAccounts ? movementFilter.bankAccounts.join(',') : '',
      'creditCardIds' : movementFilter && movementFilter.creditCards ? movementFilter.creditCards.join(',') : '',
      'paymentInitialDate' : movementFilter && movementFilter.paymentInitialDate ? moment( movementFilter.paymentInitialDate ).format('YYYY-MM-DD') : '',
      'paymentFinalDate' : movementFilter && movementFilter.paymentFinalDate ? moment( movementFilter.paymentFinalDate ).format('YYYY-MM-DD') : '',
      'purchaseInitialDate' : movementFilter && movementFilter.purchaseInitialDate ? moment( movementFilter.purchaseInitialDate ).format('YYYY-MM-DD') : '',
      'purchaseFinalDate' : movementFilter && movementFilter.purchaseFinalDate ? moment( movementFilter.purchaseFinalDate ).format('YYYY-MM-DD') : ''
    };

    /* Removing null attributes from the object */
    Object.entries( params ).forEach( ([key, value]) => !value? delete params[key] : null );

    return this.http.get<PaginationResponse<Movement>>( endpoint, {params : params} ).pipe(
      tap(entities => console.log(`fetched ${entities.data.length} movement(es)`))
    );
  }

  deleteAll(movements: Movement[]) : Observable<any>{
    const params = {
      ids : movements.map(m => m.id).join(',')
    };

    return this.http.delete<any>( this._endpoint, {params : params} );
  }
}