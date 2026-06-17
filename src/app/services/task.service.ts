import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly STORAGE_KEY = 'tasks';
  private readonly tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();
  private initialized = false;
  private initializePromise?: Promise<void>;

  constructor(private storageService: StorageService) {}

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const tasks = (await this.storageService.get(this.STORAGE_KEY)) || [];
    this.tasksSubject.next(tasks);
    this.initialized = true;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initializePromise = this.initializePromise ?? this.initialize();
    await this.initializePromise;
  }

  private get currentTasks(): Task[] {
    return this.tasksSubject.value;
  }

  private async persistTasks(tasks: Task[]): Promise<void> {
    await this.storageService.set(this.STORAGE_KEY, tasks);
    this.tasksSubject.next(tasks);
  }

  async getTasks(): Promise<Task[]> {
    await this.ensureInitialized();
    return this.currentTasks;
  }

  async addTask(task: Task): Promise<void> {
    await this.ensureInitialized();
    await this.persistTasks([...this.currentTasks, task]);
  }

  async deleteTask(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.persistTasks(this.currentTasks.filter(task => task.id !== id));
  }

  async toggleCompleted(id: string): Promise<void> {
    await this.ensureInitialized();
    await this.persistTasks(
      this.currentTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  async updateTask(updatedTask: Task): Promise<void> {
    await this.ensureInitialized();
    await this.persistTasks(
      this.currentTasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      )
    );
  }
}
