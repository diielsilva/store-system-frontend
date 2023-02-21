import { AbstractEntity } from "./abstract.entity";

export interface ProductEntity extends AbstractEntity {
    name: string,
    price: number,
    amount: number
}