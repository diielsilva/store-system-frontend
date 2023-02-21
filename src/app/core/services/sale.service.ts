import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/app/environment/environment";
import { PaginatorDto } from "../dtos/generics/paginator.dto";
import { SaleProductDto } from "../dtos/sales/sale-product.dto";
import { SaveSaleDto } from "../dtos/sales/save-sale.dto";
import { SaleProductEntity } from "../entities/sale-product.entity";
import { SaleEntity } from "../entities/sale.entity";

@Injectable({
    providedIn: 'root'
})
export class SaleService {
    private api: string = `${environment.api}/sales`;
    private shoppingCart: SaleProductDto[] = [];

    constructor(private restClient: HttpClient) { }

    public getShoppingCart(): SaleProductDto[] {
        return this.shoppingCart;
    }

    public insertIntoShoppingCart(product: SaleProductDto): void {
        let haveEqualsProduct: boolean = false;

        for (let saleProduct of this.shoppingCart) {
            if (saleProduct.productId === product.productId) {
                haveEqualsProduct = true;

            }
        }

        if (haveEqualsProduct) {
            for (let saleProduct of this.shoppingCart) {
                if (saleProduct.productId === product.productId) {
                    saleProduct.amount += product.amount;

                }
            }
        } else {
            this.shoppingCart.push(product);
        }
    }

    public removeFromShoppingCart(saleProductDto: SaleProductDto): void {
        let shoppingCart: SaleProductDto[] = [];
        for (let saleProuct of this.shoppingCart) {
            if (saleProuct.productId != saleProductDto.productId) {
                shoppingCart.push(saleProuct);
            }
        }
        this.shoppingCart = shoppingCart;
    }

    public cleanShoppingCart(): void {
        this.shoppingCart = [];
    }

    public getActiveSales(page: number): Observable<PaginatorDto<SaleEntity[]>> {
        return this.restClient.get<PaginatorDto<SaleEntity[]>>(`${this.api}?page=${page}`);
    }

    public getSaleDetails(id: number): Observable<SaleProductEntity[]> {
        return this.restClient.get<SaleProductEntity[]>(`${this.api}/${id}/details`);
    }

    public saveSale(saveSale: SaveSaleDto): Observable<SaleEntity> {
        return this.restClient.post<SaleEntity>(`${this.api}`, saveSale);
    }

    public getTodaySales(): Observable<SaleEntity[]> {
        return this.restClient.get<SaleEntity[]>(`${this.api}/today`);
    }

    public getCartPdf(): Observable<Blob> {
        return this.restClient.post<Blob>(`${this.api}/cart/pdf`, this.shoppingCart, {
            responseType: 'blob' as 'json',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/pdf"
            },
        });
    }
}