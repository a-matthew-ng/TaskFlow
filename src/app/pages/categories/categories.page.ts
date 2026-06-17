import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: false,
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];
  newCategoryName = '';
  isEditModalOpen = false;
  editingCategory: Category | null = null;
  editingCategoryName = '';

  constructor(private categoryService: CategoryService) {}

  async ngOnInit() {
    await this.loadCategories();
  }

  async ionViewWillEnter() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async addCategory() {
    if (!this.newCategoryName.trim()) return;

    const category: Category = {
      id: Date.now().toString(),
      name: this.newCategoryName,
    };

    await this.categoryService.addCategory(category);

    this.newCategoryName = '';

    await this.loadCategories();
  }

  async deleteCategory(id: string) {
    await this.categoryService.deleteCategory(id);

    await this.loadCategories();
  }

  openEditModal(category: Category) {
    this.editingCategory = category;
    this.editingCategoryName = category.name;
    this.isEditModalOpen = true;
  }

  closeEditModal() {
    this.isEditModalOpen = false;
    this.editingCategory = null;
    this.editingCategoryName = '';
  }

  async saveCategory() {
    if (!this.editingCategory || !this.editingCategoryName.trim()) return;

    const updatedCategory: Category = {
      ...this.editingCategory,
      name: this.editingCategoryName.trim(),
    };

    await this.categoryService.updateCategory(updatedCategory);

    this.closeEditModal();
    await this.loadCategories();
  }
}
