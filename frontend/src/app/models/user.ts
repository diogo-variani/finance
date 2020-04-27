import { FinanceEntity } from './finance-entity';

export class User extends FinanceEntity{
    name: string;
    login: string;
    email: string;
}