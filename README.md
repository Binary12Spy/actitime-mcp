# Actitime MCP (Model Context Protocol)

This project is an AI-generated Model Context Protocol (MCP) implementation for Actitime.

- **Purpose:** Provides programmatic tooling and automation for Actitime, including time tracking, leave management, and project/task operations.
- **Generation:** The codebase was generated using AI, leveraging the official Actitime `swagger.json` API specification as a reference for endpoints and data models.
- **Structure:**
  - `src/` contains TypeScript source files for Actitime client logic and tools.
  - Tooling covers users, projects, tasks, time tracking, and leave time.

## Disclaimer
This project is auto-generated and may require review or customization for production use. Please verify all API interactions and business logic before deployment.
## Using with VSCode + GitHub Copilot

You can use this project directly in VSCode with GitHub Copilot for automation and AI-driven workflows. To connect to your Actitime instance, configure your environment as follows:

1. Open the Command Palette and select your MCP server or extension.
2. Use the following configuration snippet to set up your connection (e.g., in `.vscode/mcp.json` or as prompted by your extension):

```json
{
  "inputs": [
    {
      "id": "actitime_company",
      "type": "promptString",
      "description": "actiTIME company name"
    },
    {
      "id": "actitime_username",
      "type": "promptString",
      "description": "actiTIME username"
    },
    {
      "id": "actitime_password",
      "type": "promptString",
      "description": "actiTIME password",
      "password": true
    }
  ],
  "servers": {
    "actitime": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@binary12spy/actitime-mcp",
        "${input:actitime_company}"
      ],
      "env": {
        "ACTITIME_USERNAME": "${input:actitime_username}",
        "ACTITIME_PASSWORD": "${input:actitime_password}"
      }
    }
  }
}
```

Replace the values as needed for your Actitime environment. This setup allows you to run the MCP server and interact with Actitime through VSCode and Copilot.
