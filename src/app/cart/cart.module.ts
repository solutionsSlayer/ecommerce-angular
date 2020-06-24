import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartRoutingModule } from './cart-routing.module';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { CartComponent } from './cart.component';
import { CartDisplayComponent } from './cart-display/cart-display.component';
import { CartManagementComponent } from './cart-management/cart-management.component';
import { CartValidationComponent } from './cart-validation/cart-validation.component';


@NgModule({
  declarations: [CartComponent, CartDisplayComponent, CartManagementComponent, CartValidationComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    MatListModule,
    MatButtonModule
  ],
  exports: [CartComponent]
})
export class CartModule { }
