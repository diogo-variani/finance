import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { CreditCard } from 'src/app/models/credit-card';

@Component({
  selector: 'app-credit-card-dialog',
  templateUrl: './credit-card-dialog.component.html',
  styleUrls: ['./credit-card-dialog.component.scss']
})
export class CreditCardDialogComponent implements OnInit {

  validationMessages = {
    'name': [
      { type: 'required', message: 'Name is required' }
    ],
    'issuer': [
      { type: 'required', message: 'Issuer is required' }
    ],
    'number': [
      { type: 'required', message: 'Card number is required' }
    ]
  };

  creditCardFormGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<CreditCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreditCard,
    private _creditCardService: CreditCardService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {    
      
      this.creditCardFormGroup = this._formBuilder.group(
        {
          name: [this.data ? this.data.name : '', Validators.required],
          issuer: [this.data ? this.data.issuer : '', Validators.required],
          number: [this.data ? this.data.number : '', Validators.required]
        }
      );       

  }

  ngOnInit() {

  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const creditCard: CreditCard = {
      id: this.data ? this.data.id : null,
      name: this.creditCardFormGroup.controls.name.value,
      issuer: this.creditCardFormGroup.controls.issuer.value,
      number: this.creditCardFormGroup.controls.number.value
    }

    this._creditCardService.saveEntity( creditCard ).subscribe( newCreditCard => {
      this._snackBar.open(`Credit Card ${newCreditCard.name} has been ${newCreditCard.id ? 'edited' : 'created'} successfully!`);
      this.dialogRef.close(newCreditCard);
    });
  }
}