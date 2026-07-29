import { Router } from 'express';
import { createTodo, listTodos, completeTodo } from './controllers/TodoController.js';

export function createTodoRouter() {
  const router = Router();

  router.post('/todos', createTodo);
  router.get('/todos', listTodos);
  router.patch('/todos/:id/complete', completeTodo);

  return router;
}
