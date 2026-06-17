import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  tasks: Task[] = [];
  newTaskTitle = '';
  categories: Category[] = [];
  selectedCategoryId = '';
  filteredTasks: Task[] = [];
  selectedFilterCategoryId = '';
  isEditTaskModalOpen = false;
  editingTask: Task | null = null;
  editingTaskTitle = '';
  editingTaskCategoryId = '';

  constructor(private taskService: TaskService, private categoryService: CategoryService) {}

  async ngOnInit() {
    await this.loadCategories();
    await this.loadTasks();
  }

  async ionViewWillEnter() {
    await this.loadCategories();
    await this.loadTasks();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getCategories();
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
    this.applyFilter();
  }

  applyFilter() {
    if (!this.selectedFilterCategoryId) {
      this.filteredTasks = this.tasks;
      return;
    }

    this.filteredTasks = this.tasks.filter(
      task => task.categoryId === this.selectedFilterCategoryId
    );
  }

  onFilterChange() {
    this.applyFilter();
  }

  async addTask() {
    if (!this.newTaskTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: this.newTaskTitle.trim(),
      completed: false,
      categoryId: this.selectedCategoryId || undefined
    };

    await this.taskService.addTask(task);

    this.newTaskTitle = '';
    this.selectedCategoryId = '';

    await this.loadTasks();
  }

  async deleteTask(id: string) {
    await this.taskService.deleteTask(id);

    await this.loadTasks();
  }

  async toggleCompleted(id: string) {
    await this.taskService.toggleCompleted(id);

    await this.loadTasks();
  }

  openEditTaskModal(task: Task) {
    this.editingTask = task;
    this.editingTaskTitle = task.title;
    this.editingTaskCategoryId = task.categoryId || '';
    this.isEditTaskModalOpen = true;
  }

  closeEditTaskModal() {
    this.isEditTaskModalOpen = false;
    this.editingTask = null;
    this.editingTaskTitle = '';
    this.editingTaskCategoryId = '';
  }

  async saveTask() {
    if (!this.editingTask || !this.editingTaskTitle.trim()) return;

    const updatedTask: Task = {
      ...this.editingTask,
      title: this.editingTaskTitle.trim(),
      categoryId: this.editingTaskCategoryId || undefined
    };

    await this.taskService.updateTask(updatedTask);

    this.closeEditTaskModal();
    await this.loadTasks();
  }

  getCategoryName(categoryId?: string): string {
    return (
      this.categories.find(
        category => category.id === categoryId
      )?.name || 'Sin categoria'
    );
  }
}
