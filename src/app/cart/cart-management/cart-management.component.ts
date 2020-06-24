import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/_services/account.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '@app/_services/cart.service';
import { ResearchService } from '@app/research/research.service';

@Component({
  selector: 'app-cart-management',
  templateUrl: './cart-management.component.html',
  styleUrls: ['./cart-management.component.scss']
})
export class CartManagementComponent implements OnInit {
  action: string;
  product: Object;
  email: string;
  private numAction :number = 1;

  constructor(private cartService: CartService,
    private account: AccountService,
    private route: ActivatedRoute,
    private router: Router,
    private research: ResearchService) { }

  ngOnInit() {
    this.email = this.account.userValue.email;
    this.route.params.subscribe(params => {
      this.cartManagement(params["action"], params["id"]);
 });
  }

  cartManagement(action, productId) {
    this.research.getProductById(productId).subscribe(res => this.product = res)
    this.cartService.modifyCart(action, productId, this.email)
      .subscribe(res => {
        this.router.navigate(['/cart', { outlets: { 'cartDisplay': ['display', this.numAction]}}])
        this.numAction++;
      })
  } 
}
