import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class OrderLine {
  productId: number;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}

export class OrderHistory {
  orderTrackingNumber: string;
  totalPrice: number;
  totalQuantity: number;
  status: string;
  dateCreated: string;
  items: OrderLine[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private ordersUrl = 'http://localhost:8080/api/orders';

  constructor(private httpClient: HttpClient) { }

  getOrders(): Observable<OrderHistory[]> {
    return this.httpClient.get<OrderHistory[]>(this.ordersUrl);
  }
}
