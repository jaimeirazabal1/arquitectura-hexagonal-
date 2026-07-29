import { randomUUID } from 'crypto';

export class Todo {
  private readonly id: string;
  private readonly title: string;
  private isCompleted = false;

  constructor(title: string, id = randomUUID()) {
    if (!title?.trim()) {
      throw new Error('El título no puede estar vacío');
    }

    this.title = title.trim();
    this.id = id;
  }

  static restore(id: string, title: string, isCompleted: boolean): Todo {
    const todo = new Todo(title, id);
    if (isCompleted) {
      todo.isCompleted = true;
    }
    return todo;
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }

  isCompleted(): boolean {
    return this.isCompleted;
  }

  complete(): void {
    if (this.isCompleted) {
      throw new Error('La tarea ya está completada');
    }

    this.isCompleted = true;
  }
}
