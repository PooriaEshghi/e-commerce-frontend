import { Component, OnInit } from '@angular/core';
import { OrderHistory, OrderHistoryService } from 'src/app/services/order-history.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orders: OrderHistory[] = [];
  errorMessage = '';

  constructor(private orderHistoryService: OrderHistoryService) { }

  ngOnInit(): void {
    this.orderHistoryService.getOrders().subscribe({
      next: data => this.orders = data,
      error: err => this.errorMessage = err?.error?.message || 'Could not load your orders.'
    });
  }
}
