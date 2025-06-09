import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { Product } from '../models/products.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  // Obtener todos los productos con su categoría
  async getAllProducts() {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  // Obtener un producto por ID
  async getProductById(id: string) {
    const { data, error } = await this.supabase
      .from('products')
      .select('*, categories(name)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  // Crear producto
  async createProduct(product: Product) {
    const { data, error } = await this.supabase
      .from('products')
      .insert([product])
      .select();
    if (error) throw error;
    return data;
  }

  // Actualizar producto
  // async updateProduct(id: string, product: Product) {
  //   const { data, error } = await this.supabase
  //     .from('products')
  //     .update(product)
  //     .eq('id', id)
  //     .select();
  //   if (error) throw error;
  //   return data;
  // }

  async updateProduct(id: string, product: Product) {
    const productToUpdate = { ...product };
    // Eliminar campos que no pertenecen directamente a la tabla 'products'
    delete (productToUpdate as any).categories;

    const { data, error } = await this.supabase
      .from('products')
      .update(productToUpdate)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data;
  }

  // Eliminar producto
  async deleteProduct(id: string) {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
