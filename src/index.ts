#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ActiTimeClient } from './actitime-client.js';
import { timetrackTools } from './tools/timetrack-tools.js';
import { leavetimeTools } from './tools/leavetime-tools.js';
import { taskTools } from './tools/task-tools.js';
import { projectTools } from './tools/project-tools.js';
import { userTools } from './tools/user-tools.js';

// Parse command line arguments
const args = process.argv.slice(2);
const companyName = args[0] || process.env.ACTITIME_COMPANY;

if (!companyName) {
  console.error('Error: Company name required as first argument or ACTITIME_COMPANY environment variable');
  console.error('Usage: actitime-mcp <company-name>');
  process.exit(1);
}

// Configuration from environment variables
const CONFIG = {
  baseUrl: process.env.ACTITIME_BASE_URL || `https://online.actitime.com/${companyName}/api/v1`,
  username: process.env.ACTITIME_USERNAME || '',
  password: process.env.ACTITIME_PASSWORD || '',
};

if (!CONFIG.username || !CONFIG.password) {
  console.error('Error: ACTITIME_USERNAME and ACTITIME_PASSWORD environment variables must be set');
  process.exit(1);
}

// Initialize client
const client = new ActiTimeClient(CONFIG);

// Combine all tools
const allTools = {
  ...timetrackTools,
  ...leavetimeTools,
  ...taskTools,
  ...projectTools,
  ...userTools,
};

// Create MCP server
const server = new Server(
  {
    name: 'actitime-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: Object.entries(allTools).map(([name, tool]) => ({
      name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    })),
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const toolName = request.params.name;
  const tool = allTools[toolName as keyof typeof allTools];

  if (!tool) {
    throw new Error(`Unknown tool: ${toolName}`);
  }

  try {
    const validatedArgs = tool.inputSchema.parse(request.params.arguments);
    return await tool.handler(client, validatedArgs);
  } catch (error: any) {
    return {
      content: [{
        type: 'text',
        text: `Error: ${error.message}`,
      }],
      isError: true,
    };
  }
});

// Resources for API documentation
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'actitime://docs/api',
        name: 'actiTIME API Documentation',
        mimeType: 'text/plain',
        description: 'Information about the actiTIME API',
      },
      {
        uri: `actitime://config/${companyName}`,
        name: 'Current Configuration',
        mimeType: 'text/plain',
        description: 'Current actiTIME connection info',
      },
    ],
  };
});

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  
  if (uri === 'actitime://docs/api') {
    return {
      contents: [{
        uri,
        mimeType: 'text/plain',
        text: `actiTIME API Documentation

Base URL: ${CONFIG.baseUrl}
Company: ${companyName}
Authentication: Basic Auth

Key Features:
- Time tracking on tasks
- Leave time management
- Task, project, and customer management
- User management

For more details: https://www.actitime.com/api-documentation`,
      }],
    };
  }

  if (uri === `actitime://config/${companyName}`) {
    return {
      contents: [{
        uri,
        mimeType: 'text/plain',
        text: `actiTIME Configuration

Company: ${companyName}
Base URL: ${CONFIG.baseUrl}
Username: ${CONFIG.username}
Connected: ${CONFIG.username && CONFIG.password ? 'Yes' : 'No'}`,
      }],
    };
  }

  throw new Error(`Unknown resource: ${uri}`);
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(`actiTIME MCP Server running for company: ${companyName}`);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
