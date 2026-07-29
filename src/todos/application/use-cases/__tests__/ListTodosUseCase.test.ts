import { describe, expect, it } from 'vitest';
import { Todo } from '../../../domain/Todo.js';
import { ListTodosUseCase } from '../ListTodosUseCase.js';
import { FakeTodoRepository } from './FakeTodoRepository.js';

describe('ListTodosUseCase', () => {
  it('returns all todos through the repository port', async () => {
    const repository = new FakeTodoRepository();
    await repository.save(new Todo('Tarea uno', 'todo-1'));
    await repository.save(new Todo('Tarea dos', 'todo-2'));

    const useCase = new ListTodosUseCase(repository);
    const todos = await useCase.execute();

    expect(todos).toHaveLength(2);
    expect(todos.map((todo) => todo.getTitle())).toEqual(['Tarea uno', 'Tarea dos']);
  });
});
