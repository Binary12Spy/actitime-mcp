import { z } from 'zod';
import { ActiTimeClient } from '../actitime-client.js';

export const projectTools = {
  get_projects: {
    description: 'Get projects with optional filtering',
    inputSchema: z.object({
      customerIds: z.string().optional().describe('Comma-separated customer IDs'),
      archived: z.boolean().optional().describe('Filter by archived status'),
      name: z.string().optional().describe('Filter by exact name'),
      limit: z.number().max(1000).optional().describe('Max results'),
      offset: z.number().optional().describe('Pagination offset'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const data = await client.getProjects(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data, null, 2),
        }],
      };
    },
  },

  get_project: {
    description: 'Get details of a specific project',
    inputSchema: z.object({
      id: z.number().describe('Project ID'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const project = await client.getProject(args.id);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(project, null, 2),
        }],
      };
    },
  },

  get_customers: {
    description: 'Get customers with optional filtering',
    inputSchema: z.object({
      archived: z.boolean().optional().describe('Filter by archived status'),
      name: z.string().optional().describe('Filter by exact name'),
      limit: z.number().max(1000).optional().describe('Max results'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const data = await client.getCustomers(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data, null, 2),
        }],
      };
    },
  },
};
