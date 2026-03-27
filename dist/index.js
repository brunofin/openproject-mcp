import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { OpenProjectClient } from './client.js';
const OPENPROJECT_BASE_URL = process.env.OPENPROJECT_BASE_URL || '';
const OPENPROJECT_API_KEY = process.env.OPENPROJECT_API_KEY || '';
const client = new OpenProjectClient({
    baseUrl: OPENPROJECT_BASE_URL,
    apiKey: OPENPROJECT_API_KEY,
});
const server = new Server({
    name: 'openproject-mcp',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            // ==================== Projects ====================
            {
                name: 'op_list_projects',
                description: 'List all projects in OpenProject. Use this to see available projects and their identifiers.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', description: 'Page number for pagination' },
                        perPage: { type: 'number', description: 'Number of results per page (max 100)' },
                        filters: { type: 'string', description: 'JSON filter string for advanced filtering' },
                        sortBy: { type: 'string', description: 'Sort expression (e.g., [["name","asc"]])' },
                    },
                },
            },
            {
                name: 'op_get_project',
                description: 'Get detailed information about a specific project by ID or identifier.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                    },
                    required: ['projectId'],
                },
            },
            {
                name: 'op_create_project',
                description: 'Create a new project in OpenProject.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'Project name' },
                        identifier: { type: 'string', description: 'Project identifier (unique, lowercase, hyphens)' },
                        description: { type: 'string', description: 'Project description' },
                        parentId: { type: 'number', description: 'Parent project ID for subprojects' },
                        active: { type: 'boolean', description: 'Whether project is active (default true)' },
                        public: { type: 'boolean', description: 'Whether project is public (default false)' },
                    },
                    required: ['name', 'identifier'],
                },
            },
            {
                name: 'op_update_project',
                description: 'Update an existing project.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier to update' },
                        name: { type: 'string', description: 'New project name' },
                        description: { type: 'string', description: 'New project description' },
                        active: { type: 'boolean', description: 'Set project active state' },
                        public: { type: 'boolean', description: 'Set project public state' },
                        status: { type: 'string', description: 'Project status: on_track, at_risk, off_track' },
                    },
                    required: ['projectId'],
                },
            },
            {
                name: 'op_delete_project',
                description: 'Delete a project. Warning: This is destructive!',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier to delete' },
                    },
                    required: ['projectId'],
                },
            },
            {
                name: 'op_list_project_members',
                description: 'List members of a project with their roles.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                    },
                    required: ['projectId'],
                },
            },
            {
                name: 'op_add_project_member',
                description: 'Add a member to a project with specified roles.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                        userId: { type: 'number', description: 'The user ID to add' },
                        roleIds: { type: 'array', items: { type: 'number' }, description: 'Array of role IDs to assign' },
                    },
                    required: ['projectId', 'userId', 'roleIds'],
                },
            },
            {
                name: 'op_remove_project_member',
                description: 'Remove a member from a project.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                        membershipId: { type: 'number', description: 'The membership ID to remove' },
                    },
                    required: ['projectId', 'membershipId'],
                },
            },
            {
                name: 'op_list_project_versions',
                description: 'List versions (milestones/releases) in a project.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                    },
                    required: ['projectId'],
                },
            },
            {
                name: 'op_create_version',
                description: 'Create a new version in a project.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                        name: { type: 'string', description: 'Version name' },
                        description: { type: 'string', description: 'Version description' },
                        status: { type: 'string', description: 'Version status: open, locked, closed' },
                        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                        dueDate: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
                    },
                    required: ['projectId', 'name'],
                },
            },
            // ==================== Work Packages ====================
            {
                name: 'op_list_work_packages',
                description: 'List work packages with optional filtering. Use filters to find work packages by status, type, assignee, project, etc.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'Filter by project ID' },
                        filters: { type: 'string', description: 'JSON filter string (e.g., [{"status":{"operator":"o","values":["1","2","3"]}}])' },
                        page: { type: 'number', description: 'Page number' },
                        perPage: { type: 'number', description: 'Results per page (max 100)' },
                        sortBy: { type: 'string', description: 'Sort expression (e.g., [["id","desc"]])' },
                    },
                },
            },
            {
                name: 'op_get_work_package',
                description: 'Get detailed information about a specific work package by ID.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workPackageId: { type: 'number', description: 'The work package ID' },
                    },
                    required: ['workPackageId'],
                },
            },
            {
                name: 'op_create_work_package',
                description: 'Create a new work package (task, bug, feature, etc.) in a project.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        subject: { type: 'string', description: 'Work package subject/title' },
                        description: { type: 'string', description: 'Work package description' },
                        projectId: { type: 'string', description: 'Project ID or identifier' },
                        typeId: { type: 'number', description: 'Type ID (Task, Bug, Feature, etc.)' },
                        statusId: { type: 'number', description: 'Status ID' },
                        priorityId: { type: 'number', description: 'Priority ID' },
                        assigneeId: { type: 'number', description: 'Assignee user ID' },
                        startDate: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
                        dueDate: { type: 'string', description: 'Due date (YYYY-MM-DD)' },
                        estimatedTime: { type: 'string', description: 'Estimated time (e.g., "PT2H" for 2 hours)' },
                        parentId: { type: 'number', description: 'Parent work package ID for subtasks' },
                        versionId: { type: 'number', description: 'Version ID to assign' },
                    },
                    required: ['subject', 'projectId'],
                },
            },
            {
                name: 'op_update_work_package',
                description: 'Update an existing work package. Use to change status, priority, assignee, dates, etc.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workPackageId: { type: 'number', description: 'The work package ID to update' },
                        subject: { type: 'string', description: 'New subject' },
                        description: { type: 'string', description: 'New description' },
                        statusId: { type: 'number', description: 'New status ID' },
                        typeId: { type: 'number', description: 'New type ID' },
                        priorityId: { type: 'number', description: 'New priority ID' },
                        assigneeId: { type: 'number', description: 'New assignee user ID' },
                        startDate: { type: 'string', description: 'New start date (YYYY-MM-DD)' },
                        dueDate: { type: 'string', description: 'New due date (YYYY-MM-DD)' },
                        estimatedTime: { type: 'string', description: 'New estimated time' },
                        percentageDone: { type: 'number', description: 'Progress percentage (0-100)' },
                        parentId: { type: 'number', description: 'New parent work package ID' },
                        versionId: { type: 'number', description: 'New version ID' },
                        lockVersion: { type: 'number', description: 'Lock version for optimistic locking (get from current work package)' },
                    },
                    required: ['workPackageId'],
                },
            },
            {
                name: 'op_delete_work_package',
                description: 'Delete a work package. Warning: This is destructive!',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workPackageId: { type: 'number', description: 'The work package ID to delete' },
                    },
                    required: ['workPackageId'],
                },
            },
            {
                name: 'op_list_work_package_activities',
                description: 'List activities (comments, changes) on a work package.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workPackageId: { type: 'number', description: 'The work package ID' },
                    },
                    required: ['workPackageId'],
                },
            },
            {
                name: 'op_add_work_package_comment',
                description: 'Add a comment to a work package.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workPackageId: { type: 'number', description: 'The work package ID' },
                        comment: { type: 'string', description: 'Comment text' },
                    },
                    required: ['workPackageId', 'comment'],
                },
            },
            {
                name: 'op_list_work_package_relations',
                description: 'List relations to other work packages.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workPackageId: { type: 'number', description: 'The work package ID' },
                    },
                    required: ['workPackageId'],
                },
            },
            {
                name: 'op_create_work_package_relation',
                description: 'Create a relation between two work packages.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workPackageId: { type: 'number', description: 'Source work package ID' },
                        type: { type: 'string', description: 'Relation type: relates, blocks, precedes, follows, includes, requires' },
                        workPackageIdTo: { type: 'number', description: 'Target work package ID' },
                    },
                    required: ['workPackageId', 'type', 'workPackageIdTo'],
                },
            },
            {
                name: 'op_delete_work_package_relation',
                description: 'Delete a relation between work packages.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        workPackageId: { type: 'number', description: 'Source work package ID' },
                        relationId: { type: 'number', description: 'Relation ID to delete' },
                    },
                    required: ['workPackageId', 'relationId'],
                },
            },
            {
                name: 'op_get_project_work_packages',
                description: 'Get all work packages in a specific project.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                    },
                    required: ['projectId'],
                },
            },
            // ==================== Statuses ====================
            {
                name: 'op_list_statuses',
                description: 'List all available work package statuses.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            // ==================== Types ====================
            {
                name: 'op_list_types',
                description: 'List all work package types (Task, Bug, Feature, etc.).',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'op_get_project_types',
                description: 'List types available in a specific project.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                    },
                    required: ['projectId'],
                },
            },
            // ==================== Priorities ====================
            {
                name: 'op_list_priorities',
                description: 'List all work package priorities.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            // ==================== Users ====================
            {
                name: 'op_list_users',
                description: 'List all users in the OpenProject instance.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        page: { type: 'number', description: 'Page number' },
                        perPage: { type: 'number', description: 'Results per page' },
                        filters: { type: 'string', description: 'Filter string' },
                    },
                },
            },
            {
                name: 'op_get_user',
                description: 'Get detailed information about a specific user.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        userId: { type: 'number', description: 'The user ID' },
                    },
                    required: ['userId'],
                },
            },
            {
                name: 'op_get_current_user',
                description: 'Get information about the currently authenticated user.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'op_list_project_assignees',
                description: 'List users that can be assigned to work packages in a project.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        projectId: { type: 'string', description: 'The project ID or identifier' },
                    },
                    required: ['projectId'],
                },
            },
            // ==================== Roles & Groups ====================
            {
                name: 'op_list_roles',
                description: 'List all available roles in the system.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'op_list_groups',
                description: 'List all groups in the system.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            // ==================== Search ====================
            {
                name: 'op_search',
                description: 'Search for work packages across projects.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        query: { type: 'string', description: 'Search query string' },
                        projectId: { type: 'string', description: 'Limit search to project ID' },
                        typeId: { type: 'number', description: 'Filter by type ID' },
                        statusId: { type: 'number', description: 'Filter by status ID' },
                    },
                    required: ['query'],
                },
            },
        ],
    };
});
function getNumber(args, key) {
    const val = args?.[key];
    return typeof val === 'number' ? val : undefined;
}
function getString(args, key) {
    const val = args?.[key];
    return typeof val === 'string' ? val : undefined;
}
function getNumberOrString(args, key) {
    const val = args?.[key];
    return typeof val === 'string' || typeof val === 'number' ? val : undefined;
}
function getArray(args, key) {
    const val = args?.[key];
    return Array.isArray(val) ? val : undefined;
}
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            // ==================== Projects ====================
            case 'op_list_projects': {
                const result = await client.listProjects({
                    page: getNumber(args, 'page'),
                    perPage: getNumber(args, 'perPage'),
                    filters: getString(args, 'filters'),
                    sortBy: getString(args, 'sortBy'),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_get_project': {
                const result = await client.getProject(getString(args, 'projectId') || getNumber(args, 'projectId'));
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_create_project': {
                const result = await client.createProject({
                    name: getString(args, 'name'),
                    identifier: getString(args, 'identifier'),
                    description: getString(args, 'description'),
                    parentId: getNumber(args, 'parentId'),
                    active: args?.active ?? true,
                    public: args?.public ?? false,
                });
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_update_project': {
                const updateData = {};
                if (args?.name !== undefined)
                    updateData.name = args.name;
                if (args?.description !== undefined)
                    updateData.description = args.description;
                if (args?.active !== undefined)
                    updateData.active = args.active;
                if (args?.public !== undefined)
                    updateData.public = args.public;
                if (args?.status !== undefined)
                    updateData.status = args.status;
                const result = await client.updateProject(getString(args, 'projectId') || getNumber(args, 'projectId'), updateData);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_delete_project': {
                await client.deleteProject(getString(args, 'projectId') || getNumber(args, 'projectId'));
                return { content: [{ type: 'text', text: 'Project deleted successfully' }] };
            }
            case 'op_list_project_members': {
                const result = await client.listProjectMembers(getString(args, 'projectId') || getNumber(args, 'projectId'));
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_add_project_member': {
                const result = await client.addProjectMember(getString(args, 'projectId') || getNumber(args, 'projectId'), getNumber(args, 'userId'), getArray(args, 'roleIds') || []);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_remove_project_member': {
                await client.removeProjectMember(getString(args, 'projectId') || getNumber(args, 'projectId'), getNumber(args, 'membershipId'));
                return { content: [{ type: 'text', text: 'Member removed successfully' }] };
            }
            case 'op_list_project_versions': {
                const result = await client.listProjectVersions(getString(args, 'projectId') || getNumber(args, 'projectId'));
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_create_version': {
                const result = await client.createVersion(getString(args, 'projectId') || getNumber(args, 'projectId'), {
                    name: getString(args, 'name'),
                    description: getString(args, 'description'),
                    status: getString(args, 'status'),
                    startDate: getString(args, 'startDate'),
                    dueDate: getString(args, 'dueDate'),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            // ==================== Work Packages ====================
            case 'op_list_work_packages': {
                const result = await client.listWorkPackages({
                    projectId: getString(args, 'projectId') || getNumber(args, 'projectId'),
                    filters: getString(args, 'filters'),
                    page: getNumber(args, 'page'),
                    perPage: getNumber(args, 'perPage'),
                    sortBy: getString(args, 'sortBy'),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_get_work_package': {
                const result = await client.getWorkPackage(getNumber(args, 'workPackageId'));
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_create_work_package': {
                const result = await client.createWorkPackage({
                    subject: getString(args, 'subject'),
                    description: getString(args, 'description'),
                    projectId: getString(args, 'projectId') || getNumber(args, 'projectId'),
                    typeId: getNumber(args, 'typeId'),
                    statusId: getNumber(args, 'statusId'),
                    priorityId: getNumber(args, 'priorityId'),
                    assigneeId: getNumber(args, 'assigneeId'),
                    startDate: getString(args, 'startDate'),
                    dueDate: getString(args, 'dueDate'),
                    estimatedTime: getString(args, 'estimatedTime'),
                    parentId: getNumber(args, 'parentId'),
                    versionId: getNumber(args, 'versionId'),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_update_work_package': {
                const result = await client.updateWorkPackage(getNumber(args, 'workPackageId'), {
                    subject: getString(args, 'subject'),
                    description: getString(args, 'description'),
                    statusId: getNumber(args, 'statusId'),
                    typeId: getNumber(args, 'typeId'),
                    priorityId: getNumber(args, 'priorityId'),
                    assigneeId: getNumber(args, 'assigneeId'),
                    startDate: getString(args, 'startDate'),
                    dueDate: getString(args, 'dueDate'),
                    estimatedTime: getString(args, 'estimatedTime'),
                    percentageDone: getNumber(args, 'percentageDone'),
                    parentId: getNumber(args, 'parentId'),
                    versionId: getNumber(args, 'versionId'),
                    lockVersion: getNumber(args, 'lockVersion'),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_delete_work_package': {
                await client.deleteWorkPackage(getNumber(args, 'workPackageId'));
                return { content: [{ type: 'text', text: 'Work package deleted successfully' }] };
            }
            case 'op_list_work_package_activities': {
                const result = await client.listWorkPackageActivities(getNumber(args, 'workPackageId'));
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_add_work_package_comment': {
                const result = await client.addWorkPackageComment(getNumber(args, 'workPackageId'), getString(args, 'comment'));
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_list_work_package_relations': {
                const result = await client.listWorkPackageRelations(getNumber(args, 'workPackageId'));
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_create_work_package_relation': {
                const result = await client.createWorkPackageRelation(getNumber(args, 'workPackageId'), {
                    type: getString(args, 'type'),
                    workPackageIdTo: getNumber(args, 'workPackageIdTo'),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_delete_work_package_relation': {
                await client.deleteWorkPackageRelation(getNumber(args, 'workPackageId'), getNumber(args, 'relationId'));
                return { content: [{ type: 'text', text: 'Relation deleted successfully' }] };
            }
            case 'op_get_project_work_packages': {
                const result = await client.getProjectWorkPackages(getString(args, 'projectId') || getNumber(args, 'projectId'));
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            // ==================== Statuses ====================
            case 'op_list_statuses': {
                const result = await client.listStatuses();
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            // ==================== Types ====================
            case 'op_list_types': {
                const result = await client.listTypes();
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_get_project_types': {
                const result = await client.getProjectTypes(getString(args, 'projectId') || getNumber(args, 'projectId'));
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            // ==================== Priorities ====================
            case 'op_list_priorities': {
                const result = await client.listPriorities();
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            // ==================== Users ====================
            case 'op_list_users': {
                const result = await client.listUsers({
                    page: getNumber(args, 'page'),
                    perPage: getNumber(args, 'perPage'),
                    filters: getString(args, 'filters'),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_get_user': {
                const result = await client.getUser(getNumber(args, 'userId'));
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_get_current_user': {
                const result = await client.getCurrentUser();
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'op_list_project_assignees': {
                const result = await client.listProjectAvailableAssignees(getString(args, 'projectId') || getNumber(args, 'projectId'));
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            // ==================== Roles & Groups ====================
            case 'op_list_roles': {
                const result = await client.listRoles();
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            case 'op_list_groups': {
                const result = await client.listGroups();
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            // ==================== Search ====================
            case 'op_search': {
                const result = await client.search(getString(args, 'query'), {
                    projectId: getString(args, 'projectId') || getNumber(args, 'projectId'),
                    typeId: getNumber(args, 'typeId'),
                    statusId: getNumber(args, 'statusId'),
                });
                return { content: [{ type: 'text', text: JSON.stringify(result._embedded.elements, null, 2) }] };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    catch (error) {
        return {
            content: [
                {
                    type: 'text',
                    text: `Error: ${error.message}\n${error.response?.data ? JSON.stringify(error.response.data, null, 2) : ''}`,
                },
            ],
            isError: true,
        };
    }
});
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('OpenProject MCP Server running on stdio');
}
main().catch(console.error);
