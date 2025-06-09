import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders-manager',
  templateUrl: './orders-manager.component.html',
  styleUrls: ['./orders-manager.component.css'],
})
export class OrdersManagerComponent implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this.loading = true;
    this.ordersService.getOrders().then(({ data, error }) => {
      if (error) {
        console.error('Error loading orders', error);
      } else {
        this.orders = data || [];
      }
      this.loading = false;
    });
  }

  updateEstado(orderId: string, estado: 'confirmado' | 'cancelado') {
    this.ordersService.updateOrderStatus(orderId, estado).then(({ error }) => {
      if (error) {
        console.error('Error updating status', error);
      } else {
        this.getOrders();
      }
    });
  }
}
