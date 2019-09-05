import { Category } from './category';
import { BankAccount } from './bank-account';
import { CreditCard } from './credit-card';

export class MovementFilter {
  purchaseInitialDate? : Date;
  purchaseFinalDate? : Date;
  purchaseMonth? : number;
  purchaseYear? : number;

  paymentInitialDate? : Date;
  paymentFinalDate? : Date;
  paymentMonth? : number;
  paymentYear? : number;

  store? : string;
  categories? : Category[];
  bankAccounts? : BankAccount[];
  creditCards? : CreditCard[];
}

class Month{
  index : number;
  description : string;
}

export const MONTHS : Month[] = [
    { index : 1, description : "January"},
    { index : 2, description : "February"},
    { index : 3, description : "March"},
    { index : 4, description : "April"},
    { index : 5, description : "May"},
    { index : 6, description : "June"},
    { index : 7, description : "July"},
    { index : 8, description : "August"},
    { index : 9, description : "September"},
    { index : 10, description : "October"},
    { index : 11, description : "November"},
    { index : 12, description : "December"}
];