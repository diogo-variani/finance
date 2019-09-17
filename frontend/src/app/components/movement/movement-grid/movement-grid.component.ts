import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';

import { MovementDialogComponent } from '../movement-dialog/movement-dialog.component';
import { MovementService } from 'src/app/services/movement.service';
import { Movement } from 'src/app/models/movement';
import { SelectionModel } from '@angular/cdk/collections';
import { CategoryTreeService } from 'src/app/services/category-tree.service';
import { Category } from 'src/app/models/category';
import { BankAccount } from 'src/app/models/bank-account';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { CreditCard } from 'src/app/models/credit-card';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { MovementFilterComponent } from '../movement-filter/movement-filter.component';
import * as moment from 'moment';
import { MovementFilter, MONTHS } from 'src/app/models/movement-filter';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-movement-grid',
  templateUrl: './movement-grid.component.html',
  styleUrls: ['./movement-grid.component.scss']
})
export class MovementGridComponent implements OnInit {

  private _categories = new Map<string, Category>();
  private _bankAccounts = new Map<string, BankAccount>();
  private _creditCards = new Map<string, CreditCard>();

  movementFilter : MovementFilter = new MovementFilter();

  NO_FILTER : string = '<not set>';

  showDetails : boolean = false;

  columnDefinitions = [
    { name: 'select', default: true },
    { name: 'store', default: true },
    { name: 'category', default: true },
    { name: 'bankAccount', default: false },
    { name: 'creditCard', default: false },
    { name: 'purchaseDate', default: true },
    { name: 'paymentDate', default: false },
    { name: 'debit', default: false },
    { name: 'value', default: true }
  ];
   
  isEditButtonDisabled: boolean = true;

  isDeleteButtonDisabled: boolean = true;

  dataSource: MatTableDataSource<Movement> = new MatTableDataSource();

  selection = new SelectionModel<Movement>(true, []);

  totalCost : number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor( public dialog: MatDialog,
               private _categoryService: CategoryTreeService,
               private _bankAccountService: BankAccountService,
               private _creditCardService: CreditCardService,
               private _movementService: MovementService,
               private _snackBar: MatSnackBar ) { 
  }

  ngOnInit() {
    this._movementService.getEntities().pipe(untilDestroyed(this)).subscribe(data => {
      this.dataSource.data = [];
      this.dataSource.data = data;

      this.totalCost = data.map(t => t).reduce((acc, movement) => movement.isDebit? acc - movement.value : acc + movement.value, 0);
    });
    this.dataSource.sort = this.sort;

    this._categoryService.getEntities().pipe(untilDestroyed(this)).subscribe(categories => {
      this._categories.clear();
      categories.forEach( category => {
        this._categories.set( category.id, category );
      });
    });

    this._bankAccountService.getEntities().pipe(untilDestroyed(this)).subscribe(bankAccounts => {
      this._bankAccounts.clear();
      bankAccounts.forEach( bankAccount => {
        this._bankAccounts.set( bankAccount.id, bankAccount );
      });
    });

    this._creditCardService.getEntities().pipe(untilDestroyed(this)).subscribe(creditCards => {
      this._creditCards.clear();
      creditCards.forEach( creditCard => {
        this._creditCards.set( creditCard.id, creditCard );
      });
    });

    this.selection.changed.pipe(untilDestroyed(this)).subscribe(item => {
      this.isEditButtonDisabled = this.selection.selected.length != 1;
      this.isDeleteButtonDisabled = this.selection.selected.length == 0;
    }); 

    this.dataSource.paginator = this.paginator;
  }

  addMovement() {
    this.dialog.open(MovementDialogComponent, {
      width: '700px',
      data: {}
    });
  }

  getCategoryDescription( categoryId: string ){
    const category : Category = this._categories.get( categoryId );
    return category == null ? "" : category.title;
  }

  getBankAccountDescription( bankAccountId: string ){
    const bankAccount : BankAccount = this._bankAccounts.get( bankAccountId );
    return bankAccount == null ? "" : `${bankAccount.bankName} (${bankAccount.name})`;
  }  

  getCreditCardDescription( creditCardId: string ){
    const creditCard : CreditCard = this._creditCards.get( creditCardId );
    return creditCard == null ? "" : `${creditCard.name} (${creditCard.issuer})`;
  }

  getDisplayedColumns(): string[] {

    if( this.showDetails ){
      return this.columnDefinitions.map(cd => cd.name);
    }else{    
      return this.columnDefinitions
      .filter(cd => cd.default)
      .map(cd => cd.name);
    }
  }

   /** Whether the number of selected elements matches the total number of rows. */
   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  editMovement() {
    this.dialog.open(MovementDialogComponent, {
      width: '700px',
      data: this.selection.selected[0]
    });
  }

  deleteMovement() {
    if( this.selection.selected.length == 1 ){
      
      const movement: Movement = this.selection.selected.shift();

      this._snackBar.open(`Delete movement ${movement.store} (${movement.value})?`, 'Yes', { duration: 5000 }).onAction().pipe(untilDestroyed(this)).subscribe(() => {
        this._movementService.deleteEntity(movement);
        this._snackBar.open(`Movement ${movement.store} (${movement.value}) has been deleted!`);
        this.selection.clear();
      });

    }else{

      const movements : Movement[] = this.selection.selected;

      this._snackBar.open(`Delete movements?`, 'Yes', { duration: 5000 }).onAction().pipe(untilDestroyed(this)).subscribe(() => {
        this._movementService.deleteAll(movements);
        this._snackBar.open(`Movements have been deleted!`);
        this.selection.clear();
      });

    }
  }

  showFilter(){

    if( !this.movementFilter ){
      this.movementFilter = new MovementFilter();
    }

    const dialogRef = this.dialog.open(MovementFilterComponent, {
      data: this.movementFilter,
      width: '700px'
    });

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe( result => {
      this.movementFilter = result;
    });
  }

  getFilterDescription() : String{
    
    let description : String[] = [];

    if( !this.movementFilter ){
      return this.NO_FILTER;
    }

    if( this.movementFilter.purchaseInitialDate ){
      const purchaseInitialDate : Date = this.movementFilter.purchaseInitialDate;
      description.push(`Purchase Inital Date >= ${moment( purchaseInitialDate ).format('l')}`);
    }

    if( this.movementFilter.purchaseFinalDate ){
      const purchaseFinalDate : Date = this.movementFilter.purchaseFinalDate;
      description.push(`Purchase Final Date <= ${moment( purchaseFinalDate ).format('l')}`);
    }

    if( this.movementFilter.purchaseMonth ){
      const purchaseMonth : number = this.movementFilter.purchaseMonth;
      description.push(`Purchase Month = ${MONTHS.filter( month => month.index === purchaseMonth).shift().description}`);
    }

    if( this.movementFilter.purchaseYear ){
      const purchaseYear : number = this.movementFilter.purchaseYear;
      description.push(`Purchase Year = ${purchaseYear}`);
    }

    if( this.movementFilter.paymentInitialDate ){
      const paymentInitialDate : Date = this.movementFilter.paymentInitialDate;
      description.push(`Payment Inital Date >= ${moment( paymentInitialDate ).format('l')}`);
    }

    if( this.movementFilter.paymentFinalDate ){
      const paymentFinalDate : Date = this.movementFilter.paymentFinalDate;
      description.push(`Payment Final Date <= ${moment( paymentFinalDate ).format('l')}`);
    }

    if( this.movementFilter.paymentMonth ){
      const paymentMonth : number = this.movementFilter.paymentMonth;
      description.push(`Payment Month = ${MONTHS.filter( month => month.index === paymentMonth).shift().description}`);
    }

    if( this.movementFilter.paymentYear ){
      const paymentYear : number = this.movementFilter.paymentYear;
      description.push(`Payment Year = ${paymentYear}`);
    }

    if( this.movementFilter.store ){
      const store : string = this.movementFilter.store;
      description.push(`Store LIKE ${store}`);
    }

    if( this.movementFilter.categories ){
      const categories : Category[] = this.movementFilter.categories;      
      description.push(`Category IN (${categories.map(c => c.title).join(', ')})`);
    }

    if( this.movementFilter.bankAccounts ){
      const bankAccounts : BankAccount[] = this.movementFilter.bankAccounts;      
      description.push(`Bank Account IN (${bankAccounts.map(b => b.name).join(', ')})`);
    }

    if( this.movementFilter.creditCards ){
      const creditCards : BankAccount[] = this.movementFilter.creditCards;      
      description.push(`Credit Card IN (${creditCards.map(c => c.name).join(', ')})`);
    }    

    if( !description || description.length == 0){
      return this.NO_FILTER;
    }

    return description.join(' AND ');
  }
}