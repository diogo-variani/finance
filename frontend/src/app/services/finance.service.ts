import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FinanceEntity } from '../models/finance-entity';

//http://mongodb.github.io/node-mongodb-native/3.2/tutorials/connect/

@Injectable({
  providedIn: 'root'
})
export abstract class FinanceService<E extends FinanceEntity>{

  protected httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor( protected http: HttpClient ){}

  protected abstract getEndpoint() : string;

  getEntities() : Observable<E[]> {
    const endpoint : string = this.getEndpoint();

    return this.http.get<E[]>(endpoint).pipe(
      tap(entities => console.log(`fetched ${entities.length} entity(ies)`))
    );
  }

  saveEntity(entity: E) : Observable<E> {
    if (entity.id) {
      return this.updateEntity(entity);
    } else {
      return this.createEntity(entity);
    }
  }

  private createEntity(entity: E ) : Observable<E> {
    let randomId: string = Math.random().toString(36).substring(7);
    entity.id = randomId;

    const endpoint : string = this.getEndpoint();

    return this.http.post<E>(endpoint, entity, this.httpOptions);
  }

  private updateEntity(entity: E) : Observable<E> {
    const endpoint : string = this.getEndpoint();
    const url = `${endpoint}/${entity.id}`;

    return this.http.put<E>(url, entity, this.httpOptions);   
  }

  deleteEntity(entity: E)  : Observable<E> {
    if (!entity.id) {
      return;
    }

    const endpoint : string = this.getEndpoint();
    const url = `${endpoint}/${entity.id}`;

    return this.http.delete<E>(url, this.httpOptions);
  }  
}