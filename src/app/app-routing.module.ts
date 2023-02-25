import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthPageComponent } from './components/auth/auth-page/auth-page.component';
import { HomePageComponent } from './components/home/home-page/home-page.component';
import { ActiveProductsPageComponent } from './components/products/active-products-page/active-products-page.component';
import { InactiveProductsPageComponent } from './components/products/inactive-products-page/inactive-products-page.component';
import { InsertProductPageComponent } from './components/products/insert-product-page/insert-product-page.component';
import { ActiveSalesPageComponent } from './components/sales/active-sales-page/active-sales-page.component';
import { InsertSalePageComponent } from './components/sales/insert-sale-page/insert-sale-page.component';
import { TodaySalesPageComponent } from './components/sales/today-sales-page/today-sales-page.component';
import { AdminGuard } from './core/guards/admin.guard';

import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: AuthPageComponent },
  {
    path: 'home', canActivate: [AuthGuard], children: [
      { path: '', component: HomePageComponent },
      {
        path: 'products', children: [
          { path: '', component: ActiveProductsPageComponent },
          { path: 'insert', canActivate: [AdminGuard], component: InsertProductPageComponent },
          { path: 'inactive', component: InactiveProductsPageComponent }
        ]
      },
      {
        path: 'sales', children: [
          { path: '', canActivate: [AdminGuard], component: ActiveSalesPageComponent },
          { path: 'insert', component: InsertSalePageComponent },
          { path: 'today', component: TodaySalesPageComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
