import { FinanceEntity } from './finance-entity';

export class User extends FinanceEntity{
    nome: string;
    login: string;
    email: string;
    profile: string;
}