import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private STORAGE_KEY = 'categories';

  constructor(private storageService: StorageService) {}

  async getCategories(): Promise<Category[]> {
    return (await this.storageService.get(this.STORAGE_KEY)) || [];
  }

  async addCategory(category: Category) {
    const categories = await this.getCategories();

    categories.push(category);

    await this.storageService.set(this.STORAGE_KEY, categories);
  }

  async deleteCategory(id: string) {
    const categories = await this.getCategories();

    const updatedCategories = categories.filter(
      category => category.id !== id
    );

    await this.storageService.set(this.STORAGE_KEY, updatedCategories);
  }

  async updateCategory(updatedCategory: Category) {
    const categories = await this.getCategories();

    const index = categories.findIndex(
      category => category.id === updatedCategory.id
    );

    if (index !== -1) {
      categories[index] = updatedCategory;

      await this.storageService.set(this.STORAGE_KEY, categories);
    }
  }
}
