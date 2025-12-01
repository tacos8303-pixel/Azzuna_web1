import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private API = 'http://localhost/azzuna_api/';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API + 'orders_get.php');
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API}orders_get.php?id=${id}`);
  }

  createOrder(data: Order): Observable<any> {
    return this.http.post(this.API + 'orders_create.php', data);
  }

  updateOrder(id: number, data: Order): Observable<any> {
    return this.http.put(`${this.API}orders_update.php?id=${id}`, data);
  }

  deleteOrder(id: number): Observable<any> {
    return this.http.delete(`${this.API}orders_delete.php?id=${id}`);
  }
}
