import { FinanceEntity } from './finance-entity';

export class CreditCard extends FinanceEntity{
    name: string;
    issuer: string;
    number: string;
}