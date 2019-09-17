import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { BankAccount } from 'src/app/models/bank-account';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html',
  styleUrls: ['./bank-account-dialog.component.scss']
})
export class BankAccountDialogComponent implements OnInit {

  validationMessages = {
    'name': [
      { type: 'required', message: 'Name is required' }
    ],
    'bankName': [
      { type: 'required', message: 'Bank Name is required' }
    ],
    'iban': [
      { type: 'required', message: 'IBAN is required' }
    ]
  };

  bankAccountFormGroup: FormGroup;

  constructor(public dialogRef: MatDialogRef<BankAccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BankAccount,
    private _bankAccountService: BankAccountService,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) {    
      
      this.bankAccountFormGroup = this._formBuilder.group(
        {
          name: [this.data ? this.data.name : '', Validators.required],
          bankName: [this.data ? this.data.bankName : '', Validators.required],
          iban: [this.data ? this.data.iban : '', Validators.required]
        }
      );       

  }

  ngOnInit() {

  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const bankAccount: BankAccount = {
      id: this.data ? this.data.id : null,
      name: this.bankAccountFormGroup.controls.name.value,
      bankName: this.bankAccountFormGroup.controls.bankName.value,
      iban: this.bankAccountFormGroup.controls.iban.value
    }

    this._bankAccountService.saveEntity(bankAccount).pipe(untilDestroyed(this)).subscribe( newBankAccount => {
      this.dialogRef.close(bankAccount);
      this._snackBar.open(`Bank Account ${bankAccount.name} has been ${this.data.id ? 'edited' : 'created'} successfully!`);
    });
  }
}