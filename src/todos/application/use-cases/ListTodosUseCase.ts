import { Todo } from '../../domain/Todo.js';
import { TodoRepository } from '../ports/TodoRepository.js';

export class ListTodosUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(): Promise<Todo[]> {
    return this.repository.findAll();
  }
}
