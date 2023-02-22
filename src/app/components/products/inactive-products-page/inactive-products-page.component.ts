import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PaginatorDto } from 'src/app/core/dtos/generics/paginator.dto';
import { ProductEntity } from 'src/app/core/entities/product.entity';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProductService } from 'src/app/core/services/product.service';
import { DisposeProvider } from 'src/app/shared/providers/dispose.provider';
import { LoadingProvider } from 'src/app/shared/providers/loading.provider';
import { MessageProvider } from 'src/app/shared/providers/message.provider';

@Component({
  selector: 'app-inactive-products-page',
  templateUrl: './inactive-products-page.component.html',
  styleUrls: ['./inactive-products-page.component.css']
})
export class InactiveProductsPageComponent implements OnInit, OnDestroy {
  products: ProductEntity[] = [];
  actualPage: number = 0;
  totalProducts: number = 0;

  constructor(private productService: ProductService, public loadingProvider: LoadingProvider, private messageProvider: MessageProvider,
    private disposeProvider: DisposeProvider, public authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getInactiveProducts();
  }

  ngOnDestroy(): void {
    this.disposeProvider.dispose();
  }

  public getLoading(): boolean {
    return this.loadingProvider.getLoading();
  }

  private getInactiveProducts(): void {
    let subscription$: Subscription = this.productService.getInactiveProducts(this.actualPage).subscribe(
      {
        next: (paginatorProducts: PaginatorDto<ProductEntity[]>) => {
          this.products = paginatorProducts.content;
          this.totalProducts = paginatorProducts.totalElements;
        },
        error: (error: HttpErrorResponse) => {
          this.messageProvider.displayMessage('error', 'Erro na Listagem', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
          this.resetPaginator();
        }
      }
    );
    this.disposeProvider.insert(subscription$);
  }

  public restoreInactiveProduct(id: number): void {
    let subscription$: Subscription = this.productService.restoreInactiveProduct(id).subscribe(
      {
        next: () => {
          this.messageProvider.displayMessage('error', 'Sucesso na Edição', 'O produto foi reativado com sucesso!');
          this.getInactiveProducts();
        },
        error: (error: HttpErrorResponse) => {
          this.messageProvider.displayMessage('error', 'Erro na Edição', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
          this.resetPaginator();
        }
      }
    );
    this.disposeProvider.insert(subscription$);
  }

  public handlePageChange(event: LazyLoadEvent): void {
    this.changePage(event.first!);
    this.getInactiveProducts();
  }

  private changePage(rows: number): void {
    this.actualPage = rows / 20;
  }

  public resetPaginator(): void {
    this.products = [];
    this.actualPage = 0;
    this.totalProducts = 0;
  }

}
