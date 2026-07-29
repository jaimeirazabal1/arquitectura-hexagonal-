import { Todo } from '../../../domain/Todo.js';
import { TodoRepository } from '../ports/TodoRepository.js';

export class FakeTodoRepository implements TodoRepository {
  private todos: Todo[] = [];

  async save(todo: Todo): Promise<void> {
    const index = this.todos.findIndex((item) => item.getId() === todo.getId());
    if (index >= 0) {
      this.todos[index] = todo;
      return;
    }
    this.todos.push(todo);
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((item) => item.getId() === id);
    return todo ?? null;
  }

  async findAll(): Promise<Todo[]> {
    return [...this.todos];
  }
}
