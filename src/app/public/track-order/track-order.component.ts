import { Component } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css',
})
export class TrackOrderComponent {
  loading: boolean = false;
  order: any = null; // Ahora es un objeto, no un array
  trackCode: string = '';

  constructor(private ordersService: OrdersService) {}

  trackOrder(code: string) {
    this.loading = true;
    this.order = null;
    this.ordersService.getOrdersByCode(code).then(({ data, error }) => {
      if (error) {
        console.error('Error fetching order:', error);
      } else {
        this.order = data || null;
      }
      this.loading = false;
    });
  }
}
