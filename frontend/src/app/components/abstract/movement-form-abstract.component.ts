import { OnInit } from '@angular/core';
import { CreditCard } from 'src/app/models/credit-card';
import { BankAccount } from 'src/app/models/bank-account';
import { Category } from 'src/app/models/category';
import { CategoryService } from 'src/app/services/category.service';
import { BankAccountService } from 'src/app/services/bank-account.service';
import { CreditCardService } from 'src/app/services/credit-card.service';

export abstract class MovementFormAbstract implements OnInit {

    categories: Category[];

    bankAccounts: BankAccount[];

    creditCards: CreditCard[];

    constructor(protected _categoryService: CategoryService,
        protected _bankAccountService: BankAccountService,
        protected _creditCardService: CreditCardService) {
    }

    ngOnInit(): void {
        this._categoryService.getEntities().subscribe(data => {
            this.categories = data;
        });

        this._bankAccountService.getEntities().subscribe(data => {
            this.bankAccounts = data;
        });

        this._creditCardService.getEntities().subscribe(data => {
            this.creditCards = data;
        });
    }

    protected _getCreditCard(creditCardId: string): CreditCard {
        return this.creditCards.filter(creditCard => creditCard.id === creditCardId).shift();
    }

    protected _getBankAccount(bankAccountId: string): BankAccount {
        return this.bankAccounts.filter(bankAccount => bankAccount.id === bankAccountId).shift();
    }

    protected _getCategory(categoryId: string): Category {
        return this.categories.filter(category => category.id === categoryId).shift();
    }
}