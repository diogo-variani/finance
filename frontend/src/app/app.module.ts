//https://mdbootstrap.com/docs/angular/forms/basic/
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { MaterialModule } from './shared/material.module';

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { MainContentComponent } from './components/main-content/main-content.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { CategoryTreeComponent } from './components/category/category-tree/category-tree.component';
import { CategoryDialogComponent } from './components/category/category-dialog/category-dialog.component';
import { BankAccountDialogComponent } from './components/bank-account/bank-account-dialog/bank-account-dialog.component';
import { CreditCardDialogComponent } from './components/credit-card/credit-card-dialog/credit-card-dialog.component';
import { BankAccountGridComponent } from './components/bank-account/bank-account-grid/bank-account-grid.component';
import { CreditCardGridComponent } from './components/credit-card/credit-card-grid/credit-card-grid.component';
import { MovementGridComponent } from './components/movement/movement-grid/movement-grid.component';
import { MovementDialogComponent } from './components/movement/movement-dialog/movement-dialog.component';
import { MovementFilterComponent } from './components/movement/movement-filter/movement-filter.component';
import { FinanceBackendService } from './fake-backend/finance-backend.service';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MainContentComponent,
    SidenavComponent,
    CategoryTreeComponent,
    CategoryDialogComponent,
    BankAccountGridComponent,
    BankAccountDialogComponent,
    CreditCardDialogComponent,
    CreditCardGridComponent,
    MovementGridComponent,
    MovementDialogComponent,
    MovementFilterComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,   
    AppRoutingModule,
    FormsModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    environment.production ? [] : HttpClientInMemoryWebApiModule.forRoot(FinanceBackendService)
    
  ],
  entryComponents: [
    CategoryDialogComponent,
    BankAccountDialogComponent,
    CreditCardDialogComponent,
    MovementDialogComponent,
    MovementFilterComponent
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000, horizontalPosition: 'center'}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
