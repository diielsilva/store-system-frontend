import { AbstractEntity } from "./abstract.entity";
import { ProductEntity } from "./product.entity";
import { SaleEntity } from "./sale.entity";

export interface SaleProductEntity extends AbstractEntity {
    sale: SaleEntity,
    product: ProductEntity,
    priceAtSale: number,
    amount: number
}