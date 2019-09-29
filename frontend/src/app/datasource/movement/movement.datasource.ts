import { DataSource } from '@angular/cdk/table';
import { Movement } from 'src/app/models/movement';
import { BehaviorSubject, Observable } from 'rxjs';
import { CollectionViewer } from '@angular/cdk/collections';
import { MovementService } from 'src/app/services/movement.service';
import { finalize } from 'rxjs/operators';
import { Pagination } from 'src/app/models/pagination/pagination';
import { MovementFilter } from 'src/app/models/movement-filter';

export class MovementDataSource implements DataSource<Movement>{

    movementSubject = new BehaviorSubject<Movement[]>([]);
    paginationSubject = new BehaviorSubject<Pagination>({} as Pagination);
    loadingSubject = new BehaviorSubject<boolean>(false);

    data : Movement[];
    page : Pagination;

    constructor(private movementService : MovementService){        
    }

    connect(collectionViewer: CollectionViewer): Observable<Movement[]> {
        return this.movementSubject.asObservable();
    }
    
    disconnect(collectionViewer: CollectionViewer): void {
        this.movementSubject.complete();
        this.loadingSubject.complete();
    }

    loadMovements( page? : number, size? : number, sortBy? : string, sortDir? : string, movementFilter? : MovementFilter ){
        this.loadingSubject.next(true);

        this.movementService.getMovements( page, size, sortBy, sortDir, movementFilter )
            .pipe(
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(pageResponse =>{ 
                this.data = pageResponse.data;
                this.page = pageResponse.page;
                this.paginationSubject.next(pageResponse.page);
                this.movementSubject.next(pageResponse.data);
            });
    }
}