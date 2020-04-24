import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MainContentComponent } from './components/main-content/main-content.component';
import { CategoryTreeComponent } from './components/category/category-tree/category-tree.component';
import { BankAccountGridComponent } from './components/bank-account/bank-account-grid/bank-account-grid.component';
import { CreditCardGridComponent } from './components/credit-card/credit-card-grid/credit-card-grid.component';
import { MovementGridComponent } from './components/movement/movement-grid/movement-grid.component';
import { AuthGuard } from './helpers';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: MainContentComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoryTreeComponent, canActivate: [AuthGuard] },
  { path: 'bankAccounts', component: BankAccountGridComponent, canActivate: [AuthGuard] },
  { path: 'creditCards', component: CreditCardGridComponent, canActivate: [AuthGuard] },
  { path: 'movements', component: MovementGridComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, DragDropModule]
})
export class AppRoutingModule { }