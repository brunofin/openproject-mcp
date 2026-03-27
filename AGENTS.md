# OpenProject MCP Server

This MCP server provides tools to interact with OpenProject's APIv3 for autonomous project management.

## Configuration

### Environment Variables
- `OPENPROJECT_BASE_URL`: Base URL of OpenProject instance
- `OPENPROJECT_API_KEY`: API key for authentication

### Claude Desktop Configuration

Add to your `claude.json` or equivalent:

```json
{
  "mcpServers": {
    "openproject": {
      "command": "node",
      "args": ["/path/to/openproject-mcp/dist/index.js"],
      "env": {
        "OPENPROJECT_BASE_URL": "https://openproject.finger.sh",
        "OPENPROJECT_API_KEY": "your-api-key"
      }
    }
  }
}
```

## Available Tools

### Projects
- `op_list_projects` - List all projects
- `op_get_project` - Get project details
- `op_create_project` - Create a new project
- `op_update_project` - Update project details
- `op_delete_project` - Delete a project
- `op_list_project_members` - List project members
- `op_add_project_member` - Add member to project
- `op_remove_project_member` - Remove member from project
- `op_list_project_versions` - List project versions
- `op_create_version` - Create a version

### Work Packages
- `op_list_work_packages` - List work packages with filters
- `op_get_work_package` - Get work package details
- `op_create_work_package` - Create a work package
- `op_update_work_package` - Update work package (status, priority, assignee, etc.)
- `op_delete_work_package` - Delete a work package
- `op_list_work_package_activities` - List activities/comments
- `op_add_work_package_comment` - Add a comment
- `op_list_work_package_relations` - List relations
- `op_create_work_package_relation` - Create a relation
- `op_delete_work_package_relation` - Delete a relation
- `op_get_project_work_packages` - Get all work packages in a project

### Reference Data
- `op_list_statuses` - List all statuses
- `op_list_types` - List all work package types
- `op_get_project_types` - List types in a project
- `op_list_priorities` - List all priorities
- `op_list_users` - List all users
- `op_get_user` - Get user details
- `op_get_current_user` - Get current authenticated user
- `op_list_project_assignees` - List assignable users in a project
- `op_list_roles` - List all roles
- `op_list_groups` - List all groups
- `op_search` - Search work packages

## Usage Examples

### First Steps
1. List all projects to understand available projects
2. Get project types to know what work package types exist
3. Get project statuses to see available statuses
4. List users to know user IDs for assignments

### Creating a Work Package
```json
{
  "subject": "Implement new feature",
  "description": "Add user authentication",
  "projectId": "my-project",
  "typeId": 1,
  "priorityId": 4
}
```

### Updating Work Package Status
```json
{
  "workPackageId": 123,
  "statusId": 2,
  "lockVersion": 1
}
```

### Filtering Work Packages
Use the filters parameter with JSON:
```json
filters: "[{\"status\":{\"operator\":\"o\",\"values\":[\"1\",\"2\",\"3\"]}}]"
```

Operators:
- `o` - open
- `c` - closed  
- `=` - equals
- `!` - not equal
- `~` - contains
- `>=` - greater than or equal
- `<=` - less than or equal

## Important Notes

1. **Lock Version**: When updating work packages, you may need the `lockVersion` from the current work package for optimistic locking.

2. **Work Package Properties**:
   - `subject` - Required, the title
   - `description` - Optional, supports markdown
   - `projectId` - Required, project identifier or ID
   - `typeId` - Optional, defaults to first type
   - `statusId` - Optional
   - `priorityId` - Optional
   - `assigneeId` - Optional, user ID
   - `startDate` - Optional, YYYY-MM-DD
   - `dueDate` - Optional, YYYY-MM-DD
   - `estimatedTime` - Optional, ISO 8601 duration (e.g., "PT2H")

3. **API Response Format**: All responses return HAL+JSON formatted data. The actual data is in `_embedded.elements` for collections.

4. **Permissions**: The API key determines what operations are allowed based on the user's permissions in OpenProject.