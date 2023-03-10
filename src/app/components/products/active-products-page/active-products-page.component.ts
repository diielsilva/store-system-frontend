import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-active-products-page',
  templateUrl: './active-products-page.component.html',
  styleUrls: ['./active-products-page.component.css']
})
export class ActiveProductsPageComponent implements OnInit, OnDestroy {
  dialog: boolean = false;
  updateForm?: FormGroup;
  searchForm?: FormGroup;
  products: ProductEntity[] = [];
  actualPage: number = 0;
  totalProducts: number = 0;
  selectedProduct?: ProductEntity;

  constructor(private productService: ProductService, private loadingProvider: LoadingProvider, private messageProvider: MessageProvider,
    private disposeProvider: DisposeProvider, private authService: AuthenticationService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.createSearchForm();
    this.getActiveProducts();
  }

  ngOnDestroy(): void {
    this.disposeProvider.dispose();
  }

  private createUpdateForm(product: ProductEntity): void {
    this.updateForm = this.formBuilder.group({
      name: [product.name, Validators.required],
      price: [product.price, [Validators.required, Validators.min(0)]],
      amount: [product.amount, [Validators.required, Validators.min(0)]]
    });
  }

  private createSearchForm(): void {
    this.searchForm = this.formBuilder.group({
      name: ['']
    });
  }

  public getLoading(): boolean {
    return this.loadingProvider.getLoading();
  }

  public displayUpdateForm(product: ProductEntity): void {
    this.selectedProduct = product;
    this.dialog = true;
    this.createUpdateForm(this.selectedProduct!);
  }

  public shouldDisableUpdateForm(): boolean {
    return this.loadingProvider.getLoading() || this.updateForm!.invalid;
  }

  public handlePageChange(event: LazyLoadEvent): void {
    this.changePage(event.first!);
    this.handleSearchProductForm();
  }

  private changePage(rows: number): void {
    this.actualPage = rows / 20;
  }

  public resetPaginator(): void {
    this.products = [];
    this.actualPage = 0;
    this.totalProducts = 0;
  }

  public isUserAdmin(): boolean {
    return this.authService.isUserAdmin();
  }

  public updateSelectedProductValues(): void {
    this.selectedProduct!.name = this.updateForm!.get('name')!.value
    this.selectedProduct!.price = this.updateForm!.get('price')!.value
    this.selectedProduct!.amount = this.updateForm!.get('amount')!.value
  }

  public handleSearchProductForm(): void {
    let name: string = this.searchForm === undefined ? '' : this.searchForm.get('name')!.value;
    this.searchProduct(name);
  }

  public handleUpdateProductForm(): void {
    if (this.updateForm!.valid) {
      this.updateSelectedProductValues();
      this.updateProduct();
    }
  }

  private searchProduct(name: string): void {
    let subscription$: Subscription = this.productService.searchProducts(name, this.actualPage).subscribe(
      {
        next: (paginatorProducts: PaginatorDto<ProductEntity[]>) => {
          this.products = paginatorProducts.content;
          this.totalProducts = paginatorProducts.totalElements;
        },
        error: (error: HttpErrorResponse) => {
          this.messageProvider.displayMessage('error', 'Erro na Listagem', error.error.message === undefined ? 'N??o foi poss??vel conectar ao servidor!' : error.error.message);
          this.resetPaginator();
        }
      }
    );
    this.disposeProvider.insert(subscription$);
  }

  private updateProduct(): void {
    let subscription$: Subscription = this.productService.updateProduct(this.selectedProduct!).subscribe({
      next: () => {
        this.dialog = false;
        this.messageProvider.displayMessage('success', 'Sucesso na Edi????o', 'O produto foi editado com sucesso!');
        this.getActiveProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.messageProvider.displayMessage('error', 'Erro na Edi????o', error.error.message === undefined ? 'N??o foi poss??vel conectar ao servidor!' : error.error.message);
        this.getActiveProducts();
      }
    });
    this.disposeProvider.insert(subscription$);
  }

  private getActiveProducts(): void {
    let subscription$: Subscription = this.productService.getActiveProducts(this.actualPage).subscribe(
      {
        next: (paginatorProducts: PaginatorDto<ProductEntity[]>) => {
          this.products = paginatorProducts.content;
          this.totalProducts = paginatorProducts.totalElements;
        },
        error: (error: HttpErrorResponse) => {
          this.messageProvider.displayMessage('error', 'Erro na Listagem', error.error.message === undefined ? 'N??o foi poss??vel conectar ao servidor!' : error.error.message);
          this.resetPaginator();
        }
      }
    );
    this.disposeProvider.insert(subscription$);
  }

  public removeProduct(id: number): void {
    let subscription$: Subscription = this.productService.removeProduct(id).subscribe(
      {
        next: () => {
          this.messageProvider.displayMessage('success', 'Sucesso na Remo????o', 'O produto foi removido com sucesso!');
          this.getActiveProducts();
        },
        error: (error: HttpErrorResponse) => {
          this.messageProvider.displayMessage('error', 'Erro na Listagem', error.error.message === undefined ? 'N??o foi poss??vel conectar ao servidor!' : error.error.message);
          this.resetPaginator();
        }
      }
    );
    this.disposeProvider.insert(subscription$);
  }
}
