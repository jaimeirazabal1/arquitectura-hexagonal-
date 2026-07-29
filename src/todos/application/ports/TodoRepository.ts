import { Todo } from '../../domain/Todo.js';

export interface TodoRepository {
  save(todo: Todo): Promise<void>;
  findById(id: string): Promise<Todo | null>;
  findAll(): Promise<Todo[]>;
}
