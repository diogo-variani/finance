import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BankAccount } from 'src/app/models/bank-account';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-bank-account-dialog',
  templateUrl: './bank-account-dialog.component.html',
  styleUrls: ['./bank-account-dialog.component.scss']
})
export class BankAccountDialogComponent implements OnInit, OnDestroy {


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
    private _notificationService : NotificationService ) {
      
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

  ngOnDestroy(): void {
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
      this._notificationService.showSuccess(`Bank Account ${bankAccount.name} has been ${this.data ? 'edited' : 'created'} successfully!`);
    });
  }
}