import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/supabase';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async getOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select(
        `
        *,
        users (
          nombre
        )
      `
      )
      .order('created_at', { ascending: false });
    return { data, error };
  }

  updateOrderStatus(orderId: string, estado: string) {
    return this.supabase.from('orders').update({ estado }).eq('id', orderId);
  }

  getOrder(orderId: string) {
    return this.supabase.from('orders').select('*').eq('id', orderId).single();
  }

  getOrderItems(orderId: string) {
    return this.supabase
      .from('order_items')
      .select('*, product:products(name, price, image_url)')
      .eq('order_id', orderId);
  }

  getUserIdByOrderId(orderId: string) {
    return this.supabase
      .from('orders')
      .select('user_id')
      .eq('id', orderId)
      .single();
  }

  getUserDataById(userId: string) {
    return this.supabase.from('users').select('*').eq('id', userId).single();
  }

  getOrdersByCode(codigo: string) {
    return this.supabase
      .from('orders')
      .select('*')
      .eq('codigo_seguimiento', codigo)
      .single();
  }
}
