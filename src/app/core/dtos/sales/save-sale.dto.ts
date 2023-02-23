import { SaleProductDto } from "./sale-product.dto";

export interface SaveSaleDto {
    paymentType: string,
    products: SaleProductDto[],
    percentDiscount?: number
}