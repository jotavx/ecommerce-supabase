import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders-detail',
  templateUrl: './orders-detail.component.html',
  styleUrl: './orders-detail.component.css',
})
export class OrdersDetailComponent {
  orderId!: string;
  userId!: string;
  userName!: string;
  userDireccion!: string;
  userTelefono!: string;

  items: any[] = [];
  order: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.loadOrder();
    this.getUserId();
  }

  async loadOrder() {
    this.loading = true;

    const { data: order, error: orderError } =
      await this.ordersService.getOrder(this.orderId);
    if (orderError) {
      console.error('Error loading order', orderError);
    } else {
      this.order = order;
    }

    const { data: items, error: itemsError } =
      await this.ordersService.getOrderItems(this.orderId);
    if (itemsError) {
      console.error('Error loading items', itemsError);
    } else {
      this.items = items || [];
    }

    this.loading = false;
  }

  getUserId() {
    this.loading = true;
    this.ordersService
      .getUserIdByOrderId(this.orderId)
      .then(({ data, error }) => {
        if (error) {
          console.error('Error fetching user ID', error);
        } else {
          this.userId = data.user_id;
          this.ordersService
            .getUserDataById(this.userId)
            .then(({ data: userData, error: userError }) => {
              if (userError) {
                console.error('Error fetching user name', userError);
              } else {
                this.userName = userData.nombre;
                this.userDireccion = userData.direccion;
                this.userTelefono = userData.telefono;
              }
            });
        }
        this.loading = false;
      });
  }

  downloadComprobante() {
    // Aquí podrías usar pdfMake o jsPDF
    alert('Comprobante generado (simulado)');
  }
}
