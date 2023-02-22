import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductEntity } from 'src/app/core/entities/product.entity';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { ProductService } from 'src/app/core/services/product.service';
import { DisposeProvider } from 'src/app/shared/providers/dispose.provider';
import { LoadingProvider } from 'src/app/shared/providers/loading.provider';
import { MessageProvider } from 'src/app/shared/providers/message.provider';

@Component({
  selector: 'app-insert-product-page',
  templateUrl: './insert-product-page.component.html',
  styleUrls: ['./insert-product-page.component.css']
})
export class InsertProductPageComponent implements OnDestroy {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private productService: ProductService, private disposeProvider: DisposeProvider,
    private messageProvider: MessageProvider, private loadingProvider: LoadingProvider, private authService: AuthenticationService) {
    this.form = this.createInsertProductForm();
  }

  ngOnDestroy(): void {
    this.disposeProvider.dispose();
  }

  private createInsertProductForm(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(0)]],
      amount: [null, [Validators.required, Validators.min(0)]]
    });
  }

  public shouldDisableInsertProductForm(): boolean {
    return this.form.invalid || this.loadingProvider.loading.getValue();
  }

  public handleInsertProductForm(): void {
    if (this.form.valid) {
      this.saveProduct();
    }
  }

  private saveProduct(): void {
    let product: ProductEntity = { name: this.form.get('name')!.value, price: this.form.get('price')!.value, amount: this.form.get('amount')!.value };
    let subscription$ = this.productService.saveProduct(product).subscribe({
      next: () => {
        this.messageProvider.displayMessage('success', 'Sucesso no Cadastro', 'O produto foi cadastrado com sucesso!');
        this.form.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.messageProvider.displayMessage('error', 'Erro no Cadastro', error.error.message === undefined ? 'Não foi possível conectar ao servidor!' : error.error.message);
      }
    });
    this.disposeProvider.insert(subscription$);
  }

}
