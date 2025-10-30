# Clerk MCP Server Setup for Atraiva

## Overview
This document outlines the setup process for integrating the Clerk MCP (Model Context Protocol) server with Claude Desktop for the Atraiva project.

## Configuration Files

### Local Claude Desktop Config
A `claude_desktop_config.json` file has been created in the `.claude` directory with the Clerk MCP server configuration:

```json
{
  "mcpServers": {
    "clerk": {
      "command": "npx",
      "args": ["-y", "@clerk/agent-toolkit", "-p=local-mcp", "--tools=users,organizations,invitations"],
      "env": {
        "CLERK_SECRET_KEY": "your_clerk_secret_key_here"
      }
    }
  }
}
```

## Setup Instructions

### 1. Update Your Clerk Secret Key
Replace `"your_clerk_secret_key_here"` in the configuration file with your actual Clerk secret key:
- Get your secret key from the [Clerk Dashboard](https://dashboard.clerk.com/)
- Navigate to your project → API Keys
- Copy the Secret Key (starts with `sk_`)

### 2. Global Claude Desktop Configuration
For Claude Desktop to recognize the MCP server, you need to update your global configuration file:

**Windows**: `%APPDATA%/Claude/claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Linux**: `~/.config/Claude/claude_desktop_config.json`

Copy the contents from `.claude/claude_desktop_config.json` to your global config file.

### 3. Restart Claude Desktop
After updating the configuration:
1. Close Claude Desktop completely
2. Restart the application
3. The Clerk MCP server should now be available

## Available Tools
The Clerk MCP server provides access to:
- **Users**: Create, retrieve, update, and delete user accounts
- **Organizations**: Manage organizations and memberships
- **Invitations**: Handle organization invitations

## Verification
To verify the setup works:
1. Open a new chat in Claude Desktop
2. Ask: "What Clerk tools are available?"
3. You should see the Clerk MCP tools listed

## Troubleshooting

### Common Issues
1. **JSON Validation Error**: Use an online JSON validator to check your configuration
2. **Path Issues**: Ensure `npx` is available in your system PATH
3. **Authentication**: Make sure your Clerk secret key is valid and has proper permissions

### Logs
Check Claude Desktop logs for MCP-related issues:
- **macOS**: `~/Library/Logs/Claude/mcp.log`
- **Windows**: `%APPDATA%/Claude/Logs/mcp.log`

## Security Note
Keep your Clerk secret key secure and never commit it to version control. Consider using environment variables for production deployments.