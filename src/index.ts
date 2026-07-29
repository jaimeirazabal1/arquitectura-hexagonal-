import express from 'express';
import dotenv from 'dotenv';
import { createTodoRouter } from './todos/infrastructure/todoRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', createTodoRouter());

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
