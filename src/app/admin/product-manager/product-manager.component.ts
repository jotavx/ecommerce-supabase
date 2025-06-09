import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/products.service';
import { Product } from '../../core/models/products.model';
import { MatDialog } from '@angular/material/dialog';
import { ProductDialogComponent } from '../../shared/components/product-dialog/product-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-product-manager',
  templateUrl: './product-manager.component.html',
  styleUrls: ['./product-manager.component.css'],
})
export class ProductManagerComponent implements OnInit {
  searchTerm: string = '';
  products: Product[] = [];
  loading = false;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog
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

  openProductDialog(product?: Product) {
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      data: product || null,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(async (result: Product | null) => {
      if (result) {
        if (result.id) {
          await this.productService.updateProduct(result.id, result);
        } else {
          await this.productService.createProduct(result);
        }
        this.getProducts();
      }
    });
  }

  deleteProduct(id: string) {
    const dialogData: ConfirmDialogData = {
      title: 'Eliminar producto',
      message: '¿Estás seguro que quieres eliminar este producto?',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Aquí llamás a tu método real para eliminar el producto
        this.productService
          .deleteProduct(id)
          .then(() => {
            this.products = this.products.filter((p) => p.id !== id);
          })
          .catch((error) => {
            console.error('Error al eliminar el producto:', error);
          });
        this.getProducts();
      }
    });
  }

  // async deleteProduct(id: string) {
  //   if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
  //     await this.productService.deleteProduct(id);
  //     this.products = this.products.filter((p) => p.id !== id);
  //   }
  // }
}
