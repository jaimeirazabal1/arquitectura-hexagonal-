import { randomUUID } from 'crypto';
import { Todo } from '../../domain/Todo.js';
import { TodoRepository } from '../ports/TodoRepository.js';

export class CreateTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(title: string): Promise<Todo> {
    const todo = new Todo(title, randomUUID());
    await this.repository.save(todo);
    return todo;
  }
}
