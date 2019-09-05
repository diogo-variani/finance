import { FinanceEntity } from './finance-entity';

export class Movement extends FinanceEntity{
    store: string;
    value: number;
    categoryId: string;
    bankAccountId: string;
    creditCardId?: string;
    purchaseDate: Date;
    paymentDate?: Date;
    isDebit: boolean;
}
