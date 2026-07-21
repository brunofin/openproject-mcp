import axios, { AxiosInstance } from 'axios';

export interface OpenProjectConfig {
  baseUrl: string;
  apiKey: string;
}

function createBasicAuthHeader(apiKey: string): string {
  const credentials = Buffer.from(`apikey:${apiKey}`).toString('base64');
  return `Basic ${credentials}`;
}

export interface WorkPackage {
  id: number;
  subject: string;
  description?: any;
  status: { href: string; title: string };
  type: { href: string; title: string };
  priority?: { href: string; title: string };
  assignee?: { href: string; title: string; name: string };
  author?: { href: string; title: string; name: string };
  project: { href: string; identifier: string; name: string };
  startDate?: string;
  dueDate?: string;
  estimatedTime?: string;
  spentTime?: string;
  percentageDone?: number;
  lockVersion: number;
  _links?: {
    self: { href: string };
    update?: { href: string };
    updateImmediately?: { href: string };
    delete?: { href: string };
    schema?: { href: string };
  };
}

export interface Project {
  id: number;
  identifier: string;
  name: string;
  description?: any;
  active: boolean;
  public: boolean;
  createdAt: string;
  updatedAt: string;
  status?: { href: string; title: string };
  parent?: { href: string; title: string };
  _links?: {
    self: { href: string };
    workPackages?: { href: string };
    createWorkPackageImmediately?: { href: string };
  };
}

export interface Status {
  id: number;
  name: string;
  isDefault: boolean;
  isClosed: boolean;
  color: string;
  position: number;
}

export interface Type {
  id: number;
  name: string;
  color: string;
  position: number;
  isDefault: boolean;
  isMilestone: boolean;
}

export interface Priority {
  id: number;
  name: string;
  position: number;
  isDefault: boolean;
}

export interface User {
  id: number;
  name: string;
  login: string;
  email: string;
  avatar?: string;
  firstName?: string;
  lastName?: string;
}

export interface Version {
  id: number;
  name: string;
  description?: string;
  status: string;
  sharing: string;
  createdAt: string;
  updatedAt: string;
  startDate?: string;
  dueDate?: string;
}

export interface Membership {
  id: number;
  _links: {
    user: { href: string; title: string };
    project: { href: string; title: string };
    role: { href: string; title: string }[];
  };
}

export interface Activity {
  id: number;
  type: string;
  createdAt: string;
  user: { href: string; title: string };
  description: string;
  details: { format: string; raw: string; html: string }[];
  htmlMessage?: string;
}

export interface Relation {
  id: number;
  type: string;
  _links: {
    self: { href: string };
    workPackageFrom: { href: string; title: string };
    workPackageTo: { href: string; title: string };
  };
}

export class OpenProjectClient {
  private client: AxiosInstance;

  constructor(config: OpenProjectConfig) {
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

  async listProjects(params?: {
    page?: number;
    perPage?: number;
    filters?: string;
    sortBy?: string;
  }): Promise<{ _embedded: { elements: Project[] }; total: number }> {
    const queryParams: any = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.perPage) queryParams.perPage = params.perPage;
    if (params?.filters) queryParams.filters = params.filters;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;

    const response = await this.client.get('/api/v3/projects', { params: queryParams });
    return response.data;
  }

  async getProject(projectId: number | string): Promise<Project> {
    const response = await this.client.get(`/api/v3/projects/${projectId}`);
    return response.data;
  }

  async createProject(data: {
    name: string;
    identifier: string;
    description?: string;
    parentId?: number;
    active?: boolean;
    public?: boolean;
  }): Promise<Project> {
    const { description, parentId, ...rest } = data;
    const payload: any = { ...rest };
    if (description !== undefined) {
      payload.description = { format: 'markdown', raw: description };
    }
    if (parentId !== undefined) {
      payload._links = { parent: { href: `/api/v3/projects/${parentId}` } };
    }
    const response = await this.client.post('/api/v3/projects', payload);
    return response.data;
  }

  async updateProject(projectId: number | string, data: Partial<{
    name: string;
    description: string;
    active: boolean;
    public: boolean;
    parentId: number;
    status: string;
  }>): Promise<Project> {
    const { description, parentId, ...rest } = data;
    const payload: any = { ...rest };
    if (description !== undefined) {
      payload.description = { format: 'markdown', raw: description };
    }
    if (parentId !== undefined) {
      payload._links = { parent: { href: `/api/v3/projects/${parentId}` } };
    }
    const response = await this.client.patch(`/api/v3/projects/${projectId}`, payload);
    return response.data;
  }

  async deleteProject(projectId: number | string): Promise<void> {
    await this.client.delete(`/api/v3/projects/${projectId}`);
  }

  async listProjectMembers(projectId: number | string): Promise<{ _embedded: { elements: Membership[] } }> {
    const filters = JSON.stringify([
      { project: { operator: '=', values: [String(projectId)] } },
    ]);
    const response = await this.client.get(
      `/api/v3/memberships?filters=${encodeURIComponent(filters)}`,
    );
    return response.data;
  }

  async addProjectMember(projectId: number | string, userId: number, roleIds: number[]): Promise<Membership> {
    const response = await this.client.post('/api/v3/memberships', {
      _links: {
        project: { href: `/api/v3/projects/${projectId}` },
        principal: { href: `/api/v3/users/${userId}` },
        roles: roleIds.map(id => ({ href: `/api/v3/roles/${id}` })),
      },
    });
    return response.data;
  }

  async removeProjectMember(_projectId: number | string, membershipId: number): Promise<void> {
    await this.client.delete(`/api/v3/memberships/${membershipId}`);
  }

  async listProjectVersions(projectId: number | string): Promise<{ _embedded: { elements: Version[] } }> {
    const response = await this.client.get(`/api/v3/projects/${projectId}/versions`);
    return response.data;
  }

  async createVersion(projectId: number | string, data: {
    name: string;
    description?: string;
    status?: string;
    startDate?: string;
    dueDate?: string;
  }): Promise<Version> {
    const response = await this.client.post(`/api/v3/projects/${projectId}/versions`, data);
    return response.data;
  }

  // ==================== Work Packages ====================

  async listWorkPackages(params?: {
    projectId?: number | string;
    filters?: string;
    page?: number;
    perPage?: number;
    sortBy?: string;
    select?: string;
  }): Promise<{ _embedded: { elements: WorkPackage[] }; total: number }> {
    const queryParams: any = {};
    if (params?.projectId) queryParams.projectId = params.projectId;
    if (params?.filters) queryParams.filters = params.filters;
    if (params?.page) queryParams.page = params.page;
    if (params?.perPage) queryParams.perPage = params.perPage;
    if (params?.sortBy) queryParams.sortBy = params.sortBy;
    if (params?.select) queryParams.select = params.select;

    const response = await this.client.get('/api/v3/work_packages', { params: queryParams });
    return response.data;
  }

  async getWorkPackage(workPackageId: number): Promise<WorkPackage> {
    const response = await this.client.get(`/api/v3/work_packages/${workPackageId}`);
    return response.data;
  }

  async createWorkPackage(data: {
    subject: string;
    description?: string;
    projectId: number | string;
    typeId?: number;
    statusId?: number;
    priorityId?: number;
    assigneeId?: number;
    startDate?: string;
    dueDate?: string;
    estimatedTime?: string;
    parentId?: number;
    versionId?: number;
  }): Promise<WorkPackage> {
    const payload: any = {
      subject: data.subject,
      _links: {
        project: { href: `/api/v3/projects/${data.projectId}` },
      },
    };

    if (data.description) payload.description = { raw: data.description };
    if (data.typeId) payload._links.type = { href: `/api/v3/types/${data.typeId}` };
    if (data.statusId) payload._links.status = { href: `/api/v3/statuses/${data.statusId}` };
    if (data.priorityId) payload._links.priority = { href: `/api/v3/priorities/${data.priorityId}` };
    if (data.assigneeId) payload._links.assignee = { href: `/api/v3/users/${data.assigneeId}` };
    if (data.startDate) payload.startDate = data.startDate;
    if (data.dueDate) payload.dueDate = data.dueDate;
    if (data.estimatedTime) payload.estimatedTime = data.estimatedTime;
    if (data.parentId) payload._links.parent = { href: `/api/v3/work_packages/${data.parentId}` };
    if (data.versionId) payload._links.version = { href: `/api/v3/versions/${data.versionId}` };

    const response = await this.client.post('/api/v3/work_packages', payload);
    return response.data;
  }

  async updateWorkPackage(workPackageId: number, data: Partial<{
    subject: string;
    description: string;
    statusId: number;
    typeId: number;
    priorityId: number;
    assigneeId: number;
    startDate: string;
    dueDate: string;
    estimatedTime: string;
    percentageDone: number;
    parentId: number;
    versionId: number;
    lockVersion: number;
  }>): Promise<WorkPackage> {
    const payload: any = {};
    
    if (data.subject !== undefined) payload.subject = data.subject;
    if (data.description !== undefined) payload.description = { raw: data.description };
    if (data.statusId !== undefined) payload._links = { status: { href: `/api/v3/statuses/${data.statusId}` } };
    if (data.typeId !== undefined) payload._links = { ...payload._links, type: { href: `/api/v3/types/${data.typeId}` } };
    if (data.priorityId !== undefined) payload._links = { ...payload._links, priority: { href: `/api/v3/priorities/${data.priorityId}` } };
    if (data.assigneeId !== undefined) payload._links = { ...payload._links, assignee: { href: `/api/v3/users/${data.assigneeId}` } };
    if (data.startDate !== undefined) payload.startDate = data.startDate;
    if (data.dueDate !== undefined) payload.dueDate = data.dueDate;
    if (data.estimatedTime !== undefined) payload.estimatedTime = data.estimatedTime;
    if (data.percentageDone !== undefined) payload.percentageDone = data.percentageDone;
    if (data.parentId !== undefined) payload._links = { ...payload._links, parent: { href: `/api/v3/work_packages/${data.parentId}` } };
    if (data.versionId !== undefined) payload._links = { ...payload._links, version: { href: `/api/v3/versions/${data.versionId}` } };
    if (data.lockVersion !== undefined) payload.lockVersion = data.lockVersion;

    const response = await this.client.patch(`/api/v3/work_packages/${workPackageId}`, payload);
    return response.data;
  }

  async deleteWorkPackage(workPackageId: number): Promise<void> {
    await this.client.delete(`/api/v3/work_packages/${workPackageId}`);
  }

  async listWorkPackageActivities(workPackageId: number): Promise<{ _embedded: { elements: Activity[] } }> {
    const response = await this.client.get(`/api/v3/work_packages/${workPackageId}/activities`);
    return response.data;
  }

  async addWorkPackageComment(workPackageId: number, comment: string): Promise<Activity> {
    const response = await this.client.post(`/api/v3/work_packages/${workPackageId}/activities`, {
      comment: { raw: comment },
    });
    return response.data;
  }

  async listWorkPackageRelations(workPackageId: number): Promise<{ _embedded: { elements: Relation[] } }> {
    const response = await this.client.get(`/api/v3/work_packages/${workPackageId}/relations`);
    return response.data;
  }

  async createWorkPackageRelation(workPackageId: number, data: {
    type: string;
    workPackageIdTo: number;
  }): Promise<Relation> {
    const response = await this.client.post(`/api/v3/work_packages/${workPackageId}/relations`, {
      _links: {
        to: { href: `/api/v3/work_packages/${data.workPackageIdTo}` },
      },
      type: data.type,
    });
    return response.data;
  }

  async deleteWorkPackageRelation(workPackageId: number, relationId: number): Promise<void> {
    await this.client.delete(`/api/v3/work_packages/${workPackageId}/relations/${relationId}`);
  }

  async getProjectWorkPackages(projectId: number | string): Promise<{ _embedded: { elements: WorkPackage[] } }> {
    const response = await this.client.get(`/api/v3/projects/${projectId}/work_packages`);
    return response.data;
  }

  // ==================== Statuses ====================

  async listStatuses(): Promise<{ _embedded: { elements: Status[] } }> {
    const response = await this.client.get('/api/v3/statuses');
    return response.data;
  }

  // ==================== Types ====================

  async listTypes(): Promise<{ _embedded: { elements: Type[] } }> {
    const response = await this.client.get('/api/v3/types');
    return response.data;
  }

  async getProjectTypes(projectId: number | string): Promise<{ _embedded: { elements: Type[] } }> {
    const response = await this.client.get(`/api/v3/projects/${projectId}/types`);
    return response.data;
  }

  // ==================== Priorities ====================

  async listPriorities(): Promise<{ _embedded: { elements: Priority[] } }> {
    const response = await this.client.get('/api/v3/priorities');
    return response.data;
  }

  // ==================== Users ====================

  async listUsers(params?: {
    page?: number;
    perPage?: number;
    filters?: string;
  }): Promise<{ _embedded: { elements: User[] } }> {
    const queryParams: any = {};
    if (params?.page) queryParams.page = params.page;
    if (params?.perPage) queryParams.perPage = params.perPage;
    if (params?.filters) queryParams.filters = params.filters;

    const response = await this.client.get('/api/v3/users', { params: queryParams });
    return response.data;
  }

  async getUser(userId: number): Promise<User> {
    const response = await this.client.get(`/api/v3/users/${userId}`);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/api/v3/users/me');
    return response.data;
  }

  async listProjectAvailableAssignees(projectId: number | string): Promise<{ _embedded: { elements: User[] } }> {
    const response = await this.client.get(`/api/v3/projects/${projectId}/available_assignees`);
    return response.data;
  }

  // ==================== Roles ====================

  async listRoles(): Promise<{ _embedded: { elements: { id: number; name: string }[] } }> {
    const response = await this.client.get('/api/v3/roles');
    return response.data;
  }

  // ==================== Groups ====================

  async listGroups(): Promise<{ _embedded: { elements: { id: number; name: string }[] } }> {
    const response = await this.client.get('/api/v3/groups');
    return response.data;
  }

  // ==================== Queries ====================

  async listQueries(params?: {
    projectId?: number | string;
  }): Promise<{ _embedded: { elements: any[] } }> {
    const queryParams: any = {};
    if (params?.projectId) queryParams.projectId = params.projectId;

    const response = await this.client.get('/api/v3/queries', { params: queryParams });
    return response.data;
  }

  // ==================== Root API ====================

  async getApiRoot(): Promise<any> {
    const response = await this.client.get('/api/v3');
    return response.data;
  }

  // ==================== Search ====================

  async search(query: string, params?: {
    projectId?: number | string;
    typeId?: number;
    statusId?: number;
  }): Promise<{ _embedded: { elements: WorkPackage[] } }> {
    const queryParams: any = { q: query };
    if (params?.projectId) queryParams.projectId = params.projectId;
    if (params?.typeId) queryParams.typeId = params.typeId;
    if (params?.statusId) queryParams.statusId = params.statusId;

    const response = await this.client.get('/api/v3/search', { params: queryParams });
    return response.data;
  }
}