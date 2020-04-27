import { MatDialogRef } from '@angular/material';
import { FinanceEntity } from 'src/app/models';
import { FinanceService } from 'src/app/services';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export abstract class FinanceDialogComponent<T extends FinanceEntity>{

  constructor(public dialogRef: MatDialogRef<FinanceDialogComponent<T>>,    
    private _financeService: FinanceService<T>) {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): Observable<T> {
    const entity: T = this._createEntityBasedOnForm();

    return this._financeService.saveEntity(entity).pipe(
        tap(newEntity => this.dialogRef.close(newEntity))
    );
  }

  protected abstract _createEntityBasedOnForm() : T;
}