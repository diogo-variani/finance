import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

import * as categoryExample from './examples/category.example';
import * as bankAccountExample from './examples/bank-account.example';
import * as creditCardExample from './examples/credit-card.example';
import * as movementsExample from './movement.example';

export class FinanceBackendService implements InMemoryDbService{
    
    createDb(): {}  {
        return { 
            categories : categoryExample.CATEGORIES, 
            bankAccounts : bankAccountExample.BANK_ACCOUNTS,
            creditCards: creditCardExample.CREDIT_CARDS,
            movements: movementsExample.MOVEMENTS
        };
    }
}