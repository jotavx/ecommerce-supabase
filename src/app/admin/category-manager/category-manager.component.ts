import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../../shared/components/category-dialog/category-dialog.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-category-manager',
  templateUrl: './category-manager.component.html',
  styleUrls: ['./category-manager.component.css'],
})
export class CategoryManagerComponent implements OnInit {
  searchTerm: string = '';
  categories: any[] = [];
  loading = false;

  filteredCategories() {
    if (!this.searchTerm) return this.categories;
    const term = this.searchTerm.toLowerCase();
    return this.categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(term) ||
        cat.description.toLowerCase().includes(term)
    );
  }

  constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
  ) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.loading = true;
    try {
      this.categories = await this.categoryService.getAllCategories();
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      this.loading = false;
    }
  }

  deleteCategory(id: string) {
    const dialogData: ConfirmDialogData = {
      title: 'Eliminar categoría',
      message: '¿Estás seguro que quieres eliminar esta categoría?',
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
        this.categoryService
          .deleteCategory(id)
          .then(() => {
            this.categories = this.categories.filter((p) => p.id !== id);
          })
          .catch((error) => {
            console.error('Error al eliminar el producto:', error);
          });
        this.loadCategories();
      }
    });
  }

  openCategoryDialog(category?: Category) {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: category || null,
    });

    dialogRef.afterClosed().subscribe(async (result: Category | null) => {
      if (result) {
        if (result.id) {
          await this.categoryService.updateCategory(result.id, result);
        } else {
          await this.categoryService.createCategory(result);
        }
        await this.loadCategories();
      }
    });
  }
}
