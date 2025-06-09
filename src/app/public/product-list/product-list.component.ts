import { Component } from '@angular/core';
import { ProductService } from '../../core/services/products.service';
import { Product } from '../../core/models/products.model';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  loading = false;
  products: Product[] = [];
  searchTerm: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  async getProducts() {
    this.loading = true;
    try {
      this.products = await this.productService.getAllProducts();
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      this.loading = false;
    }
  }

  filteredProducts() {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.categories?.name?.toLowerCase().includes(term) ?? false)
    );
  }

  // Método para agregar un producto al carrito
  addToCart(product: Product) {
    const quantity = parseInt(prompt('¿Cantidad?', '1') || '1');
    this.cartService.addToCart(product, quantity);
  }
}
