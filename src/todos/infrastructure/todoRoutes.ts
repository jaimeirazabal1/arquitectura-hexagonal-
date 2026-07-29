import { Router } from 'express';
import { createTodoController } from './controllers/TodoController.js';
import type { TodoRepository } from '../application/ports/TodoRepository.js';

export function createTodoRouter(repository: TodoRepository) {
  const controller = createTodoController(repository);
  const router = Router();

  router.post('/todos', controller.createTodo);
  router.get('/todos', controller.listTodos);
  router.patch('/todos/:id/complete', controller.completeTodo);

  return router;
}
