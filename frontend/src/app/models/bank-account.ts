import { FinanceEntity } from './finance-entity';

export class BankAccount extends FinanceEntity{
    name?: string;
    bankName?: string;
    iban?: string;    
}
