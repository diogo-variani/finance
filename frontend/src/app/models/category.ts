import { FinanceEntity } from './finance-entity';

export class Category extends FinanceEntity{
    parentId?: string;
    title?: string;
    description?: string;    
    subCategories?: Category[] = [];
}
