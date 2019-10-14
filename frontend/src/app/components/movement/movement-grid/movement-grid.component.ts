//https://blog.angular-university.io/angular-material-data-table/
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatSort, MatDialogConfig } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';

import { MovementDialogComponent } from '../movement-dialog/movement-dialog.component';
import { MovementService } from 'src/app/services/movement.service';
import { Movement } from 'src/app/models/movement';
import { SelectionModel } from '@angular/cdk/collections';
import { Category } from 'src/app/models/category';
import { BankAccount } from 'src/app/models/bank-account';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { CreditCard } from 'src/app/models/credit-card';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { MovementFilterComponent } from '../movement-filter/movement-filter.component';
import * as moment from 'moment';
import { MovementFilter, MONTHS } from 'src/app/models/movement-filter';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs/internal/observable/merge';
import { CategoryService } from 'src/app/services/category.service';
import { Pagination } from 'src/app/models/pagination/pagination';
import { MovementDataSource } from 'src/app/datasources/movement.datasource';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-movement-grid',
  templateUrl: './movement-grid.component.html',
  styleUrls: ['./movement-grid.component.scss']
})
export class MovementGridComponent implements AfterViewInit, OnInit, OnDestroy {
  
  /* Domain arrays */
  private _categories = new Map<string, Category>();
  private _bankAccounts = new Map<string, BankAccount>();
  private _creditCards = new Map<string, CreditCard>();

  /* Represents the page size options available on the screen */
  pageSizeOptions : number[] = [5, 10, 20];


  movementFilter : MovementFilter = new MovementFilter();

  NO_FILTER : string = '<not set>';

  /* Enable or disable the movement table details */
  showDetails : boolean = false;

  /* 
   * Represents the visible columns on the screen. 
   * A default column means the column will be visible even without the 
   * showDetails attribute equals to true.
   */
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
     
  /* Enable or disable the edit button on the screen. */
  isEditButtonDisabled: boolean = true;

  /* Enable or disable the delete button on the screen. */
  isDeleteButtonDisabled: boolean = true;

  /* Movement table datasource */
  dataSource: MovementDataSource;

  pagination : Pagination;

  selection = new SelectionModel<string>(true, []);

  totalCost : number;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor( public dialog: MatDialog,
               private _categoryService: CategoryService,
               private _bankAccountService: BankAccountService,
               private _creditCardService: CreditCardService,
               private _movementService: MovementService,
               private _notificationService: NotificationService) { 
    
  }

  ngOnInit() {
    this.dataSource = new MovementDataSource( this._movementService );
    
    this._subscribeMovementRefresh();    
    this._subscribePaginationRefresh();
    
    this.dataSource.loadMovements(0, this.pageSizeOptions[0]);
    
    this._loadCategories();
    this._loadBankAccounts();
    this._loadCreditCards();

    this._subscribeSelectionChanges();
  }

  ngOnDestroy(): void {    
  }

  ngAfterViewInit() {

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
          tap(() => this.loadMovementsPage())
      )
      .subscribe();   
  }  

  private _subscribeSelectionChanges(){
    /* Subscribe selection changes */
    this.selection.changed.pipe(untilDestroyed(this)).subscribe(item => {
      console.log( this.selection.selected.length );
      this.isEditButtonDisabled = this.selection.selected.length != 1;
      this.isDeleteButtonDisabled = this.selection.selected.length == 0;
    }); 
  }

  private _subscribeMovementRefresh(){
    /* Subscribe to movement loading */
    this.dataSource.movementSubject.subscribe( movements => {      

      const selected : string[] = this.selection.selected;
      this.selection.clear();      

      /* Reset  the movements selected after the table reload */
      if( selected ){
        selected.filter( id => this.exist(id) ).forEach( id => this.selection.toggle(id) );
      }
    });
  }

  private _subscribePaginationRefresh(){
    /* Subscribe to pagination load */
    this.dataSource.paginationSubject.subscribe( pagination => {
      this.pagination = pagination;
    });
  }

  private _loadCategories(){
    /* Load categories */
    this._categoryService.getEntities().pipe(untilDestroyed(this)).subscribe(categories => {
      this._categories = new Map(
        categories.map(c => [ c.id, c] )
      );
    });
  }

  private _loadBankAccounts(){
    /* Load bank account */
    this._bankAccountService.getEntities().pipe(untilDestroyed(this)).subscribe(bankAccounts => {
      this._bankAccounts = new Map(
        bankAccounts.map(c => [ c.id, c] )
      );      
    });
  }

  private _loadCreditCards(){
    /* Load credit cards */
    this._creditCardService.getEntities().pipe(untilDestroyed(this)).subscribe(creditCards => {
      this._creditCards = new Map(
        creditCards.map(c => [ c.id, c] )
      );
    });
  }

  loadMovementsPage(){
    this.dataSource.loadMovements( this.paginator.pageIndex, this.paginator.pageSize, this.sort.active, this.sort.direction, this.movementFilter );
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
        this.dataSource.data.forEach(row => this.selection.select(row.id));
  }

  addMovement() {
    this._showMovementDialog();
  }

  editMovement() {
    /* Getting the selected movement */    
    const selectedMovement : Movement = this._getSelectedMovements()[0];
    this._showMovementDialog( selectedMovement );
  }

  private _showMovementDialog( data? : Movement ){
    const params : MatDialogConfig = {
      width: '700px'
    };

    if( data ){
      params.data = data;
    }

    const dialogRef = this.dialog.open(MovementDialogComponent, params);

    dialogRef.afterClosed().pipe(
      untilDestroyed(this)
    ).subscribe(result => {        
      if (result) {
        this.loadMovementsPage();
      }
    });    
  }

  deleteMovement() {
    console.log( this.selection.selected.length );
    if( this.selection.selected.length == 1 ){
      
      const movement: Movement = this._getSelectedMovements()[0];

      this._notificationService.showQuestion(`Delete movement ${movement.store} (${movement.value})?`, 'Yes').pipe(untilDestroyed(this)).subscribe(() => {
        this._movementService.deleteEntity(movement).subscribe( m => {
          this._notificationService.showSuccess(`Movement ${movement.store} (${movement.value}) has been deleted!`);
          this.loadMovementsPage();
        });
      });

    }else{

      const movements : Movement[] = this._getSelectedMovements();

      this._notificationService.showQuestion(`Delete movements?`, 'Yes').pipe(untilDestroyed(this)).subscribe(() => {
        this._movementService.deleteAll(movements).subscribe(m => {
          this._notificationService.showSuccess(`Movements have been deleted!`);
          this.loadMovementsPage();
        });
      });
    }
  }

  private _getSelectedMovements() : Movement[] {
    /* Getting the selected movement */    
    const selectedMovements : Movement[] = this.dataSource.data.filter( m => this.selection.selected.some( selectedId => selectedId === m.id ) );
    return selectedMovements;
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
      if( result ){
        this.movementFilter = result;
        this.loadMovementsPage();
      }
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
      description.push(`Purchase Year = ${this.movementFilter.purchaseYear}`);
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
      description.push(`Payment Year = ${this.movementFilter.paymentYear}`);
    }

    if( this.movementFilter.store ){
      description.push(`Store LIKE ${this.movementFilter.store}`);
    }

    if( this.movementFilter.initialValue ){      
      description.push(`value >= ${this.movementFilter.initialValue}`);
    }

    if( this.movementFilter.finalValue ){      
      description.push(`value <= ${this.movementFilter.finalValue}`);
    }

    if( this.movementFilter.categories ){
      description.push(`Category IN (${this.movementFilter.categories.map(c => c.title).join(', ')})`);
    }

    if( this.movementFilter.bankAccounts ){
      description.push(`Bank Account IN (${this.movementFilter.bankAccounts.map(b => b.name).join(', ')})`);
    }

    if( this.movementFilter.creditCards ){
      description.push(`Credit Card IN (${this.movementFilter.creditCards.map(c => c.name).join(', ')})`);
    }    

    if( !description || description.length == 0){
      return this.NO_FILTER;
    }

    return description.join(' AND ');
  }

  get creditCards() : CreditCard[] {
    return Array.from( this._creditCards ).map( c => c[1]);
  }

  get bankAccounts() : BankAccount[] {
    return Array.from( this._bankAccounts ).map( c => c[1]);
  }

  get categories() : Category[] {
    return Array.from( this._categories ).map( c => c[1]);
  }

  protected _getCreditCard(creditCardId: string): CreditCard {
    return this._creditCards.get( creditCardId );
  }

  protected _getBankAccount(bankAccountId: string): BankAccount {
    return this._bankAccounts.get( bankAccountId );      
  }

  protected _getCategory(categoryId: string): Category {
      return this._categories.get(categoryId);
  }

  private exist( movementId : string ) : boolean {
    return this.dataSource.data.some( m => m.id === movementId );
  }
}