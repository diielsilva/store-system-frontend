import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpInterceptorsProvider } from '.';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthPageComponent } from './components/auth/auth-page/auth-page.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { ActiveProductsPageComponent } from './components/products/active-products-page/active-products-page.component';
import { InactiveProductsPageComponent } from './components/products/inactive-products-page/inactive-products-page.component';
import { InsertProductPageComponent } from './components/products/insert-product-page/insert-product-page.component';
import { ActiveSalesPageComponent } from './components/sales/active-sales-page/active-sales-page.component';
import { InsertSalePageComponent } from './components/sales/insert-sale-page/insert-sale-page.component';
import { TodaySalesPageComponent } from './components/sales/today-sales-page/today-sales-page.component';
import { PrimengModule } from './modules/primeng/primeng.module';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { MessageComponent } from './shared/components/message/message.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';


import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    MessageComponent,
    NavbarComponent,
    AuthPageComponent,
    HomePageComponent,
    ActiveProductsPageComponent,
    InsertProductPageComponent,
    InactiveProductsPageComponent,
    ActiveSalesPageComponent,
    InsertSalePageComponent,
    TodaySalesPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PrimengModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [HttpInterceptorsProvider, MessageService, { provide: LOCALE_ID, useValue: 'pt' }, { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
