import { Request, Response } from 'express';
import mysql from 'mysql2/promise';
import { CreateTodoUseCase } from '../../application/use-cases/CreateTodoUseCase.js';
import { ListTodosUseCase } from '../../application/use-cases/ListTodosUseCase.js';
import { CompleteTodoUseCase } from '../../application/use-cases/CompleteTodoUseCase.js';
import { MySQLTodoRepository } from '../adapters/MySQLTodoRepository.js';

const connectionPromise = mysql.createConnection({
  host: process.env.MYSQL_HOST ?? 'localhost',
  user: process.env.MYSQL_USER ?? 'root',
  password: process.env.MYSQL_PASSWORD ?? '',
  database: process.env.MYSQL_DATABASE ?? 'todos_db',
});

async function createDatabaseIfMissing(connection: mysql.Connection) {
  const databaseName = process.env.MYSQL_DATABASE ?? 'todos_db';
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(databaseName)}`);
  await connection.query('USE ' + mysql.escapeId(databaseName));
  await connection.query(
    `CREATE TABLE IF NOT EXISTS todos (
       id VARCHAR(36) PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       is_completed TINYINT(1) NOT NULL DEFAULT 0,
       created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
       updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
     )`
  );
}

async function getRepository() {
  const connection = await connectionPromise;
  await createDatabaseIfMissing(connection);
  return new MySQLTodoRepository(connection);
}

export async function createTodo(req: Request, res: Response) {
  const repository = await getRepository();
  const useCase = new CreateTodoUseCase(repository);

  try {
    const todo = await useCase.execute(String(req.body.title ?? ''));
    res.status(201).json({
      id: todo.getId(),
      title: todo.getTitle(),
      completed: todo.isCompleted(),
    });
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
}

export async function listTodos(_req: Request, res: Response) {
  const repository = await getRepository();
  const useCase = new ListTodosUseCase(repository);

  try {
    const todos = await useCase.execute();
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

export async function completeTodo(req: Request, res: Response) {
  const repository = await getRepository();
  const useCase = new CompleteTodoUseCase(repository);

  try {
    await useCase.execute(String(req.params.id ?? ''));
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'Tarea no encontrada') {
      res.status(404).json({ message: error.message });
      return;
    }

    res.status(400).json({ message: error instanceof Error ? error.message : 'Invalid request' });
  }
}
