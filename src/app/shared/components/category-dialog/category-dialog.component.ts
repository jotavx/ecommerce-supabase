import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
})
export class CategoryDialogComponent {
  category: Category = { name: '', description: '' };

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    if (data) this.category = { ...data };
  }

  onSave() {
    this.dialogRef.close(this.category);
  }

  onCancel() {
    this.dialogRef.close(null);
  }
}
