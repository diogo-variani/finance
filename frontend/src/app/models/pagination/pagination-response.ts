import { FinanceEntity } from '../finance-entity';
import { Pagination } from './pagination';
import { Links } from './links';

export class PaginationResponse<T extends FinanceEntity>{
    page : Pagination;
    data : T[];
    links? : Links;
}