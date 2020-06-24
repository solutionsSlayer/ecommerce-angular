import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DisplayProductsComponent } from './display-products/display-products.component';


const routes: Routes = [
  {
    path: 'display/:terms',
    component: DisplayProductsComponent,
    outlet: 'display'
  },
  {
    path: 'display/:type/:brand/:minprice/:maxprice/:minpopularity',
    component: DisplayProductsComponent,
    outlet: 'display'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResearchRoutingModule { }
