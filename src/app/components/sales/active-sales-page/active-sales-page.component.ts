import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { PaginatorDto } from 'src/app/core/dtos/generics/paginator.dto';
import { SaleProductEntity } from 'src/app/core/entities/sale-product.entity';
import { SaleEntity } from 'src/app/core/entities/sale.entity';
import { PaymentType } from 'src/app/core/enums/payment-type';
import { SaleService } from 'src/app/core/services/sale.service';
import { DisposeProvider } from 'src/app/shared/providers/dispose.provider';
import { LoadingProvider } from 'src/app/shared/providers/loading.provider';
import { MessageProvider } from 'src/app/shared/providers/message.provider';

@Component({
  selector: 'app-active-sales-page',
  templateUrl: './active-sales-page.component.html',
  styleUrls: ['./active-sales-page.component.css']
})
export class ActiveSalesPageComponent implements OnInit, OnDestroy {
  dialog: boolean = false;
  sales: SaleEntity[] = [];
  actualPage: number = 0;
  totalSales: number = 0;
  saleProducts: SaleProductEntity[] = [];

  constructor(public loadingProvider: LoadingProvider, private disposeProvider: DisposeProvider, private saleService: SaleService,
    private messageProvider: MessageProvider) { }

  ngOnInit(): void {
    this.getActiveSales();
  }

  ngOnDestroy(): void {
    this.disposeProvider.dispose()
  }

  private getActiveSales(): void {
    let subscription$: Subscription = this.saleService.getActiveSales(this.actualPage).subscribe(
      {
        next: (paginatorSales: PaginatorDto<SaleEntity[]>) => {
          this.sales = paginatorSales.content;
          this.totalSales = paginatorSales.totalElements;
        },
        error: (error: HttpErrorResponse) => {
          this.messageProvider.displayMessage('error', 'Erro na Listagem', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
          this.resetPaginator();
        }
      }
    );
    this.disposeProvider.insert(subscription$);
  }

  public getSaleDetails(id: number): void {
    this.dialog = true;
    let subscription$: Subscription = this.saleService.getSaleDetails(id).subscribe({
      next: (saleProducts: SaleProductEntity[]) => {
        this.saleProducts = saleProducts;
      },
      error: (error: HttpErrorResponse) => {
        this.messageProvider.displayMessage('error', 'Erro na Listagem', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
      }
    })
    this.disposeProvider.insert(subscription$);
  }

  public translatePaymentType(paymentType: PaymentType): string {
    if (paymentType.toString() === 'CARD') {
      return 'Cartão';
    } else if (paymentType.toString() === 'CASH') {
      return 'Dinheiro';
    } else if (paymentType.toString() === 'PIX') {
      return 'Pix';
    } else {
      return 'Método inválido';
    }
  }

  public handlePageChange(event: LazyLoadEvent): void {
    this.changePage(event.first!);
    this.getActiveSales();
  }

  private changePage(rows: number): void {
    this.actualPage = rows / 20;
  }

  public resetPaginator(): void {
    this.sales = [];
    this.actualPage = 0;
    this.totalSales = 0;
  }
}
