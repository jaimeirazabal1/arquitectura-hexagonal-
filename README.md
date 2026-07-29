# Arquitectura Hexagonal

Proyecto de ejemplo que implementa una API de tareas (`todos`) usando una arquitectura hexagonal.

## Descripción

Esta aplicación demuestra cómo separar la lógica de negocio de los detalles de infraestructura mediante:

- Dominios y entidades en `src/todos/domain`
- Puertos (interfaces) en `src/todos/application/ports`
- Casos de uso en `src/todos/application/use-cases`
- Adaptadores de salida en `src/todos/infrastructure/adapters`
- Adaptadores de entrada en `src/todos/infrastructure`

## Características

- `CreateTodoUseCase`: crea nuevas tareas y las persiste a través del puerto `TodoRepository`
- `CompleteTodoUseCase`: marca una tarea como completada
- `ListTodosUseCase`: lista todas las tareas
- Adaptador en memoria (`InMemoryTodoRepository`) para pruebas y desarrollo rápido
- Adaptador MySQL (`MySQLTodoRepository`) para persistencia real
- Rutas REST para crear, listar y completar tareas
- Pruebas unitarias de los casos de uso
- Prueba E2E de la API usando `supertest`

## Estructura del proyecto

- `src/index.ts`: bootstrap de la aplicación y elección del repositorio (memoria o MySQL)
- `src/todos/infrastructure/app.ts`: fábrica de aplicación para pruebas E2E
- `src/todos/infrastructure/todoRoutes.ts`: rutas HTTP
- `src/todos/infrastructure/controllers/TodoController.ts`: controlador de entradas
- `src/todos/infrastructure/adapters/InMemoryTodoRepository.ts`: adaptador de salida en memoria
- `src/todos/infrastructure/adapters/MySQLTodoRepository.ts`: adaptador de salida MySQL
- `src/todos/application/use-cases`: lógica de los casos de uso
- `src/todos/application/ports/TodoRepository.ts`: puerto de repositorio
- `src/todos/domain/Todo.ts`: entidad de dominio

## Uso

1. Instalar dependencias:

```bash
npm install
```

2. Ejecutar en modo desarrollo:

```bash
npm run dev
```

3. Cambiar el repositorio a MySQL (opcional):

```bash
TODO_REPOSITORY=mysql MYSQL_HOST=localhost MYSQL_USER=root MYSQL_PASSWORD=secret MYSQL_DATABASE=todos_db npm run dev
```

4. Usar la API:

- `POST /api/todos` para crear una tarea
- `GET /api/todos` para listar tareas
- `PATCH /api/todos/:id/complete` para completar una tarea

## Tests

Ejecutar todas las pruebas:

```bash
npm test
```

## Notas

- La arquitectura hexagonal mantiene el dominio independiente de los detalles de infraestructura.
- Los adaptadores pueden intercambiarse fácilmente gracias al puerto `TodoRepository`.
