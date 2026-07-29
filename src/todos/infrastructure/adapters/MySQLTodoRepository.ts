import mysql from 'mysql2/promise';
import { Todo } from '../../domain/Todo.js';
import { TodoRepository } from '../../application/ports/TodoRepository.js';

export class MySQLTodoRepository implements TodoRepository {
  private connection: mysql.Connection;

  constructor(connection: mysql.Connection) {
    this.connection = connection;
  }

  async save(todo: Todo): Promise<void> {
    await this.connection.execute(
      `REPLACE INTO todos (id, title, is_completed)
       VALUES (?, ?, ?)`,
      [
        todo.getId(),
        todo.getTitle(),
        todo.isCompleted() ? 1 : 0,
      ]
    );
  }

  async findById(id: string): Promise<Todo | null> {
    const [rows] = await this.connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM todos WHERE id = ?',
      [id]
    );

    const row = rows[0];
    if (!row) return null;

    return Todo.restore(
      String(row.id),
      String(row.title),
      Boolean(row.is_completed)
    );
  }

  async findAll(): Promise<Todo[]> {
    const [rows] = await this.connection.execute<mysql.RowDataPacket[]>(
      'SELECT * FROM todos'
    );

    return rows.map((row) =>
      Todo.restore(
        String(row.id),
        String(row.title),
        Boolean(row.is_completed)
      )
    );
  }
}
