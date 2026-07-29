import express from 'express';
import { createTodoRouter } from './todoRoutes.js';
import type { TodoRepository } from '../application/ports/TodoRepository.js';

export function createApp(repository: TodoRepository) {
  const app = express();
  app.use(express.json());
  app.use('/api', createTodoRouter(repository));
  return app;
}
