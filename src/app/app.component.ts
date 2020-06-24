import { Component } from '@angular/core';
import { User } from './_models';
import { AccountService } from './_services/account.service';
import { DataSharingService } from '././_services/data-sharing.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'e-commerce';
  isUserLoggedIn: boolean;
  user: User;

  constructor(private accountService: AccountService, private dataSharingService: DataSharingService) {
    this.dataSharingService.isUserLoggedIn.subscribe( value => {
      this.isUserLoggedIn = value;
      this.getLogin();
      if(this.user) {
        this.isUserLoggedIn = true;
      }
    });
   }

  logout() {
    this.accountService.logout();
    return this.user = this.accountService.userValue;
  }

  getLogin() {
    return this.user = JSON.parse(localStorage.getItem('user'));
  }
}
