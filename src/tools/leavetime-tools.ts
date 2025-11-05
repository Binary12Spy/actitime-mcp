import { z } from 'zod';
import { ActiTimeClient } from '../actitime-client.js';

export const leavetimeTools = {
  get_leavetime: {
    description: 'Retrieve leave time records for specified users and date range',
    inputSchema: z.object({
      dateFrom: z.string().describe('Start date (YYYY-MM-DD)'),
      dateTo: z.string().optional().describe('End date (YYYY-MM-DD)'),
      userIds: z.string().optional().describe('Comma-separated user IDs'),
      leaveTypeIds: z.string().optional().describe('Comma-separated leave type IDs'),
      stopAfter: z.number().optional().describe('Max records to return (1-1000)'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const data = await client.getLeaveTime(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data, null, 2),
        }],
      };
    },
  },

  set_leavetime: {
    description: 'Set leave time for a specific user, date, and leave type',
    inputSchema: z.object({
      userId: z.union([z.string(), z.number()]).describe('User ID or username'),
      date: z.string().describe('Date (YYYY-MM-DD or "today")'),
      leaveTypeId: z.number().describe('Leave type ID'),
      leaveTime: z.number().min(0).describe('Leave time in minutes'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const { userId, date, leaveTypeId, leaveTime } = args;
      const result = await client.setLeaveTime(userId, date, leaveTypeId, leaveTime);
      return {
        content: [{
          type: 'text',
          text: `Leave time set: ${leaveTime} minutes\n${JSON.stringify(result, null, 2)}`,
        }],
      };
    },
  },

  adjust_leavetime: {
    description: 'Adjust leave time by adding or subtracting minutes',
    inputSchema: z.object({
      userId: z.union([z.string(), z.number()]).describe('User ID or username'),
      date: z.string().describe('Date (YYYY-MM-DD or "today")'),
      leaveTypeId: z.number().describe('Leave type ID'),
      delta: z.number().describe('Minutes to add (positive) or subtract (negative)'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const { userId, date, leaveTypeId, delta } = args;
      const result = await client.adjustLeaveTime(userId, date, leaveTypeId, delta);
      return {
        content: [{
          type: 'text',
          text: `Leave time adjusted by ${delta} minutes\n${JSON.stringify(result, null, 2)}`,
        }],
      };
    },
  },

  get_leave_types: {
    description: 'Get available leave types',
    inputSchema: z.object({
      archived: z.boolean().optional().describe('Filter by archived status'),
      balance: z.enum(['None', 'Sick', 'PTO']).optional().describe('Filter by balance type'),
    }),
    handler: async (client: ActiTimeClient, args: any) => {
      const data = await client.getLeaveTypes(args);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(data, null, 2),
        }],
      };
    },
  },
};
