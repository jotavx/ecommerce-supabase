import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { CartItem } from '../../core/models/cart-item.model';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  loading = false;
  cartItems: CartItem[] = [];

  constructor(
    private cartService: CartService,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.cartService.getCart().subscribe((items) => {
      this.cartItems = items;
    });
    this.loading = false;
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, item) => {
      return sum + item.quantity * (item.product?.price || 0);
    }, 0);
  }

  remove(item: CartItem) {
    this.cartService.removeFromCart(item.product_id);
  }

  updateQty(item: CartItem, qty: number) {
    this.cartService.updateQuantity(item!.product_id!, qty);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  // checkout() {
  //   this.cartService.checkout();
  // }

  async checkout() {
    const {
      data: { user },
    } = await this.supabaseService.getClient().auth.getUser();

    if (user) {
      this.cartService.checkout();
    } else {
      const nombre = prompt('Ingresá tu nombre completo:');
      const telefono = prompt('Teléfono de contacto:');
      const direccion = prompt('Dirección de entrega:');

      if (nombre && telefono && direccion) {
        this.cartService.checkoutGuest({ nombre, telefono, direccion });
      } else {
        alert('Todos los campos son obligatorios.');
      }
    }
  }
}
