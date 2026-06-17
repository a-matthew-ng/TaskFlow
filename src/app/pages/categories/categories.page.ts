import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesPage implements OnInit {
  readonly categories$ = this.categoryService.categories$;
  newCategoryName = '';
  isEditModalOpen = false;
  editingCategory: Category | null = null;
  editingCategoryName = '';

  constructor(private categoryService: CategoryService, private cd: ChangeDetectorRef) {}

  async ngOnInit() {
    await this.categoryService.initialize();
  }

  async addCategory() {
    if (!this.newCategoryName.trim()) {
      return;
    }

    const category: Category = {
      id: Date.now().toString(),
      name: this.newCategoryName.trim(),
    };

    await this.categoryService.addCategory(category);
    this.newCategoryName = '';
  }

  async deleteCategory(id: string) {
    await this.categoryService.deleteCategory(id);
  }

  openEditModal(category: Category) {
    this.editingCategory = category;
    this.editingCategoryName = category.name;
    this.isEditModalOpen = true;
    this.cd.markForCheck();
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingCategory = null;
    this.editingCategoryName = '';
    this.cd.markForCheck();
  }

  async saveCategory() {
    if (!this.editingCategory || !this.editingCategoryName.trim()) {
      return;
    }

    const updatedCategory: Category = {
      ...this.editingCategory,
      name: this.editingCategoryName.trim(),
    };

    await this.categoryService.updateCategory(updatedCategory);
    this.closeEditModal();
  }

  trackByCategory(index: number, category: Category) {
    return category.id;
  }
}
