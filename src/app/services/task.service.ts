import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private STORAGE_KEY = 'tasks';

  constructor(private storageService: StorageService) {}

  async getTasks(): Promise<Task[]> {
    return (await this.storageService.get(this.STORAGE_KEY)) || [];
  }

  async addTask(task: Task) {
    const tasks = await this.getTasks();

    tasks.push(task);

    await this.storageService.set(this.STORAGE_KEY, tasks);
  }

  async deleteTask(id: string) {
    const tasks = await this.getTasks();

    const updatedTasks = tasks.filter(task => task.id !== id);

    await this.storageService.set(this.STORAGE_KEY, updatedTasks);
  }

  async toggleCompleted(id: string) {
    const tasks = await this.getTasks();

    const task = tasks.find(task => task.id === id);

    if (task) {
      task.completed = !task.completed;

      await this.storageService.set(this.STORAGE_KEY, tasks);
    }
  }

}