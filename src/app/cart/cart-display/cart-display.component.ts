import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/_services/cart.service';
import { User } from 'src/app/_models';
import { AccountService } from 'src/app/_services/account.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cart-display',
  templateUrl: './cart-display.component.html',
  styleUrls: ['./cart-display.component.scss']
})
export class CartDisplayComponent implements OnInit {
  user: User;
  products: Object;
  email: string;
  total: number;
  private numAction: number = 0;

  constructor(private cartService: CartService,
    private accountService: AccountService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.user = this.accountService.userValue;
    this.route.params.subscribe((params) => {
      console.log("Raffraîchissement du panier");
      this.cartService.getCartProducts(this.user.email).subscribe(
        (res) => {
          this.products = res;
          this.total = 0;
          for (let p of res) {
            this.total += p.price * p.nb;
          }
        },
        (err) => console.error(err),
        () => console.log("getCartProducts done", this.products)
      );
    });
  }

  addProduct(productId) {
      this.router.navigate(["/cart", { outlets: { cartManagement: ["management", "add", productId, this.numAction] }}]);
      this.numAction++;
  }

  removeProduct(productId) {
      this.router.navigate(['/cart', { outlets: { cartManagement : ['management', 'remove', productId, this.numAction] }}]);
      this.numAction++;
  }

}
