import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { createTodoRouter } from './todos/infrastructure/todoRoutes.js';
import { MySQLTodoRepository } from './todos/infrastructure/adapters/MySQLTodoRepository.js';
import { InMemoryTodoRepository } from './todos/infrastructure/adapters/InMemoryTodoRepository.js';
import type { TodoRepository } from './todos/application/ports/TodoRepository.js';

dotenv.config();

async function createDatabaseIfMissing(connection: mysql.Connection) {
  const databaseName = process.env.MYSQL_DATABASE ?? 'todos_db';
  await connection.query(`CREATE DATABASE IF NOT EXISTS ${mysql.escapeId(databaseName)}`);
  await connection.query('USE ' + mysql.escapeId(databaseName));
  await connection.query(
    `CREATE TABLE IF NOT EXISTS todos (
       id VARCHAR(36) PRIMARY KEY,
       title VARCHAR(255) NOT NULL,
       is_completed TINYINT(1) NOT NULL DEFAULT 0
     )`
  );
}

async function createRepository(): Promise<TodoRepository> {
  const repositoryType = process.env.TODO_REPOSITORY?.toLowerCase() ?? 'memory';

  if (repositoryType === 'mysql') {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST ?? 'localhost',
      user: process.env.MYSQL_USER ?? 'root',
      password: process.env.MYSQL_PASSWORD ?? '',
      database: process.env.MYSQL_DATABASE ?? 'todos_db',
    });

    await createDatabaseIfMissing(connection);
    return new MySQLTodoRepository(connection);
  }

  return new InMemoryTodoRepository();
}

const app = express();
app.use(express.json());

async function bootstrap() {
  const repository = await createRepository();
  app.use('/api', createTodoRouter(repository));

  const port = Number(process.env.PORT ?? 3000);
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Using repository: ${process.env.TODO_REPOSITORY ?? 'memory'}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
