import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from '../../../core/services/category.service';
import { Product } from '../../../core/models/products.model';

@Component({
  selector: 'app-product-dialog',
  templateUrl: './product-dialog.component.html',
})
export class ProductDialogComponent implements OnInit {
  product: Product = {
    name: '',
    description: '',
    price: 0,
    image_url: '',
    stock: 0,
    category_id: '',
  };

  categories: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Product | null,
    private categoryService: CategoryService
  ) {
    if (data) this.product = { ...data };
  }

  async ngOnInit() {
    this.categories = await this.categoryService.getAllCategories();
  }

  onSave() {
    this.dialogRef.close(this.product);
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
