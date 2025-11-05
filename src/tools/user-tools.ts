import { z } from 'zod';
import { ActiTimeClient } from '../actitime-client.js';

export const userTools = {
  get_users: {
    description: 'Get users with optional filtering',
    inputSchema: z.object({
      active: z.boolean().optional().describe('Filter by active status'),
      username: z.string().optional().describe('Filter by exact username'),
      email: z.string().optional().describe('Filter by exact email'),
      limit: z.number().max(1000).optional().describe('Max results'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const data = await client.getUsers(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data, null, 2),
        }],
      };
    },
  },

  get_user: {
    description: 'Get details of a specific user',
    inputSchema: z.object({
      uid: z.union([z.string(), z.number()]).describe('User ID or username'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const user = await client.getUser(args.uid);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(user, null, 2),
        }],
      };
    },
  },

  get_current_user: {
    description: 'Get details of the authenticated user',
    inputSchema: z.object({}),
    handler: async (client: ActiTimeClient, args: any) => {
      const user = await client.getCurrentUser();
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(user, null, 2),
        }],
      };
    },
  },
};
