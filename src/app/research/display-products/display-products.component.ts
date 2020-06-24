import { Component, OnInit } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';
import { ResearchService } from './../research.service';
 
@Component({
  selector: 'app-display-products',
  templateUrl: './display-products.component.html',
  styleUrls: ['./display-products.component.scss']
})
export class DisplayProductsComponent {

  products: any = [];
  isValid: boolean;

  constructor(private route: ActivatedRoute, private research: ResearchService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      if(params['type'] !== undefined) {
        let subroute = `${params['type']}/${params['brand']}/${params['minprice']}/${params['maxprice']}/${params['minpopularity']}`;

        this.research.getProducts(subroute)
          .subscribe(
            res => this.products = res,
            err => console.log(err),
            () => console.log(this.products)
          )
          this.checkProducts();
      } else {
        let keywords = `keywords?${params['terms']}`.split(' ').join('&');

        this.research.getProducts(keywords)
        .subscribe(
          res => this.products = res,
          err => console.log(err),
          () => console.log('Products successfully import.')
        )
      }
    })
  }

  checkProducts() {
    this.products.length >= 1 ? this.isValid = true : this.isValid = false;
  }

}
