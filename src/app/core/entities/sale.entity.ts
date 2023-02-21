import { PaymentType } from "../enums/payment-type";
import { AbstractEntity } from "./abstract.entity";
import { UserEntity } from "./user.entity";

export interface SaleEntity extends AbstractEntity {
    user: UserEntity,
    total: number,
    paymentType: PaymentType,
}