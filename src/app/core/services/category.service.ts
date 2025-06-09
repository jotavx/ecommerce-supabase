import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private supabase: SupabaseClient;

  constructor(private supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient();
  }

  // Obtener todas las categorías
  async getAllCategories() {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  }

  // Obtener una categoría por ID
  async getCategoryById(id: string) {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  // Crear categoría
  async createCategory(category: Category) {
    const { data, error } = await this.supabase
      .from('categories')
      .insert([category])
      .select();
    if (error) throw error;
    return data;
  }

  // Actualizar categoría
  async updateCategory(id: string, category: Category) {
    const { data, error } = await this.supabase
      .from('categories')
      .update(category)
      .eq('id', id)
      .select();
    if (error) throw error;
    return data;
  }

  // Eliminar categoría
  async deleteCategory(id: string) {
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
}
