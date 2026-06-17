import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { RemoteConfigService } from '../../services/remote-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit, OnDestroy {
  private readonly filterCategoryId$ = new BehaviorSubject<string>('');
  readonly categories$ = this.categoryService.categories$;
  readonly filteredTasks$ = combineLatest([
    this.taskService.tasks$,
    this.filterCategoryId$
  ]).pipe(
    map(([tasks, filterCategoryId]) =>
      !this.enableCategories || !filterCategoryId
        ? tasks
        : tasks.filter(task => task.categoryId === filterCategoryId)
    )
  );

  newTaskTitle = '';
  categories: Category[] = [];
  selectedCategoryId = '';
  selectedFilterCategoryId = '';
  enableCategories = true;
  isEditTaskModalOpen = false;
  editingTask: Task | null = null;
  editingTaskTitle = '';
  editingTaskCategoryId = '';

  private readonly destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private remoteConfigService: RemoteConfigService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    this.enableCategories = await this.remoteConfigService.isCategoriesEnabled();

    if (!this.enableCategories) {
      this.selectedCategoryId = '';
      this.selectedFilterCategoryId = '';
      this.editingTaskCategoryId = '';
    }

    await Promise.all([
      this.taskService.initialize(),
      this.categoryService.initialize(),
    ]);

    this.categoryService.categories$
      .pipe(takeUntil(this.destroy$))
      .subscribe(categories => {
        this.categories = categories;
        this.changeDetectorRef.markForCheck();
      });

    this.filterCategoryId$.next(this.selectedFilterCategoryId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFilterChange() {
    this.filterCategoryId$.next(this.selectedFilterCategoryId);
  }

  async addTask() {
    if (!this.newTaskTitle.trim()) {
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: this.newTaskTitle.trim(),
      completed: false,
      categoryId: this.enableCategories
        ? this.selectedCategoryId || undefined
        : undefined,
    };

    await this.taskService.addTask(task);

    this.newTaskTitle = '';
    this.selectedCategoryId = '';
  }

  async deleteTask(id: string) {
    await this.taskService.deleteTask(id);
  }

  async toggleCompleted(id: string) {
    await this.taskService.toggleCompleted(id);
  }

  openEditTaskModal(task: Task) {
    this.editingTask = task;
    this.editingTaskTitle = task.title;
    this.editingTaskCategoryId = this.enableCategories
      ? task.categoryId || ''
      : '';
    this.isEditTaskModalOpen = true;
  }

  closeEditTaskModal() {
    this.isEditTaskModalOpen = false;
    this.editingTask = null;
    this.editingTaskTitle = '';
    this.editingTaskCategoryId = '';
  }

  async saveTask() {
    if (!this.editingTask || !this.editingTaskTitle.trim()) {
      return;
    }

    const updatedTask: Task = {
      ...this.editingTask,
      title: this.editingTaskTitle.trim(),
      categoryId: this.enableCategories
        ? this.editingTaskCategoryId || undefined
        : undefined,
    };

    await this.taskService.updateTask(updatedTask);
    this.closeEditTaskModal();
  }

  getCategoryName(categoryId?: string): string {
    return this.categories.find(category => category.id === categoryId)
      ?.name || 'Sin categoria';
  }

  trackByTask(index: number, task: Task) {
    return task.id;
  }

  trackByCategory(index: number, category: Category) {
    return category.id;
  }
}
