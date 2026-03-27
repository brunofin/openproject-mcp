# OpenProject MCP Server

A Model Context Protocol (MCP) server that enables AI agents to interact with OpenProject's APIv3 for autonomous project management.

## Overview

This MCP server provides a comprehensive set of tools that allow an AI agent to:
- List, create, update, and delete projects
- Manage work packages (tasks, bugs, features, etc.)
- Handle project members and versions
- Query statuses, types, priorities, users, and roles
- Search across work packages

## Features

### Projects
- List all projects with pagination and filtering
- Get detailed project information
- Create new projects
- Update project details (name, description, status)
- Delete projects
- Manage project members (add/remove)
- Manage project versions

### Work Packages
- List work packages with advanced filtering
- Get detailed work package information
- Create new work packages
- Update work packages (status, priority, assignee, dates, etc.)
- Delete work packages
- View activity history and comments
- Add comments to work packages
- Manage relations between work packages

### Reference Data
- List all available statuses
- List all work package types
- List all priorities
- List all users
- List users available for assignment in a project
- List all roles
- List all groups

### Search
- Full-text search across work packages

## Prerequisites

- Node.js 18+
- An OpenProject instance with API access

## Installation

```bash
# Clone or download this repository
cd openproject-mcp

# Install dependencies
npm install

# Build the TypeScript code
npm run build
```

## Configuration

Set the following environment variables:

```bash
export OPENPROJECT_BASE_URL="https://your-openproject-instance.com"
export OPENPROJECT_API_KEY="your-api-key"
```

To get an API key:
1. Log into OpenProject
2. Go to My Account → API Access Keys
3. Generate a new API key

## Running

```bash
# Set environment variables first
export OPENPROJECT_BASE_URL="https://your-openproject-instance.com"
export OPENPROJECT_API_KEY="your-api-key"

# Run the server
node dist/index.js
```

## Claude Desktop Integration

Add to your `claude.json`:

```json
{
  "mcpServers": {
    "openproject": {
      "command": "node",
      "args": ["/path/to/openproject-mcp/dist/index.js"],
      "env": {
        "OPENPROJECT_BASE_URL": "https://your-openproject-instance.com",
        "OPENPROJECT_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Usage Example

Here's how an agent might use the tools:

1. **List projects** to see what's available
2. **Get project types** to understand what work package types exist
3. **Get statuses** to know what transitions are possible
4. **List users** to find assignable team members
5. **Create a work package** with subject, type, priority
6. **Update the work package** as work progresses (change status, update assignee)
7. **Add comments** to document progress
8. **Search** to find related work packages

## Tool Reference

| Tool | Description |
|------|-------------|
| `op_list_projects` | List all projects |
| `op_get_project` | Get project details |
| `op_create_project` | Create a new project |
| `op_update_project` | Update project |
| `op_delete_project` | Delete a project |
| `op_list_project_members` | List project members |
| `op_add_project_member` | Add member to project |
| `op_remove_project_member` | Remove member from project |
| `op_list_project_versions` | List project versions |
| `op_create_version` | Create a version |
| `op_list_work_packages` | List work packages |
| `op_get_work_package` | Get work package details |
| `op_create_work_package` | Create a work package |
| `op_update_work_package` | Update work package |
| `op_delete_work_package` | Delete work package |
| `op_list_work_package_activities` | List activities |
| `op_add_work_package_comment` | Add comment |
| `op_list_work_package_relations` | List relations |
| `op_create_work_package_relation` | Create relation |
| `op_delete_work_package_relation` | Delete relation |
| `op_get_project_work_packages` | Get all WPs in project |
| `op_list_statuses` | List all statuses |
| `op_list_types` | List all types |
| `op_get_project_types` | List types in project |
| `op_list_priorities` | List all priorities |
| `op_list_users` | List all users |
| `op_get_user` | Get user details |
| `op_get_current_user` | Get current user |
| `op_list_project_assignees` | List assignable users |
| `op_list_roles` | List all roles |
| `op_list_groups` | List all groups |
| `op_search` | Search work packages |

## Architecture

- **client.ts**: OpenProject API client using axios with Basic Auth
- **index.ts**: MCP server implementation with all tool handlers

## License

MIT