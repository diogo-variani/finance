import { DataSource } from '@angular/cdk/table';
import { Movement } from 'src/app/models/movement';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { MovementService } from 'src/app/services/movement.service';
import { finalize } from 'rxjs/operators';
import { PaginationResponse } from 'src/app/models/pagination/pagination-response';
import { Pagination } from 'src/app/models/pagination/pagination';

export class MovementDataSource implements DataSource<Movement>{

    private movementSubject = new BehaviorSubject<Movement[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    data : Movement[];
    pagination : Pagination;

    constructor(private movementService : MovementService){        
    }

    connect(collectionViewer: CollectionViewer): Observable<Movement[]> {
        return this.movementSubject.asObservable();
    }
    
    disconnect(collectionViewer: CollectionViewer): void {
        this.movementSubject.complete();
        this.loadingSubject.complete();
    }

    loadMovements( page? : number, size? : number, sortBy? : string, sortDir? : string ){
        this.loadingSubject.next(true);

        this.movementService.getMovements( page, size, sortBy, sortDir )
            .pipe(
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(pageResponse =>{ 
                this.data = pageResponse.data;
                this.pagination = pageResponse.page;
                this.movementSubject.next(pageResponse.data);
            });
    }
}