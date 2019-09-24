import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CategoryTreeService } from 'src/app/services/category-tree.service';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { MovementFormAbstract } from '../../abstract/movement-form-abstract.component';
import { MovementFilter, MONTHS } from '../../../models/movement-filter';

@Component({
  selector: 'app-movement-filter',
  templateUrl: './movement-filter.component.html',
  styleUrls: ['./movement-filter.component.scss']
})
export class MovementFilterComponent extends MovementFormAbstract implements OnInit, OnDestroy {
  
  movementFilterFormGroup: FormGroup;

  months = MONTHS;

  minDate : Date = new Date(2000, 0, 1);

  constructor(public dialogRef: MatDialogRef<MovementFilterComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: MovementFilter,
    protected _categoryService: CategoryTreeService,
    protected _bankAccountService: BankAccountService,
    protected _creditCardService: CreditCardService) {

    super(_categoryService, _bankAccountService, _creditCardService);

    this.movementFilterFormGroup = this._formBuilder.group(
      {
        purchaseInitialDate: [ this.data ? this.data.purchaseInitialDate : null],
        purchaseFinalDate: [ this.data ? this.data.purchaseFinalDate : null],
        purchaseMonth: [this.data ? this.data.purchaseMonth : null],
        purchaseYear: [this.data ? this.data.purchaseYear : null],
        paymentInitialDate: [ this.data ? this.data.paymentInitialDate : null],
        paymentFinalDate: [ this.data ? this.data.paymentFinalDate : null],
        paymentMonth: [this.data ? this.data.paymentMonth : null],
        paymentYear: [this.data ? this.data.paymentYear : null],
        store: [this.data ? this.data.store : null],
        categories: [this.data && this.data.categories ? this.data.categories.map(c => c.id) : null],
        bankAccounts: [this.data && this.data.bankAccounts ? this.data.bankAccounts.map(b => b.id) : null],
        creditCards: [this.data && this.data.creditCards  ? this.data.creditCards.map(c => c.id) : null]
      }
    );

   /* this.movementFilterFormGroup.valueChanges.subscribe( values => {      
      this.purchaseInitialDate = values.purchaseInitialDate;
      console.log(typeof this.purchaseInitialDate);

      console.log(typeof new Date(2001, 1, 1));
    } );*/

  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy(): void {    
  }

  resetForm(){
    this.movementFilterFormGroup.reset();
  }

  filter(){
    const controls = this.movementFilterFormGroup.controls;

    const movementFilter : MovementFilter = {
      store : controls.store.value,
      bankAccounts : controls.bankAccounts.value ? controls.bankAccounts.value.map( (bankAccountId: string) => this._getBankAccount( bankAccountId ) ) : null,
      categories : controls.categories.value ? controls.categories.value.map( (categoriesId: string) => this._getCategory( categoriesId ) ) : null,
      creditCards : controls.creditCards.value ? controls.creditCards.value.map( (creditCardId: string) => this._getCreditCard( creditCardId ) ) : null,

      paymentFinalDate : controls.paymentFinalDate.value,
      paymentInitialDate : controls.paymentInitialDate.value,
      paymentMonth : controls.paymentMonth.value,
      paymentYear : controls.paymentYear.value,

      purchaseFinalDate : controls.purchaseFinalDate.value,
      purchaseInitialDate : controls.purchaseInitialDate.value,
      purchaseMonth : controls.purchaseMonth.value,
      purchaseYear : controls.purchaseYear.value
    };
  
    this.dialogRef.close(movementFilter);
  }

  closeDialog(){
    this.dialogRef.close( this.data );
  }
}