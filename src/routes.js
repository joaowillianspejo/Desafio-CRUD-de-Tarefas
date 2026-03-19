import { randomUUID } from 'node:crypto';
import { Database } from './database.js';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { title, description } = request.body;

      const tasks = {
        id: randomUUID(),
        title: title,
        description: description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      database.insert('tasks', tasks);

      return response.writeHead(201).end();
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (request, response) => {
      const { search } = request.query;

      const tasks = database.select(
        'tasks',
        search
          ? {
              title: search,
              description: search,
            }
          : null,
      );

      return response.end(JSON.stringify(tasks));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;
      const { title, description } = request.body;

      const taskUpdated = {
        title: title,
        description: description,
        updated_at: new Date(),
      };

      const updated = database.update('tasks', id, taskUpdated);

      if (updated) {
        return response.writeHead(204).end();
      }

      return response.writeHead(404).end('Task not found');
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (request, response) => {
      const { id } = request.params;

      const deleted = database.delete('tasks', id);

      if (deleted) {
        return response.writeHead(204).end();
      }

      return response.writeHead(404).end('Task not found');
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (request, response) => {
      const { id } = request.params;

      const taskCompleted = {
        completed_at: new Date(),
        updated_at: new Date(),
      };

      const completed = database.complete('tasks', id, taskCompleted);

      if (completed) {
        return response.writeHead(204).end();
      }

      return response.writeHead(404).end('Task not found');
    },
  },
];
