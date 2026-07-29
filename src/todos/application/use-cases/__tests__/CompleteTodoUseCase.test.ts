import { describe, expect, it } from 'vitest';
import { Todo } from '../../../domain/Todo.js';
import { CompleteTodoUseCase } from '../CompleteTodoUseCase.js';
import { FakeTodoRepository } from './FakeTodoRepository.js';

describe('CompleteTodoUseCase', () => {
  it('completes an existing todo and saves the updated aggregate', async () => {
    const repository = new FakeTodoRepository();
    const todo = new Todo('Aprender hexagonal', 'todo-1');
    await repository.save(todo);

    const useCase = new CompleteTodoUseCase(repository);
    await useCase.execute(todo.getId());

    const updatedTodo = await repository.findById(todo.getId());
    expect(updatedTodo).not.toBeNull();
    expect(updatedTodo?.isCompleted()).toBe(true);
  });

  it('throws when the todo is not found', async () => {
    const repository = new FakeTodoRepository();
    const useCase = new CompleteTodoUseCase(repository);

    await expect(useCase.execute('missing-id')).rejects.toThrow('Tarea no encontrada');
  });

  it('throws when the todo is already completed', async () => {
    const repository = new FakeTodoRepository();
    const todo = new Todo('Terminar tests', 'todo-2');
    await repository.save(todo);

    const savedTodo = await repository.findById(todo.getId());
    expect(savedTodo).not.toBeNull();
    savedTodo?.complete();
    await repository.save(savedTodo!);

    const useCase = new CompleteTodoUseCase(repository);
    await expect(useCase.execute(todo.getId())).rejects.toThrow('La tarea ya está completada');
  });
});
