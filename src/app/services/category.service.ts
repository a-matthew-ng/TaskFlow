import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/category.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly STORAGE_KEY = 'categories';
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();
  private initialized = false;
  private initializePromise?: Promise<void>;

  constructor(private storageService: StorageService) {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const categories = (await this.storageService.get(this.STORAGE_KEY)) || [];
    this.categoriesSubject.next(categories);
    this.initialized = true;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initializePromise = this.initializePromise ?? this.initialize();
    await this.initializePromise;
  }

  private get currentCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  private async persistCategories(categories: Category[]): Promise<void> {
    await this.storageService.set(this.STORAGE_KEY, categories);
    this.categoriesSubject.next(categories);
  }

  async getCategories(): Promise<Category[]> {
    await this.ensureInitialized();
    return this.currentCategories;
  }

  async addCategory(category: Category): Promise<void> {
    await this.ensureInitialized();
    await this.persistCategories([...this.currentCategories, category]);
  }

  async deleteCategory(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.persistCategories(
      this.currentCategories.filter(category => category.id !== id)
    );
  }

  async updateCategory(updatedCategory: Category): Promise<void> {
    await this.ensureInitialized();
    await this.persistCategories(
      this.currentCategories.map(category =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  }
}
