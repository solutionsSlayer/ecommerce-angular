import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient) { }
  cart: Object[];

  getCart(email: string): Observable<Object> {
    const url = `http://localhost:8000/products/${email}`;

    return this.http.get(url);
  }

  getCartProducts(email: string): Observable<any> {
    const url = `http://localhost:8000/CartProducts/products/${email}`;
    return this.http.get(url);
  }

  modifyCart(action: string, productId: string, email: string): Observable<any> {
    let observable: Observable<any>;
    let body = {
      action: action,
      productId: productId,
      email: email
    }

    if(action === 'add') {
      observable = this.http.post(`http://localhost:8000/cart/products`, body);
    }
    else {
      observable = this.http.delete(`http://localhost:8000/cart/${productId}/${email}`);
    }

    return observable;
  }
}
