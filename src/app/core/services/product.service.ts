import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';
import { PaginatorDto } from '../dtos/generics/paginator.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private api: string = `${environment.api}/products`;

  constructor(private restClient: HttpClient) { }

  public saveProduct(product: ProductEntity): Observable<ProductEntity> {
    return this.restClient.post<ProductEntity>(this.api, product);
  }

  public searchProducts(name: string, page: number): Observable<PaginatorDto<ProductEntity[]>> {
    return this.restClient.get<PaginatorDto<ProductEntity[]>>(`${this.api}/search?name=${name}&page=${page}`);
  }

  public getActiveProducts(page: number): Observable<PaginatorDto<ProductEntity[]>> {
    return this.restClient.get<PaginatorDto<ProductEntity[]>>(`${this.api}?page=${page}`);
  }

  public getActiveProductById(id: number): Observable<ProductEntity> {
    return this.restClient.get<ProductEntity>(`${this.api}/${id}`);
  }

  public getInactiveProducts(page: number): Observable<PaginatorDto<ProductEntity[]>> {
    return this.restClient.get<PaginatorDto<ProductEntity[]>>(`${this.api}/inactive?page=${page}`);
  }

  public restoreInactiveProduct(id: number): Observable<ProductEntity> {
    return this.restClient.patch<ProductEntity>(`${this.api}/${id}/restore`, null);
  }

  public updateProduct(product: ProductEntity): Observable<ProductEntity> {
    return this.restClient.put<ProductEntity>(`${this.api}/${product.id!}`, product);
  }

  public removeProduct(id: number): Observable<void> {
    return this.restClient.delete<void>(`${this.api}/${id}`);
  }

}
