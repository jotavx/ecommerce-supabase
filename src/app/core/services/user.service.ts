// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { from, Observable } from 'rxjs';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  getUserProfile(userId: string): Observable<any> {
    const query = this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    return from(query);
  }

  // user.service.ts
  getHistorialPedidos(userId: string) {
    return this.supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('user_id', userId);
  }
}
