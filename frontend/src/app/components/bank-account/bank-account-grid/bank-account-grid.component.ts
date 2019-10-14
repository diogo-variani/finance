import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { BankAccount } from 'src/app/models/bank-account';
import { MatSort, MatTableDataSource, MatDialog, MatDialogConfig } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { BankAccountDialogComponent } from '../bank-account-dialog/bank-account-dialog.component';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-bank-account-grid',
  templateUrl: './bank-account-grid.component.html',
  styleUrls: ['./bank-account-grid.component.scss']
})
export class BankAccountGridComponent implements OnInit, OnDestroy {
  
  displayedColumns: string[] = ['select', 'name', 'bankName', 'iban'];

  dataSource: MatTableDataSource<BankAccount> = new MatTableDataSource();

  selection = new SelectionModel<string>(false, []);

  isBankAccountSelected: boolean = true;

  bankAccounts : BankAccount[];

  constructor(private _bankAccountService: BankAccountService,
              public dialog: MatDialog,
              private _notificationService: NotificationService) { }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    this.getBankAccounts();

    this.dataSource.sort = this.sort;

    this.selection.changed.pipe(untilDestroyed(this)).subscribe(item => {
      this.isBankAccountSelected = this.selection.selected.length == 0;     
    });
  }

  ngOnDestroy(): void {   
  }  

  getBankAccounts(){
    this._bankAccountService.getEntities().pipe(untilDestroyed(this)).subscribe(data => {
      this.bankAccounts = data;
      this.dataSource.data = [];
      this.dataSource.data = data;
    });
  }

  newBankAccount() {
    this._openDialog();
  }

  editBankAccount() {
    this._openDialog( this._getSelectedBankAccount() );
  }

  private _openDialog( bankAccount? : BankAccount ){

    const opts : MatDialogConfig = {
      width: '500px'
    }; 

    if( bankAccount ){
      opts.data = bankAccount;
    }
    
    const dialogRef = this.dialog.open(BankAccountDialogComponent, opts);

    dialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe( editedBankAccount => {
      if( editedBankAccount ){
        this.getBankAccounts();
      }
    });
  }

  deleteBankAccount() {
    const bankAccount: BankAccount = this._getSelectedBankAccount();

    this._notificationService.showQuestion(`Delete bank account ${bankAccount.name}?`, 'Yes').pipe(untilDestroyed(this)).subscribe(() => {
      
      this._bankAccountService.deleteEntity(bankAccount).pipe(untilDestroyed(this)).subscribe( b => {
        this._notificationService.showSuccess(`Bank Account ${bankAccount.name} has been deleted!`);
        
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