import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { ResearchComponent } from './research.component';
import { SelectionByKeywordComponent } from './selection-by-keyword/selection-by-keyword.component';
import { SelectionByCriteriaComponent } from './selection-by-criteria/selection-by-criteria.component';
import { DisplayProductsComponent } from './display-products/display-products.component';

import { ResearchService } from './research.service';

import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [ResearchComponent, SelectionByKeywordComponent, SelectionByCriteriaComponent, DisplayProductsComponent],
  imports: [
    CommonModule,
    ResearchRoutingModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule
  ],
  bootstrap: [ResearchComponent],
  exports: [ResearchComponent],
  providers: [ResearchService]
})
export class ResearchModule { }
