import { SaleProductDto } from "./sale-product.dto";

export interface ShowPdfSaleDto {
    percentDiscount?: number,
    products: SaleProductDto[]
}