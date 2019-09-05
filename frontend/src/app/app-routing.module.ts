import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MainContentComponent } from './components/main-content/main-content.component';
import { CategoryTreeComponent } from './components/category/category-tree/category-tree.component';
import { BankAccountGridComponent } from './components/bank-account/bank-account-grid/bank-account-grid.component';
import { CreditCardGridComponent } from './components/credit-card/credit-card-grid/credit-card-grid.component';
import { MovementGridComponent } from './components/movement/movement-grid/movement-grid.component';

const routes: Routes = [
  { path: '', component: MainContentComponent },
  { path: 'categories', component: CategoryTreeComponent },
  { path: 'bankAccounts', component: BankAccountGridComponent },
  { path: 'creditCards', component: CreditCardGridComponent },
  { path: 'movements', component: MovementGridComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, DragDropModule]
})
export class AppRoutingModule { }