import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatDialog, MatSnackBar, MatSort } from '@angular/material';
import { CreditCard } from 'src/app/models/credit-card';
import { SelectionModel } from '@angular/cdk/collections';
import { CreditCardService } from 'src/app/services/credit-card.service';
import { CreditCardDialogComponent } from '../credit-card-dialog/credit-card-dialog.component';

@Component({
  selector: 'app-credit-card-grid',
  templateUrl: './credit-card-grid.component.html',
  styleUrls: ['./credit-card-grid.component.scss']
})
export class CreditCardGridComponent  implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'issuer', 'number'];

  dataSource: MatTableDataSource<CreditCard> = new MatTableDataSource();

  selection = new SelectionModel<string>(false, []);

  isEditButtonEnable: boolean = true;

  private _creditCards : CreditCard[];

  constructor(private _creditCardService: CreditCardService,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.getCreditCards();

    this.dataSource.sort = this.sort;

    this.selection.changed.subscribe(item => {
      this.isEditButtonEnable = this.selection.selected.length == 0;
    })
  }

  getCreditCards(){
    this._creditCardService.getEntities().subscribe(creditCards => {
      this._creditCards = creditCards;

      this.dataSource.data = [];
      this.dataSource.data = creditCards;
    });
  }

  newCreditCard() {
    const dialogRef = this.dialog.open(CreditCardDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe( newCreditCard => {
      if( newCreditCard ){
        this.getCreditCards();
      }
    });     
  }

  editCreditCard() {
    const dialogRef = this.dialog.open(CreditCardDialogComponent, {
      width: '500px',
      data: this._getSelectedCreditCard()
    });

    dialogRef.afterClosed().subscribe( editedCreditCard => {
      if( editedCreditCard ){
        this.getCreditCards();
      }
    });    
  }

  deleteCreditCard() {
    const creditCard : CreditCard = this._getSelectedCreditCard();

    this._snackBar.open(`Delete credit card ${creditCard.name}?`, 'Yes', { duration: 5000 }).onAction().subscribe(() => {
      
      this._creditCardService.deleteEntity(creditCard).subscribe( b => {
        this.selection.clear();
        this.getCreditCards();
        this._snackBar.open(`Credit card ${creditCard.name} has been deleted!`);
      });

    });    
  }

  private _getSelectedCreditCard() : CreditCard {
    if( this.selection.isEmpty() ){
      return null;
    }

    return this._getCreditCard( this.selection.selected[0] );
  }

  private _getCreditCard(id: string) : CreditCard {
    if( !id ){
      return null;
    }

    const bankAccounts : CreditCard[] = this._creditCards.filter( b => b.id === id );

    if( bankAccounts && bankAccounts.length > 0 ){
      return bankAccounts.shift();
    }

    return null;
  }  
}
