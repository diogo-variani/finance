import { Component, OnInit, ViewChild } from '@angular/core';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { BankAccount } from 'src/app/models/bank-account';
import { MatSort, MatTableDataSource, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BankAccountDialogComponent } from '../bank-account-dialog/bank-account-dialog.component';

@Component({
  selector: 'app-bank-account-grid',
  templateUrl: './bank-account-grid.component.html',
  styleUrls: ['./bank-account-grid.component.scss']
})
export class BankAccountGridComponent implements OnInit {

  displayedColumns: string[] = ['select', 'name', 'bankName', 'iban'];

  dataSource: MatTableDataSource<BankAccount> = new MatTableDataSource();

  selection = new SelectionModel<string>(false, []);

  isEditButtonEnable: boolean = true;

  bankAccounts : BankAccount[];

  constructor(private _bankAccountService: BankAccountService,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.getBankAccounts();

    this.dataSource.sort = this.sort;

    this.selection.changed.subscribe(item => {
      this.isEditButtonEnable = this.selection.selected.length == 0;     
    });
  }

  getBankAccounts(){
    this._bankAccountService.getEntities().subscribe(data => {
      this.bankAccounts = data;
      this.dataSource.data = [];
      this.dataSource.data = data;
    });
  }

  newBankAccount() {
    const dialogRef = this.dialog.open(BankAccountDialogComponent, {
      width: '500px',
      data: {}
    });

    dialogRef.afterClosed().subscribe( newBankAccount => {
      if( newBankAccount ){
        this.getBankAccounts();
      }
    });    
  }

  editBankAccount() {
    const dialogRef = this.dialog.open(BankAccountDialogComponent, {
      width: '500px',
      data: this._getSelectedBankAccount()
    });

    dialogRef.afterClosed().subscribe( editedBankAccount => {
      if( editedBankAccount ){
        this.getBankAccounts();
      }
    });
  }

  deleteBankAccount() {
    const bankAccount: BankAccount = this._getSelectedBankAccount();

    this._snackBar.open(`Delete bank account ${bankAccount.name}?`, 'Yes', { duration: 5000 }).onAction().subscribe(() => {
      
      this._bankAccountService.deleteEntity(bankAccount).subscribe( b => {
        this._snackBar.open(`Bank Account ${bankAccount.name} has been deleted!`);
        
        this.selection.clear();
        this.getBankAccounts();
      });

    });
  }

  private _getSelectedBankAccount() : BankAccount {
    if( this.selection.isEmpty() ){
      return null;
    }

    return this._getBankAccount( this.selection.selected[0] );
  }


  private _getBankAccount(id: string) : BankAccount {
    if( !id ){
      return null;
    }

    const bankAccounts : BankAccount[] = this.bankAccounts.filter( b => b.id === id );

    if( bankAccounts && bankAccounts.length > 0 ){
      return bankAccounts.shift();
    }

    return null;
  }
}