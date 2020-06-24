import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResearchService {
  
  products: any = [];

  constructor(private http: HttpClient) { }

  getProducts(parameters: string): Observable<any> {
    const url = `http://localhost:8000/research/${parameters}`;
    
    return this.http.get(url);
  }

  getProductById(id: string): Observable<any> {
    const url = `http://localhost:8000/research/product/${id}`;

    return this.http.get(url);
  }
}
