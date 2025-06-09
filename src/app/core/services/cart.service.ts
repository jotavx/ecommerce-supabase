import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { SupabaseService } from './supabase.service';
import { Product } from '../models/products.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
    this.loadCart();
  }

  async loadCart() {
    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      const { data, error } = await this.supabase
        .from('cart_items')
        .select('*, product:product_id(*)')
        .eq('user_id', user.data.user.id);

      if (!error) this.cartItems$.next(data);
    } else {
      const local = localStorage.getItem('cart');
      this.cartItems$.next(local ? JSON.parse(local) : []);
    }
  }

  getCart() {
    return this.cartItems$.asObservable();
  }

  private updateLocalCart(items: CartItem[]) {
    localStorage.setItem('cart', JSON.stringify(items));
    this.cartItems$.next(items);
  }

  async addToCart(product: Product, quantity: number = 1) {
    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      const existing = await this.supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.data.user.id)
        .eq('product_id', product.id)
        .single();

      if (existing.data) {
        await this.supabase
          .from('cart_items')
          .update({ quantity: existing.data.quantity + quantity })
          .eq('id', existing.data.id);
      } else {
        await this.supabase.from('cart_items').insert({
          user_id: user.data.user.id,
          product_id: product.id,
          quantity,
        });
      }
    } else {
      let cart = this.cartItems$.value;
      const index = cart.findIndex((c) => c.product_id === product.id);
      if (index !== -1) {
        cart[index].quantity += quantity;
      } else {
        cart.push({ product_id: product.id ?? '', quantity, product });
      }
      this.updateLocalCart(cart);
    }

    this.loadCart();
  }

  async removeFromCart(id: string) {
    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      await this.supabase.from('cart_items').delete().eq('id', id);
    } else {
      const updated = this.cartItems$.value.filter(
        (item) => item.product_id !== id
      );
      this.updateLocalCart(updated);
    }

    this.loadCart();
  }

  async clearCart() {
    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      await this.supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.data.user.id);
    } else {
      localStorage.removeItem('cart');
    }

    this.cartItems$.next([]);
  }

  async updateQuantity(id: string, quantity: number) {
    const user = await this.supabase.auth.getUser();

    if (user.data.user) {
      await this.supabase.from('cart_items').update({ quantity }).eq('id', id);
    } else {
      const cart = this.cartItems$.value.map((item) =>
        item.product_id === id ? { ...item, quantity } : item
      );
      this.updateLocalCart(cart);
    }

    this.loadCart();
  }

  // CHECKOUT

  async checkout() {
    const user = await this.supabase.auth.getUser();

    if (!user.data.user) {
      alert('Debes iniciar sesión para completar la compra.');
      return;
    }

    const cartItems = this.cartItems$.value;
    if (cartItems.length === 0) return;

    // 1. Verificar stock
    for (const item of cartItems) {
      const { data: product, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();

      if (error || !product || product.stock < item.quantity) {
        alert(`No hay suficiente stock para el producto ${product?.name}`);
        return;
      }
    }

    // 2. Crear pedido
    const total = cartItems.reduce(
      (sum, i) => sum + (i.product?.price || 0) * i.quantity,
      0
    );

    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert({
        user_id: user.data.user.id,
        total,
      })
      .select()
      .single();

    if (orderError || !order) {
      alert('Error al crear el pedido');
      return;
    }

    // 3. Insertar ítems del pedido y actualizar stock
    for (const item of cartItems) {
      const { error: itemError } = await this.supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product?.price || 0,
        });

      if (itemError) {
        alert('Error al registrar ítems del pedido');
        return;
      }

      // Restar stock
      await this.supabase.rpc('decrement_product_stock', {
        product_id_input: item.product_id,
        quantity_input: item.quantity,
      });
    }

    // 4. Vaciar carrito
    await this.clearCart();

    alert('¡Compra realizada con éxito!');
  }

  async checkoutGuest(cliente: {
    nombre: string;
    telefono: string;
    direccion: string;
  }) {
    const cartItems = this.cartItems$.value;

    if (cartItems.length === 0) return;

    // 1. Verificar stock
    for (const item of cartItems) {
      const { data: product, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', item.product_id)
        .single();

      if (error || !product || product.stock < item.quantity) {
        alert(`No hay suficiente stock para el producto ${product?.name}`);
        return;
      }
    }

    // 2. Crear pedido anónimo con código de seguimiento
    const codigo =
      'PED-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const total = cartItems.reduce(
      (sum, i) => sum + (i.product?.price || 0) * i.quantity,
      0
    );

    const { data: order, error: orderError } = await this.supabase
      .from('orders')
      .insert({
        codigo_seguimiento: codigo,
        total,
        nombre: cliente.nombre,
        telefono: cliente.telefono,
        direccion: cliente.direccion,
      })
      .select()
      .single();

    if (orderError || !order) {
      alert('Error al crear el pedido');
      return;
    }

    // 3. Agregar ítems y descontar stock
    for (const item of cartItems) {
      const { error: itemError } = await this.supabase
        .from('order_items')
        .insert({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product?.price || 0,
        });

      if (itemError) {
        alert('Error al registrar ítems del pedido');
        return;
      }

      await this.supabase.rpc('decrement_product_stock', {
        product_id_input: item.product_id,
        quantity_input: item.quantity,
      });
    }

    // 4. Vaciar carrito local
    await this.clearCart();

    alert(`¡Pedido realizado! Código de seguimiento: ${codigo}`);
  }
}
