import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { CategoryTreeService } from 'src/app/services/category-tree.service';
import { Category } from 'src/app/models/category';
import { BankAccount } from 'src/app/models/bank-account';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { CreditCard } from 'src/app/models/credit-card';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { MovementService } from 'src/app/services/movement.service';
import { Movement } from 'src/app/models/movement';
import { MovementFormAbstract } from '../../abstract/movement-form-abstract.component';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-movement-dialog',
  templateUrl: './movement-dialog.component.html',
  styleUrls: ['./movement-dialog.component.scss']
})
export class MovementDialogComponent extends MovementFormAbstract implements OnInit {

  validationMessages = {
    'store': [
      { type: 'required', message: 'Store is required' }
    ],
    'value': [
      { type: 'required', message: 'Value is required' }
    ],
    'category': [
      { type: 'required', message: 'Category is required' }
    ],
    'bankAccount': [
      { type: 'required', message: 'Bank Account is required' }
    ],
    'purchaseDate': [
      { type: 'required', message: 'Purchase Date is required' }
    ],    
  };

  categoryFiltered: Observable<Category[]>;

  bankAccountFiltered: Observable<BankAccount[]>;

  creditCardFiltered: Observable<BankAccount[]>;

  movementFormGroup: FormGroup;

  @ViewChild('storeInput', {static: false}) storeInput: ElementRef;

  constructor(protected _categoryService: CategoryTreeService,
    protected _bankAccountService: BankAccountService,
    protected _creditCardService: CreditCardService,
    private _movementService: MovementService,
    @Inject(MAT_DIALOG_DATA) public data: Movement,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<MovementDialogComponent>,
    private _snackBar: MatSnackBar) {

    super(_categoryService, _bankAccountService, _creditCardService);

    this.movementFormGroup = this._formBuilder.group(
      {
        store: [this.data && this.data.store ? this.data.store : '', Validators.required],
        value: [this.data && this.data.value ? this.data.value : '', Validators.required],
        category: [ '', Validators.required],
        bankAccount: [ '', Validators.required],
        debit: [this.data && this.data.isDebit ? this.data.isDebit : true],
        purchaseDate: [this.data && this.data.purchaseDate ? this.data.purchaseDate : '', Validators.required],
        paymentDate: [this.data && this.data.paymentDate ? this.data.paymentDate : ''],
        creditCard: [ '']
      }
    );
  }

  ngOnInit() {
    super.ngOnInit();

    this._categoryService.getEntities().pipe(untilDestroyed(this)).subscribe(data => {
      if( this.categories ){
        const category : Category = this.data ? this._getCategory( this.data.categoryId ) : null;
        this.movementFormGroup.controls.category.setValue( category );
      }
    });

    this._bankAccountService.getEntities().pipe(untilDestroyed(this)).subscribe(data => {
      if( this.bankAccounts ){
        const bankAccount : BankAccount = this.data ? this._getBankAccount( this.data.bankAccountId ) : null;
        this.movementFormGroup.controls.bankAccount.setValue( bankAccount );
      }
    });

    this._creditCardService.getEntities().pipe(untilDestroyed(this)).subscribe(data => {
      if( this.creditCards ){
        const creditCard : CreditCard = this.data ? this._getCreditCard( this.data.creditCardId ) : null;
        this.movementFormGroup.controls.creditCard.setValue( creditCard );
      }
    });    

    this.categoryFiltered = this.movementFormGroup.controls.category.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.title),
        map(title => title ? this._filterCategory(title) : this.categories.slice())
      );

    this.bankAccountFiltered = this.movementFormGroup.controls.bankAccount.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.bankName),      
        map(bankName => bankName ? this._filterBankAccount(bankName) : this.bankAccounts.slice())
      );

      this.creditCardFiltered = this.movementFormGroup.controls.creditCard.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),      
        map(creditCard => creditCard ? this._filterCreditCard(creditCard) : this.creditCards.slice())
      );

  }

  displayCategory(category: Category): string | undefined {
    return category ? category.title : undefined;
  }

  displayBankAccount(bankAccount: BankAccount): string | undefined {
    return bankAccount ? `${bankAccount.bankName} (${bankAccount.name})` : undefined;
  }  

  displayCreditCard(creditCard: CreditCard): string | undefined {
    return creditCard ? `${creditCard.name} (${creditCard.issuer})` : undefined;
  }    

  private _filterCategory(title: string): Category[] {
    const filterValue = title.toLowerCase();

    return this.categories.filter(category => category.title.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterBankAccount(value: string): BankAccount[] {
    const filterValue = value.toLowerCase();

    return this.bankAccounts.filter(bankAccount => bankAccount.bankName.toLowerCase().indexOf(filterValue) === 0);    
  }

  private _filterCreditCard(value: string): CreditCard[] {
    const filterValue = value.toLowerCase();

    return this.creditCards.filter(creditCard => creditCard.name.toLowerCase().indexOf(filterValue) === 0);    
  }

  private _saveCurrentMovement() : Movement {
    const category : Category = this.movementFormGroup.controls.category.value;
    const bankAccount : BankAccount = this.movementFormGroup.controls.bankAccount.value;
    const creditCard : CreditCard = this.movementFormGroup.controls.creditCard.value;
    
    const movement: Movement = {
      id: this.data ? this.data.id : null,
      store: this.movementFormGroup.controls.store.value,
      value: this.movementFormGroup.controls.value.value,
      categoryId: category ? category.id : null,
      bankAccountId: bankAccount ? bankAccount.id : null,
      creditCardId: creditCard ? creditCard.id : null,
      purchaseDate: this.movementFormGroup.controls.purchaseDate.value,
      paymentDate: this.movementFormGroup.controls.paymentDate.value,
      isDebit: this.movementFormGroup.controls.debit.value
    }

    this._movementService.saveEntity(movement);
    return movement;
  }

  addMovement(){
    const movement : Movement = this._saveCurrentMovement();
    this._snackBar.open(`Movement ${movement.store} (${movement.value}) has been ${this.data.id ? 'edited' : 'created'} successfully!`);
    this.movementFormGroup.reset();
    this.storeInput.nativeElement.focus();
    
  }

  addMovementAndClose(){
    const movement : Movement = this._saveCurrentMovement();
    this._snackBar.open(`Movement ${movement.store} (${movement.value}) has been ${this.data.id ? 'edited' : 'created'} successfully!`);
    this.dialogRef.close();
  }
}