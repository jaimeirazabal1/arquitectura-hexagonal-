import { Request, Response } from 'express';
import type { TodoRepository } from '../../application/ports/TodoRepository.js';
import { CreateTodoUseCase } from '../../application/use-cases/CreateTodoUseCase.js';
import { ListTodosUseCase } from '../../application/use-cases/ListTodosUseCase.js';
import { CompleteTodoUseCase } from '../../application/use-cases/CompleteTodoUseCase.js';

export function createTodoController(repository: TodoRepository) {
  const createTodoUseCase = new CreateTodoUseCase(repository);
  const listTodosUseCase = new ListTodosUseCase(repository);
  const completeTodoUseCase = new CompleteTodoUseCase(repository);

  async function createTodo(req: Request, res: Response) {
    try {
      const todo = await createTodoUseCase.execute(String(req.body.title ?? ''));
      res.status(201).json({
        id: todo.getId(),
        title: todo.getTitle(),
        completed: todo.isCompleted(),
      });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  async function listTodos(_req: Request, res: Response) {
    try {
      const todos = await listTodosUseCase.execute();
      res.status(200).json(
        todos.map((todo) => ({
          id: todo.getId(),
          title: todo.getTitle(),
          completed: todo.isCompleted(),
        }))
      );
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch todos' });
    }
  }

  async function completeTodo(req: Request, res: Response) {
    try {
      await completeTodoUseCase.execute(String(req.params.id ?? ''));
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Tarea no encontrada') {
        res.status(404).json({ message: error.message });
        return;
      }

      res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
    }
  }

  return { createTodo, listTodos, completeTodo };
}
