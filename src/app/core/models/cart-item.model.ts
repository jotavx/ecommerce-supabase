import { Product } from './products.model';

export interface CartItem {
  id?: string;
  user_id?: string; // solo si está autenticado
  product_id: string;
  quantity: number;
  product?: Product; // para acceder a nombre, precio, etc.
}
