import { TodoRepository } from '../ports/TodoRepository.js';

export class CompleteTodoUseCase {
  constructor(private readonly repository: TodoRepository) {}

  async execute(id: string): Promise<void> {
    const todo = await this.repository.findById(id);

    if (!todo) {
      throw new Error('Tarea no encontrada');
    }

    todo.complete();
    await this.repository.save(todo);
  }
}
