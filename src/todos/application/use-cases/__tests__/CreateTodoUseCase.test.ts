import { describe, expect, it } from 'vitest';
import { CreateTodoUseCase } from '../CreateTodoUseCase.js';
import { FakeTodoRepository } from './FakeTodoRepository.js';

describe('CreateTodoUseCase', () => {
  it('creates a new todo and persists it through the repository port', async () => {
    const repository = new FakeTodoRepository();
    const useCase = new CreateTodoUseCase(repository);

    const todo = await useCase.execute('Comprar leche');

    expect(todo.getTitle()).toBe('Comprar leche');
    const savedTodo = await repository.findById(todo.getId());
    expect(savedTodo).not.toBeNull();
    expect(savedTodo?.getTitle()).toBe('Comprar leche');
    expect(savedTodo?.isCompleted()).toBe(false);
  });
});
