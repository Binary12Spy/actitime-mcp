import { z } from 'zod';
import { ActiTimeClient } from '../actitime-client.js';

export const timetrackTools = {
  get_timetrack: {
    description: 'Retrieve time tracking records for specified users, tasks, and date range',
    inputSchema: z.object({
      dateFrom: z.string().describe('Start date (YYYY-MM-DD)'),
      dateTo: z.string().optional().describe('End date (YYYY-MM-DD)'),
      userIds: z.string().optional().describe('Comma-separated user IDs'),
      taskIds: z.string().optional().describe('Comma-separated task IDs'),
      projectIds: z.string().optional().describe('Comma-separated project IDs'),
      customerIds: z.string().optional().describe('Comma-separated customer IDs'),
      approved: z.boolean().optional().describe('Filter by approval status'),
      stopAfter: z.number().optional().describe('Max records to return (1-1000)'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const data = await client.getTimeTrack(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data, null, 2),
        }],
      };
    },
  },

  set_timetrack: {
    description: 'Set time tracked for a specific user, date, and task',
    inputSchema: z.object({
      userId: z.union([z.string(), z.number()]).describe('User ID or username'),
      date: z.string().describe('Date (YYYY-MM-DD or "today")'),
      taskId: z.number().describe('Task ID'),
      time: z.number().min(0).describe('Time in minutes'),
      comment: z.string().optional().describe('Optional comment'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const { userId, date, taskId, time, comment } = args;
      const result = await client.setTimeTrack(userId, date, taskId, {
        time,
        comment,
      });
      return {
        content: [{
          type: 'text',
          text: `Time set successfully: ${time} minutes on task ${taskId}\n${JSON.stringify(result, null, 2)}`,
        }],
      };
    },
  },

  adjust_timetrack: {
    description: 'Adjust time tracked by adding or subtracting minutes',
    inputSchema: z.object({
      userId: z.union([z.string(), z.number()]).describe('User ID or username'),
      date: z.string().describe('Date (YYYY-MM-DD or "today")'),
      taskId: z.number().describe('Task ID'),
      delta: z.number().describe('Minutes to add (positive) or subtract (negative)'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const { userId, date, taskId, delta } = args;
      const result = await client.adjustTimeTrack(userId, date, taskId, delta);
      return {
        content: [{
          type: 'text',
          text: `Time adjusted by ${delta} minutes\n${JSON.stringify(result, null, 2)}`,
        }],
      };
    },
  },

  lock_timetrack: {
    description: 'Lock time tracking for specified users and date range',
    inputSchema: z.object({
      dateFrom: z.string().describe('Start date (YYYY-MM-DD)'),
      dateTo: z.string().describe('End date (YYYY-MM-DD)'),
      userIds: z.array(z.number()).optional().describe('User IDs to lock'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const result = await client.lockTimetrack(args);
      return {
        content: [{
          type: 'text',
          text: `Timetrack locked\n${JSON.stringify(result, null, 2)}`,
        }],
      };
    },
  },

  unlock_timetrack: {
    description: 'Unlock time tracking for specified users and date range',
    inputSchema: z.object({
      dateFrom: z.string().describe('Start date (YYYY-MM-DD)'),
      dateTo: z.string().describe('End date (YYYY-MM-DD)'),
      userIds: z.array(z.number()).optional().describe('User IDs to unlock'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const result = await client.unlockTimetrack(args);
      return {
        content: [{
          type: 'text',
          text: `Timetrack unlocked\n${JSON.stringify(result, null, 2)}`,
        }],
      };
    },
  },
};
