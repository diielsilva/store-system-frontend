import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SaleProductEntity } from 'src/app/core/entities/sale-product.entity';
import { SaleEntity } from 'src/app/core/entities/sale.entity';
import { PaymentType } from 'src/app/core/enums/payment-type';
import { SaleService } from 'src/app/core/services/sale.service';
import { DisposeProvider } from 'src/app/shared/providers/dispose.provider';
import { LoadingProvider } from 'src/app/shared/providers/loading.provider';
import { MessageProvider } from 'src/app/shared/providers/message.provider';

@Component({
  selector: 'app-today-sales-page',
  templateUrl: './today-sales-page.component.html',
  styleUrls: ['./today-sales-page.component.css']
})
export class TodaySalesPageComponent implements OnInit, OnDestroy {
  sales: SaleEntity[] = [];
  saleProducts: SaleProductEntity[] = [];
  total: number = 0;
  dialog: boolean = false;

  constructor(private saleService: SaleService, private disposeProvider: DisposeProvider, private messageProvider: MessageProvider,
    public loadingProvider: LoadingProvider) { }

  ngOnInit(): void {
    this.getTodaySales();
  }

  ngOnDestroy(): void {
    this.disposeProvider.dispose();
  }

  public getLoading(): boolean {
    return this.loadingProvider.getLoading();
  }

  private getTodaySales(): void {
    let subscription$ = this.saleService.getTodaySales().subscribe({
      next: (sales: SaleEntity[]) => {
        for (let sale of sales) {
          let totalSale = this.getTotalSalePrice(sale);
          this.total += totalSale;
        }
        this.sales = sales;
      },
      error: (error: HttpErrorResponse) => {
        this.messageProvider.displayMessage('error', 'Erro na Listagem', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
      }
    });
    this.disposeProvider.insert(subscription$);
  }

  public getTotalSalePrice(sale: SaleEntity): number {
    return sale.total - sale.discount;
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
}
