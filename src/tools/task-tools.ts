import { z } from 'zod';
import { ActiTimeClient } from '../actitime-client.js';

export const taskTools = {
  get_tasks: {
    description: 'Get tasks with optional filtering',
    inputSchema: z.object({
      ids: z.string().optional().describe('Comma-separated task IDs'),
      projectIds: z.string().optional().describe('Comma-separated project IDs'),
      customerIds: z.string().optional().describe('Comma-separated customer IDs'),
      status: z.enum(['open', 'completed']).optional().describe('Filter by status'),
      name: z.string().optional().describe('Filter by exact name'),
      limit: z.number().max(1000).optional().describe('Max results (1-1000)'),
      offset: z.number().optional().describe('Pagination offset'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const data = await client.getTasks(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data, null, 2),
        }],
      };
    },
  },

  get_task: {
    description: 'Get details of a specific task',
    inputSchema: z.object({
      id: z.number().describe('Task ID'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const task = await client.getTask(args.id);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(task, null, 2),
        }],
      };
    },
  },

  create_task: {
    description: 'Create a new task',
    inputSchema: z.object({
      name: z.string().describe('Task name'),
      projectId: z.number().describe('Project ID'),
      description: z.string().optional().describe('Task description'),
      status: z.enum(['open', 'completed']).optional().describe('Initial status'),
      deadline: z.string().optional().describe('Deadline (YYYY-MM-DD)'),
      estimatedTime: z.number().optional().describe('Estimated time in minutes'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const task = await client.createTask(args);
      return {
        content: [{
          type: 'text',
          text: `Task created successfully!\n${JSON.stringify(task, null, 2)}`,
        }],
      };
    },
  },

  update_task: {
    description: 'Update an existing task',
    inputSchema: z.object({
      id: z.number().describe('Task ID'),
      name: z.string().optional().describe('New task name'),
      description: z.string().optional().describe('New description'),
      status: z.enum(['open', 'completed']).optional().describe('New status'),
      deadline: z.string().optional().describe('New deadline (YYYY-MM-DD)'),
      estimatedTime: z.number().optional().describe('New estimated time in minutes'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const { id, ...updates } = args;
      const task = await client.updateTask(id, updates);
      return {
        content: [{
          type: 'text',
          text: `Task updated successfully!\n${JSON.stringify(task, null, 2)}`,
        }],
      };
    },
  },
};
