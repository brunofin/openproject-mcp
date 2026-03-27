import axios from 'axios';
function createBasicAuthHeader(apiKey) {
    const credentials = Buffer.from(`apikey:${apiKey}`).toString('base64');
    return `Basic ${credentials}`;
}
export class OpenProjectClient {
    client;
    constructor(config) {
        this.client = axios.create({
            baseURL: config.baseUrl,
            headers: {
                'Authorization': createBasicAuthHeader(config.apiKey),
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });
    }
    // ==================== Projects ====================
    async listProjects(params) {
        const queryParams = {};
        if (params?.page)
            queryParams.page = params.page;
        if (params?.perPage)
            queryParams.perPage = params.perPage;
        if (params?.filters)
            queryParams.filters = params.filters;
        if (params?.sortBy)
            queryParams.sortBy = params.sortBy;
        const response = await this.client.get('/api/v3/projects', { params: queryParams });
        return response.data;
    }
    async getProject(projectId) {
        const response = await this.client.get(`/api/v3/projects/${projectId}`);
        return response.data;
    }
    async createProject(data) {
        const response = await this.client.post('/api/v3/projects', data);
        return response.data;
    }
    async updateProject(projectId, data) {
        const response = await this.client.patch(`/api/v3/projects/${projectId}`, data);
        return response.data;
    }
    async deleteProject(projectId) {
        await this.client.delete(`/api/v3/projects/${projectId}`);
    }
    async listProjectMembers(projectId) {
        const response = await this.client.get(`/api/v3/projects/${projectId}/memberships`);
        return response.data;
    }
    async addProjectMember(projectId, userId, roleIds) {
        const response = await this.client.post(`/api/v3/projects/${projectId}/memberships`, {
            user: { href: `/api/v3/users/${userId}` },
            roles: roleIds.map(id => ({ href: `/api/v3/roles/${id}` })),
        });
        return response.data;
    }
    async removeProjectMember(projectId, membershipId) {
        await this.client.delete(`/api/v3/projects/${projectId}/memberships/${membershipId}`);
    }
    async listProjectVersions(projectId) {
        const response = await this.client.get(`/api/v3/projects/${projectId}/versions`);
        return response.data;
    }
    async createVersion(projectId, data) {
        const response = await this.client.post(`/api/v3/projects/${projectId}/versions`, data);
        return response.data;
    }
    // ==================== Work Packages ====================
    async listWorkPackages(params) {
        const queryParams = {};
        if (params?.projectId)
            queryParams.projectId = params.projectId;
        if (params?.filters)
            queryParams.filters = params.filters;
        if (params?.page)
            queryParams.page = params.page;
        if (params?.perPage)
            queryParams.perPage = params.perPage;
        if (params?.sortBy)
            queryParams.sortBy = params.sortBy;
        if (params?.select)
            queryParams.select = params.select;
        const response = await this.client.get('/api/v3/work_packages', { params: queryParams });
        return response.data;
    }
    async getWorkPackage(workPackageId) {
        const response = await this.client.get(`/api/v3/work_packages/${workPackageId}`);
        return response.data;
    }
    async createWorkPackage(data) {
        const payload = {
            subject: data.subject,
            _links: {
                project: { href: `/api/v3/projects/${data.projectId}` },
            },
        };
        if (data.description)
            payload.description = { raw: data.description };
        if (data.typeId)
            payload._links.type = { href: `/api/v3/types/${data.typeId}` };
        if (data.statusId)
            payload._links.status = { href: `/api/v3/statuses/${data.statusId}` };
        if (data.priorityId)
            payload._links.priority = { href: `/api/v3/priorities/${data.priorityId}` };
        if (data.assigneeId)
            payload._links.assignee = { href: `/api/v3/users/${data.assigneeId}` };
        if (data.startDate)
            payload.startDate = data.startDate;
        if (data.dueDate)
            payload.dueDate = data.dueDate;
        if (data.estimatedTime)
            payload.estimatedTime = data.estimatedTime;
        if (data.parentId)
            payload._links.parent = { href: `/api/v3/work_packages/${data.parentId}` };
        if (data.versionId)
            payload._links.version = { href: `/api/v3/versions/${data.versionId}` };
        const response = await this.client.post('/api/v3/work_packages', payload);
        return response.data;
    }
    async updateWorkPackage(workPackageId, data) {
        const payload = {};
        if (data.subject !== undefined)
            payload.subject = data.subject;
        if (data.description !== undefined)
            payload.description = { raw: data.description };
        if (data.statusId !== undefined)
            payload._links = { status: { href: `/api/v3/statuses/${data.statusId}` } };
        if (data.typeId !== undefined)
            payload._links = { ...payload._links, type: { href: `/api/v3/types/${data.typeId}` } };
        if (data.priorityId !== undefined)
            payload._links = { ...payload._links, priority: { href: `/api/v3/priorities/${data.priorityId}` } };
        if (data.assigneeId !== undefined)
            payload._links = { ...payload._links, assignee: { href: `/api/v3/users/${data.assigneeId}` } };
        if (data.startDate !== undefined)
            payload.startDate = data.startDate;
        if (data.dueDate !== undefined)
            payload.dueDate = data.dueDate;
        if (data.estimatedTime !== undefined)
            payload.estimatedTime = data.estimatedTime;
        if (data.percentageDone !== undefined)
            payload.percentageDone = data.percentageDone;
        if (data.parentId !== undefined)
            payload._links = { ...payload._links, parent: { href: `/api/v3/work_packages/${data.parentId}` } };
        if (data.versionId !== undefined)
            payload._links = { ...payload._links, version: { href: `/api/v3/versions/${data.versionId}` } };
        if (data.lockVersion !== undefined)
            payload.lockVersion = data.lockVersion;
        const response = await this.client.patch(`/api/v3/work_packages/${workPackageId}`, payload);
        return response.data;
    }
    async deleteWorkPackage(workPackageId) {
        await this.client.delete(`/api/v3/work_packages/${workPackageId}`);
    }
    async listWorkPackageActivities(workPackageId) {
        const response = await this.client.get(`/api/v3/work_packages/${workPackageId}/activities`);
        return response.data;
    }
    async addWorkPackageComment(workPackageId, comment) {
        const response = await this.client.post(`/api/v3/work_packages/${workPackageId}/activities`, {
            comment: { raw: comment },
        });
        return response.data;
    }
    async listWorkPackageRelations(workPackageId) {
        const response = await this.client.get(`/api/v3/work_packages/${workPackageId}/relations`);
        return response.data;
    }
    async createWorkPackageRelation(workPackageId, data) {
        const response = await this.client.post(`/api/v3/work_packages/${workPackageId}/relations`, {
            _links: {
                workPackageTo: { href: `/api/v3/work_packages/${data.workPackageIdTo}` },
            },
            type: data.type,
        });
        return response.data;
    }
    async deleteWorkPackageRelation(workPackageId, relationId) {
        await this.client.delete(`/api/v3/work_packages/${workPackageId}/relations/${relationId}`);
    }
    async getProjectWorkPackages(projectId) {
        const response = await this.client.get(`/api/v3/projects/${projectId}/work_packages`);
        return response.data;
    }
    // ==================== Statuses ====================
    async listStatuses() {
        const response = await this.client.get('/api/v3/statuses');
        return response.data;
    }
    // ==================== Types ====================
    async listTypes() {
        const response = await this.client.get('/api/v3/types');
        return response.data;
    }
    async getProjectTypes(projectId) {
        const response = await this.client.get(`/api/v3/projects/${projectId}/types`);
        return response.data;
    }
    // ==================== Priorities ====================
    async listPriorities() {
        const response = await this.client.get('/api/v3/priorities');
        return response.data;
    }
    // ==================== Users ====================
    async listUsers(params) {
        const queryParams = {};
        if (params?.page)
            queryParams.page = params.page;
        if (params?.perPage)
            queryParams.perPage = params.perPage;
        if (params?.filters)
            queryParams.filters = params.filters;
        const response = await this.client.get('/api/v3/users', { params: queryParams });
        return response.data;
    }
    async getUser(userId) {
        const response = await this.client.get(`/api/v3/users/${userId}`);
        return response.data;
    }
    async getCurrentUser() {
        const response = await this.client.get('/api/v3/users/me');
        return response.data;
    }
    async listProjectAvailableAssignees(projectId) {
        const response = await this.client.get(`/api/v3/projects/${projectId}/available_assignees`);
        return response.data;
    }
    // ==================== Roles ====================
    async listRoles() {
        const response = await this.client.get('/api/v3/roles');
        return response.data;
    }
    // ==================== Groups ====================
    async listGroups() {
        const response = await this.client.get('/api/v3/groups');
        return response.data;
    }
    // ==================== Queries ====================
    async listQueries(params) {
        const queryParams = {};
        if (params?.projectId)
            queryParams.projectId = params.projectId;
        const response = await this.client.get('/api/v3/queries', { params: queryParams });
        return response.data;
    }
    // ==================== Root API ====================
    async getApiRoot() {
        const response = await this.client.get('/api/v3');
        return response.data;
    }
    // ==================== Search ====================
    async search(query, params) {
        const queryParams = { q: query };
        if (params?.projectId)
            queryParams.projectId = params.projectId;
        if (params?.typeId)
            queryParams.typeId = params.typeId;
        if (params?.statusId)
            queryParams.statusId = params.statusId;
        const response = await this.client.get('/api/v3/search', { params: queryParams });
        return response.data;
    }
}
