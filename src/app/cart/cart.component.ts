import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
 
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit {
  userIsLoggedIn: boolean;
  user: User;
  cart: Object[];

  constructor(private accountService: AccountService,
    private router: Router) { 
    if(this.accountService.userValue) {
      this.userIsLoggedIn = true;
    }
  }

  ngOnInit() {
    this.user = this.accountService.userValue;
  }

  cartDisplay() {
    this.router.navigate(['/cart', { outlets: { 'cartDisplay': ['display', 0]}}])
  }
}
