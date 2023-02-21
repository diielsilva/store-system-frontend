import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SaleProductDto } from 'src/app/core/dtos/sales/sale-product.dto';
import { SaveSaleDto } from 'src/app/core/dtos/sales/save-sale.dto';
import { ProductEntity } from 'src/app/core/entities/product.entity';
import { ProductService } from 'src/app/core/services/product.service';
import { SaleService } from 'src/app/core/services/sale.service';
import { DisposeProvider } from 'src/app/shared/providers/dispose.provider';
import { LoadingProvider } from 'src/app/shared/providers/loading.provider';
import { MessageProvider } from 'src/app/shared/providers/message.provider';

@Component({
  selector: 'app-insert-sale-page',
  templateUrl: './insert-sale-page.component.html',
  styleUrls: ['./insert-sale-page.component.css']
})
export class InsertSalePageComponent implements OnInit, OnDestroy {
  form: FormGroup;
  paymentType: string = 'CASH';
  totalShoppingCart: number = 0;


  constructor(private formBuilder: FormBuilder, public saleService: SaleService, public loadingProvider: LoadingProvider,
    private disposeProvider: DisposeProvider, private messageProvider: MessageProvider, private productService: ProductService) {
    this.form = this.formBuilder.group({
      productId: [null, [Validators.required, Validators.min(0)]],
      amount: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.calculateTotalShoppingCart();
  }

  ngOnDestroy(): void {
    this.disposeProvider.dispose();
  }

  public shouldDisableFormButton(): boolean {
    return this.form.invalid;
  }

  public insertIntoShoppingCart(): void {
    if (this.form.valid) {
      let SaleProductDto: SaleProductDto = { productId: this.form.get('productId')!.value, amount: this.form.get('amount')!.value };
      this.getActiveProductById(SaleProductDto);
      this.resetForm();
    }
  }

  public confirmSale(): void {
    if (this.saleService.getShoppingCart().length > 0 && this.paymentType != '') {
      let saveSale: SaveSaleDto = { paymentType: this.paymentType, products: this.saleService.getShoppingCart() };
      let subscription$ = this.saleService.saveSale(saveSale).subscribe({
        next: () => {
          this.saleService.cleanShoppingCart();
          this.totalShoppingCart = 0;
          this.messageProvider.displayMessage('success', 'Sucesso no Cadastro', 'A venda foi concluída com sucesso!');
        },
        error: (error: HttpErrorResponse) => {
          this.messageProvider.displayMessage('error', 'Erro no Cadastro', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
        }
      })
      this.disposeProvider.insert(subscription$);
    }
  }

  private getActiveProductById(saleProduct: SaleProductDto): void {
    let subscription$ = this.productService.getActiveProductById(saleProduct.productId).subscribe({
      next: (product: ProductEntity) => {
        this.saleService.insertIntoShoppingCart(saleProduct);
        this.calculateTotalShoppingCart();
      },
      error: (error: HttpErrorResponse) => {
        this.messageProvider.displayMessage('error', 'Erro na Listagem', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
      }
    })
    this.disposeProvider.insert(subscription$);

  }

  public getCartPdf(): void {
    let subscription$ = this.saleService.getCartPdf().subscribe({
      next: (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        window.open(url);
      },
      error: (error: HttpErrorResponse) => {
        this.messageProvider.displayMessage('error', 'Erro na Geração', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
      }
    });
    this.disposeProvider.insert(subscription$);
  }

  private calculateTotalShoppingCart(): void {
    for (let saleProduct of this.saleService.getShoppingCart()) {
      this.totalShoppingCart = 0;
      let subscription$ = this.productService.getActiveProductById(saleProduct.productId).subscribe({
        next: (product: ProductEntity) => {
          this.totalShoppingCart += saleProduct.amount * product.price;
        },
        error: () => { }
      })
      this.disposeProvider.insert(subscription$);
    }
  }

  public removeFromShoppingCart(saleProductDto: SaleProductDto): void {
    this.totalShoppingCart = 0;
    this.saleService.removeFromShoppingCart(saleProductDto);
    this.calculateTotalShoppingCart();
  }

  public shouldDisableNextStepButton(): boolean {
    return this.saleService.getShoppingCart().length <= 0 && this.paymentType != '';
  }

  public shouldDisablePdfButton(): boolean {
    return this.saleService.getShoppingCart().length <= 0;
  }

  private resetForm(): void {
    this.form.reset();
  }

}
