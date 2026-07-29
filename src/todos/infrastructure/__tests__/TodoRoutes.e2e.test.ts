import request from 'supertest';
import { describe, expect, it, beforeEach } from 'vitest';
import { createApp } from '../app.js';
import { InMemoryTodoRepository } from '../adapters/InMemoryTodoRepository.js';

describe('Todo API E2E', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    const repository = new InMemoryTodoRepository();
    app = createApp(repository);
  });

  it('creates a todo, lists todos, and completes a todo', async () => {
    const createResponse = await request(app)
      .post('/api/todos')
      .send({ title: 'Probar e2e' });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: 'Probar e2e',
        completed: false,
      })
    );

    const todoId = createResponse.body.id;

    const listResponse = await request(app).get('/api/todos');
    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].id).toBe(todoId);

    const completeResponse = await request(app).patch(`/api/todos/${todoId}/complete`);
    expect(completeResponse.status).toBe(204);

    const listAfterComplete = await request(app).get('/api/todos');
    expect(listAfterComplete.status).toBe(200);
    expect(listAfterComplete.body[0].completed).toBe(true);
  });
});
