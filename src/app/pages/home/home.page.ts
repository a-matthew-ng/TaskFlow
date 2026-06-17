import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  tasks: Task[] = [];
  newTaskTitle = '';

  constructor(private taskService: TaskService) {}

  async ngOnInit() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
  }

  async addTask() {

    if (!this.newTaskTitle.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: this.newTaskTitle,
      completed: false
    };

    await this.taskService.addTask(task);

    this.newTaskTitle = '';

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

}
