import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ResearchService } from '../research.service';

@Component({
  selector: 'app-selection-by-criteria',
  templateUrl: './selection-by-criteria.component.html',
  styleUrls: ['./selection-by-criteria.component.scss']
})

export class SelectionByCriteriaComponent implements OnInit {
  public selectors: Object[];  // --aot
  private params: any = { 'type': '*', 'brand': '*', 'minprice': '*', 'maxprice': '*', 'minpopularity': '*' };

  constructor(private research: ResearchService, private router: Router) { }

  ngOnInit() {
    this.research.getProducts('selectors')
      .subscribe(res => this.selectors = res,
        err => console.error(err),
        () => console.log('getProducts("selectors") done'));
  }

  selection($event, selector) {
    let filter = $event.value;
    console.log(filter);

    if(selector === 'type') {
      this.params['type'] = filter;
    }
    if(selector === 'brand') {
      this.params['brand'] = filter;
    }
    if(selector === 'price') {
      const min = filter.split('-')[0];
      const max = filter.split('-')[1];

      this.params['minprice'] = min;
      this.params['maxprice'] = max;
    }
    if(selector === 'popularity') {
      this.params['minpopularity'] = filter;
    }
  }

  productSelection() {
    // tslint:disable-next-line: max-line-length
    console.log('Dans productSelection avec ' + this.params.type + ' ' + this.params.brand + ' ' + this.params.minprice + ' ' + this.params.maxprice + ' ' + this.params.minpopularity);
    this.router
    .navigate(['/research', { outlets: { display: ['display',
      this.params.type,
      this.params.brand,
      this.params.minprice,
      this.params.maxprice,
      this.params.minpopularity] } }]);
  }
}
