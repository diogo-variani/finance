import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { ErrorResponse } from '../models/error-response';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

  private readonly DEFAULT_ACTION : string = 'close';

  private readonly DEFAULT_DURATION : number = 5000;
  
  private _successConfig : MatSnackBarConfig = {duration: this.DEFAULT_DURATION, verticalPosition: 'top'};

  private _errorConfig : MatSnackBarConfig = {duration: this.DEFAULT_DURATION, panelClass: ['error-message']};

  constructor(
    public snackBar: MatSnackBar,
    private zone: NgZone) {
  }

  showSuccess(message: string): void {
    // Had an issue with the snackbar being ran outside of angular's zone.
    this.zone.run(() => {
      this.snackBar.open(message, this.DEFAULT_ACTION, this._successConfig);
    });
  }

  showQuestion(message : string, actionLabel : string ) : Observable<void> {    
    const snackBarRef : MatSnackBarRef<SimpleSnackBar> = this.snackBar.open(message, actionLabel ? actionLabel : this.DEFAULT_ACTION, this._successConfig);
    return snackBarRef.onAction();    
  }

  showError(message: string | ErrorResponse): void {
    this.zone.run(() => {
      // The second parameter is the text in the button. 
      // In the third, we send in the css class for the snack bar.

      if( typeof message === 'string'){
        this.snackBar.open(message as string, this.DEFAULT_ACTION, this._errorConfig);
      }else{
        const errorResponse : ErrorResponse = message as ErrorResponse;
        this.snackBar.open(errorResponse.description as string, this.DEFAULT_ACTION, this._errorConfig);
      }
    });
  }
}